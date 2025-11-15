# Database Setup Quick Start

This guide provides a quick reference for setting up the Aiven PostgreSQL database for the Krawl backend.

## Prerequisites

- Aiven account (create at https://console.aiven.io/)
- Environment variables configured (see `env.example`)

## Quick Setup Steps

1. **Create Aiven PostgreSQL Instance:**
   - Log in to https://console.aiven.io/
   - Create new PostgreSQL service (Free tier)
   - Wait for provisioning (2-5 minutes)

2. **Get Connection Details:**
   - Copy connection string from Aiven console
   - Note: Host, Port, Database name, Username, Password

3. **Configure Environment Variables:**
   
   **Option A: Export environment variables (recommended for Unix/Mac):**
   ```bash
   # Copy the example file
   cp env-example .env
   
   # Edit .env and fill in your Aiven database credentials
   # Then source it (Unix/Mac):
   source .env
   
   # Or export variables manually:
   export DB_HOST=your-service-name.a.aivencloud.com
   export DB_PORT=12345
   export DB_NAME=defaultdb
   export DB_USERNAME=avnadmin
   export DB_PASSWORD=your-password-here
   export DB_SSL_MODE=require
   ```
   
   **Option B: Use IDE environment variable configuration:**
   - IntelliJ IDEA: Run → Edit Configurations → Environment variables
   - VS Code: Use `.vscode/launch.json` or `.vscode/settings.json`
   - Eclipse: Run → Run Configurations → Environment tab
   
   **Option C: Windows PowerShell:**
   ```powershell
   # Set environment variables for current session
   $env:DB_HOST="your-service-name.a.aivencloud.com"
   $env:DB_PORT="12345"
   $env:DB_NAME="defaultdb"
   $env:DB_USERNAME="avnadmin"
   $env:DB_PASSWORD="your-password-here"
   $env:DB_SSL_MODE="require"
   ```
   
   **Note:** Spring Boot reads environment variables from the system. The `.env` file is a template - you need to export the variables or configure them in your IDE.

4. **Test Connection:**
   ```bash
   # Run the connection test
   mvn test -Dtest=DatabaseConnectionTest
   
   # Or start the application
   mvn spring-boot:run
   ```

## Environment Variables

Required environment variables (set in `.env` file):

- `DB_HOST` - Database hostname
- `DB_PORT` - Database port
- `DB_NAME` - Database name (usually `defaultdb`)
- `DB_USERNAME` - Database username (usually `avnadmin`)
- `DB_PASSWORD` - Database password
- `DB_SSL_MODE` - SSL mode (use `require` for Aiven)

Optional connection pool variables:

- `DB_POOL_MAX_SIZE` - Maximum pool size (default: 20)
- `DB_POOL_MIN_SIZE` - Minimum pool size (default: 5)
- `DB_POOL_CONNECTION_TIMEOUT` - Connection timeout in ms (default: 30000)
- `DB_POOL_IDLE_TIMEOUT` - Idle timeout in ms (default: 600000)
- `DB_POOL_MAX_LIFETIME` - Max lifetime in ms (default: 1800000)

## Security Notes

⚠️ **IMPORTANT:**
- Never commit `.env` file to version control
- `.env` is already in `.gitignore`
- Keep database credentials secure
- Use SSL mode `require` for production

## Troubleshooting

**Connection Issues:**
- Verify environment variables are set correctly
- Check IP whitelist in Aiven console
- Ensure SSL mode is set to `require`
- Verify service is running in Aiven console

**For detailed setup instructions, see:**
- `../docs/private-docs/operations/AIVEN_POSTGRESQL_SETUP.md`

**For backup strategy, see:**
- `../docs/private-docs/operations/DATABASE_BACKUP_STRATEGY.md`

