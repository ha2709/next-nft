package db

import (
	"database/sql"
	"log"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq" // PostgreSQL driver
)

func Connect() (*sql.DB, error) {
	// Load environment variables from the .env file
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	// Retrieve database connection parameters from environment variables
	dbUser := os.Getenv("DATABASE_USER")
	dbPassword := os.Getenv("DATABASE_PASSWORD")
	dbName := os.Getenv("DATABASE_NAME")
	dbHost := os.Getenv("DATABASE_HOST")
	dbPort := os.Getenv("DATABASE_PORT")

	// Construct the database connection string
	dbConnectionString := "user=" + dbUser + " password=" + dbPassword + " dbname=" + dbName + " host=" + dbHost + " port=" + dbPort

	db, err := sql.Open("postgres", dbConnectionString)
	// Connect to the database
	// db, err := sql.Open("postgres", os.Getenv("DATABASE_URL"))
	err = db.Ping()
	if err != nil {
		log.Fatal(err)
	}

	defer db.Close()

	// Create the "users" table if it doesn't exist
	_, err = db.Exec("CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, NRIC TEXT UNIQUE, wallet_address TEXT UNIQUE)")

	if err != nil {
		log.Fatal(err)
		return nil, err
	}
	return db, nil
}
