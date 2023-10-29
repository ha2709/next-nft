package main

import (
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"log"
	"net/http"
	"os"

	"api/pkg/models"
	"api/pkg/utils"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq" // PostgreSQL driver
	"github.com/rs/cors"
)

type Receipt struct {
	Hash string `json:"hash"`
}

func main() {
	// Load environment variables from the .env file
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// // Retrieve database connection parameters from environment variables
	// dbUser := os.Getenv("DATABASE_USER")
	// dbPassword := os.Getenv("DATABASE_PASSWORD")
	// dbName := os.Getenv("DATABASE_NAME")
	// dbHost := os.Getenv("DATABASE_HOST")
	// dbPort := os.Getenv("DATABASE_PORT")

	// // Construct the database connection string
	// dbConnectionString := "user=" + dbUser + " password=" + dbPassword + " dbname=" + dbName + " host=" + dbHost + " port=" + dbPort
	dbConnectionString := utils.GetDBConnectionString()
	db, err := sql.Open("postgres", dbConnectionString)
	// Connect to the database
	// db, err := sql.Open("postgres", os.Getenv("DATABASE_URL"))

	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Create the "users" table if it doesn't exist
	_, err = db.Exec("CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, NRIC TEXT, wallet_address TEXT)")

	if err != nil {
		log.Fatal(err)
	}

	// Create a router using Gorilla Mux
	router := mux.NewRouter()

	// Add the API version to the route paths
	apiV1 := router.PathPrefix("/api/v1").Subrouter()

	apiV1.HandleFunc("/users", getUsers(db)).Methods("GET")
	apiV1.HandleFunc("/users", createUser(db)).Methods("POST")

	// Set up CORS middleware
	corsMiddleware := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization", "Access-Control-Allow-Origin", "access_token"},
		ExposedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})

	// Apply the CORS middleware to the router
	handler := corsMiddleware.Handler(utils.JSONContentTypeMiddleware(router))

	// Start the HTTP server
	log.Fatal(http.ListenAndServe(":8000", handler))
}

// validate the API key from the request header
func validateAPIKey(r *http.Request) bool {
	apiKey := r.Header.Get("access_token")
	expectedKey := os.Getenv("API_KEY")
	// fmt.Println(apiKey, expectedKey)
	return expectedKey == apiKey
}

func jsonContentTypeMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		next.ServeHTTP(w, r)
	})
}

// Get all users
func getUsers(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		rows, err := db.Query("SELECT * FROM users")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		users := []models.User{}
		for rows.Next() {
			var u models.User
			if err := rows.Scan(&u.ID, &u.NRIC, &u.WalletAddress); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			users = append(users, u)
		}
		if err := rows.Err(); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		json.NewEncoder(w).Encode(users)
	}
}

func enableCORS(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, Access-Control-Allow-Origin")
	w.Header().Set("Access-Control-Expose-Headers", "Content-Type, Authorization")

}

func createUser(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		// Enable CORS
		enableCORS(w)
		if !validateAPIKey(r) {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}
		// Set the necessary headers for CORS
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000") // Replace with your actual frontend origin
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		var u models.User
		err := json.NewDecoder(r.Body).Decode(&u)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		// Check if the NRIC already exists in the database to enforce uniqueness.
		var existingID int
		err = db.QueryRow("SELECT id FROM users WHERE NRIC = $1", u.NRIC).Scan(&existingID)
		if err == nil {
			// NRIC already exists, return an error.
			http.Error(w, "NRIC already exists", http.StatusConflict)
			return
		} else if err != sql.ErrNoRows {
			// An unexpected error occurred during the query.
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		hash := hashUserData(u)

		// Insert the user into the database
		err = db.QueryRow("INSERT INTO users (NRIC, wallet_address) VALUES ($1, $2) RETURNING id", u.NRIC, u.WalletAddress).Scan(&u.ID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Respond with the hash as JSON
		receipt := Receipt{Hash: hash}
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(receipt)
	}
}

func hashUserData(user models.User) string {
	// Create a new SHA-256 hash
	hasher := sha256.New()

	// Hash the NRIC and wallet address
	hasher.Write([]byte(user.NRIC))
	hasher.Write([]byte(user.WalletAddress))

	// Get the hash sum as a hexadecimal string
	hashSum := hasher.Sum(nil)
	hash := hex.EncodeToString(hashSum)

	return hash
}