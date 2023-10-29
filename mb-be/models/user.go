package models

type User struct {
	ID            int    `json:"id"`
	NRIC          string `json:"NRIC"`
	WalletAddress string `json:"wallet_address"`
}
