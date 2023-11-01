package db

import (
	"fmt"
	"testing"

	"github.com/joho/godotenv"
)

func TestConnect(t *testing.T) {
	err := godotenv.Load()

	if err != nil {
		fmt.Println("Error: ", err)
	}

	_, err = Connect()
	if err != nil {
		t.Fatalf("Error connecting to the database: %s", err)
	}

	// You can add more test cases here as per your requirements.
}

// func TestCreateUsersTable(t *testing.T) {
// 	err := godotenv.Load()

// 	if err != nil {
// 		t.Fatalf("Error loading .env file: %s", err)
// 	}

// 	db, err := Connect()
// 	if err != nil {
// 		t.Fatalf("Error connecting to the database: %s", err)
// 	}
// 	defer db.Close()

// 	// Test whether the "users" table is created successfully
// 	_, err = db.Exec("DROP TABLE IF EXISTS users CASCADE")

// 	if err != nil {
// 		t.Fatalf("Error dropping table 'users': %s", err)
// 	}

// 	_, err = db.Exec("CREATE TABLE users (id SERIAL PRIMARY KEY, NRIC TEXT UNIQUE, wallet_address TEXT UNIQUE)")
// 	if err != nil {
// 		t.Fatalf("Error creating table 'users': %s", err)
// 	}

// }
