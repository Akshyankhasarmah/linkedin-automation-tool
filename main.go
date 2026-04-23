package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

// IntelligenceLog matches our SQL schema
type IntelligenceLog struct {
	ID        int       `json:"id"`
	UserID    string    `json:"user_id"`
	Author    string    `json:"author"`
	Category  string    `json:"type"`
	Content   string    `json:"content"`
	Relevance int       `json:"relevance"`
	CreatedAt time.Time `json:"created_at"`
}

func main() {
	db, err := sql.Open("sqlite3", "./linkedin_intel.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Robust SQL Migration for Deployment
	migrations := []string{
		`CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT UNIQUE, display_name TEXT)`,
		`CREATE TABLE IF NOT EXISTS logs (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			user_id TEXT,
			author TEXT,
			type TEXT,
			content TEXT,
			relevance INTEGER,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP
		)`,
		`CREATE TABLE IF NOT EXISTS jobs (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT, title TEXT, company TEXT, url TEXT)`,
	}

	for _, m := range migrations {
		if _, err := db.Exec(m); err != nil {
			log.Fatal(err)
		}
	}

	fmt.Println("🚀 Go Intelligence Service Initialized on :8080")

	// API Mappings for Automation
	http.HandleFunc("/api/analyze", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		mockResponse := IntelligenceLog{
			UserID:    "user_123",
			Author:    "AI Agent",
			Category:  "Technical",
			Content:   "Simulated analysis completed via Go backend.",
			Relevance: 95,
			CreatedAt: time.Now(),
		}
		json.NewEncoder(w).Encode(mockResponse)
	})

	log.Fatal(http.ListenAndServe(":8080", nil))
}
