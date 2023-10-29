package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestGetUsers(t *testing.T) {
	req, err := http.NewRequest("GET", "/api/v1/users", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(getUsers(nil))

	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("Handler returned wrong status code: got %v want %v", status, http.StatusOK)
	}

	expected := []User{} // Add expected user data for comparison
	var users []User
	if err := json.NewDecoder(rr.Body).Decode(&users); err != nil {
		t.Fatal(err)
	}

	// Compare users and expected data
	// Add comparison logic based on the structure of User
}

func TestCreateUser(t *testing.T) {
	// Add test logic to test the creation of a user
	user := User{
		// Add test user data
	}

	body, err := json.Marshal(user)
	if err != nil {
		t.Fatal(err)
	}

	req, err := http.NewRequest("POST", "/api/v1/users", bytes.NewBuffer(body))
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(createUser(nil))

	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("Handler returned wrong status code: got %v want %v", status, http.StatusOK)
	}

	var receipt Receipt
	if err := json.NewDecoder(rr.Body).Decode(&receipt); err != nil {
		t.Fatal(err)
	}

	// Add comparison logic for the receipt hash
	// Test the logic with expected hash value
}

// Run the tests by executing `go test` in the terminal
