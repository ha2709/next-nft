package db

import (
	"database/sql"
	"fmt"
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
	// dbUser := os.Getenv("DATABASE_USER")
	// dbPassword := os.Getenv("DATABASE_PASSWORD")
	// dbName := os.Getenv("DATABASE_NAME")
	// dbHost := os.Getenv("DATABASE_HOST")
	// dbPort := os.Getenv("DATABASE_PORT")

	//  Construct the database connection string
	// dbConnectionString := "user=" + dbUser + " password=" + dbPassword + " dbname=" + dbName + " host=" + dbHost + " port=" + dbPort
	// Local PostgreSQL
	// db, err := sql.Open("postgres", dbConnectionString)
	// fmt.Printf("dbConnectionString %s...\n", dbConnectionString)
	// Connect to the database for Docker-compose
	db, err := sql.Open("postgres", os.Getenv("DATABASE_URL"))
	fmt.Printf("DATABASE_URL %s...\n", os.Getenv("DATABASE_URL"))
	err = db.Ping()
	if err != nil {
		log.Fatal(err)
	}

	// defer db.Close()

	// Create the "users" table if it doesn't exist
	_, err = db.Exec("CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, NRIC TEXT UNIQUE, wallet_address TEXT UNIQUE)")

	if err != nil {
		log.Fatal(err)
		return nil, err
	}
	return db, nil
}
