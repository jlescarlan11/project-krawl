#!/bin/bash

# ============================================
# Krawl Backend - Environment Setup Script
# ============================================
# This script helps create the .env file from env-example
# Run this script from the project root directory
#
# Version: 1.0.0
# Last Updated: 2025-11-16
# Requirements: Bash 4.0 or later

# Exit on error, undefined variables, and pipe failures
# -e: Exit immediately if a command exits with a non-zero status
# -u: Treat unset variables as an error
# -o pipefail: Return value of a pipeline is the status of the last command
set -euo pipefail

echo "Krawl Backend - Environment Setup"
echo "================================="
echo ""

BACKEND_DIR="$(cd "$(dirname "$0")/../backend" && pwd)"
ENV_EXAMPLE="$BACKEND_DIR/env-example"
ENV_FILE="$BACKEND_DIR/.env"

# Check if env-example exists
if [ ! -f "$ENV_EXAMPLE" ]; then
    echo "ERROR: env-example file not found at $ENV_EXAMPLE"
    exit 1
fi

# Check if .env already exists
if [ -f "$ENV_FILE" ]; then
    echo "WARNING: .env file already exists at $ENV_FILE"
    read -p "Do you want to overwrite it? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled. Existing .env file preserved."
        exit 0
    fi
fi

# Copy env-example to .env
cp "$ENV_EXAMPLE" "$ENV_FILE"

# Set restrictive permissions on .env file (read/write for owner only)
# This ensures sensitive credentials are only accessible by the file owner
if ! chmod 600 "$ENV_FILE"; then
    echo "ERROR: Failed to set file permissions on $ENV_FILE" >&2
    echo "Please manually set permissions: chmod 600 $ENV_FILE" >&2
    exit 1
fi
echo "SUCCESS: Created .env file at $ENV_FILE with restrictive permissions"
echo ""
echo "Next steps:"
echo "1. Open $ENV_FILE in your editor"
echo "2. Replace placeholder values with your actual credentials"
echo "3. For Brevo configuration:"
echo "   - Get API key from: https://app.brevo.com/settings/keys/api"
echo "   - Configure sender at: https://app.brevo.com/settings/senders"
echo ""
echo "IMPORTANT: Never commit the .env file to version control!"

