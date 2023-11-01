package main

import (
	"api/db"
	"api/router"
	"log"
	"testing"

	"github.com/joho/godotenv"
)

func TestConnect(t *testing.T) {
	err := godotenv.Load()

	if err != nil {
		log.Fatal("Error loading .env file", err)
	}

	_, err = db.Connect()
	if err != nil {
		t.Fatalf("Error connecting to the database: %s", err)
	}

}

func TestSetupRoutes(t *testing.T) {

	db, err := db.Connect()
	if err != nil {
		t.Fatalf("Error connecting to the database: %s", err)
	}
	defer db.Close()

	r := router.SetupRoutes(db)
	if r == nil {
		t.Fatal("Router not initialized")
	}

}
