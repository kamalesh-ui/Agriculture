#!/usr/bin/env pwsh

# run-docker.ps1 - helper to start the Docker Compose stack on Windows

Write-Host "Checking for Docker..."
try {
    $dockerVersion = docker --version 2>$null
} catch {
    Write-Error "Docker not found. Please install Docker Desktop: https://www.docker.com/get-started"
    exit 1
}

Write-Host "Docker found. Starting docker compose (build)..."

cd (Split-Path -Path $PSScriptRoot -Parent) | Out-Null
docker compose up --build
