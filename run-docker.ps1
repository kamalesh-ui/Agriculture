#!/usr/bin/env pwsh

# run-docker.ps1 - helper to start the Docker Compose stack on Windows

Write-Host "Checking for Docker..."
try {
    # Execute command and discard output; assigning to $null avoids unused-variable warnings
    $null = docker --version 2>$null
} catch {
    Write-Error "Docker not found. Please install Docker Desktop: https://www.docker.com/get-started"
    exit 1
}

Write-Host "Docker found. Starting docker compose (build)..."

# Ensure we run from the script directory
Set-Location -Path $PSScriptRoot

# Start the compose stack and forward logs to the console
docker compose up --build
