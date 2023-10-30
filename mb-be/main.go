package main

import (
	"log"
	"net/http"

	"api/db"
	"api/router"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq" // PostgreSQL driver
)

func main() {
	// Load environment variables from the .env file
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	db, err := db.Connect()
	if err != nil {
		log.Fatal(err)
	}
	// defer db.Close()

	// Set up your router and routes
	r := router.SetupRoutes(db)

	// corsMiddleware := router.enableCORS(w)

	// Start the HTTP server
	log.Fatal(http.ListenAndServe(":8000", r))
	// Close the database connection when it's no longer needed
	if err = db.Close(); err != nil {
		log.Fatal(err)
	}
}

// func jsonContentTypeMiddleware(next http.Handler) http.Handler {
// 	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
// 		w.Header().Set("Content-Type", "application/json")
// 		next.ServeHTTP(w, r)
// 	})
// }
