package main

import (
	"api/pkg/utils"
	"api/router"
	"database/sql"
	"log"
	"net/http"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq" // PostgreSQL driver
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

	r := router.SetupRoutes(db)

	// Start the HTTP server
	log.Fatal(http.ListenAndServe(":8000", r))
}
