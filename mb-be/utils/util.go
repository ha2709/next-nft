package utils

import (
	"encoding/json"
	"net/http"
)

// ErrorResponse represents a standard error response format.
type ErrorResponse struct {
	Message string `json:"message"`
}

// WriteError writes an error response with the given message and status code.
func WriteError(w http.ResponseWriter, message string, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	errorResponse := ErrorResponse{Message: message}
	json.NewEncoder(w).Encode(errorResponse)
}

// ValidateAPIKey validates the API key from the request header.
func ValidateAPIKey(r *http.Request, expectedKey string) bool {
	apiKey := r.Header.Get("access_token")
	return expectedKey == apiKey
}

// EnableCORS enables CORS by setting the necessary headers.
func EnableCORS(w http.ResponseWriter, allowedOrigin string) {
	w.Header().Set("Access-Control-Allow-Origin", allowedOrigin)
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, Access-Control-Allow-Origin")
	w.Header().Set("Access-Control-Expose-Headers", "Content-Type, Authorization")
}
