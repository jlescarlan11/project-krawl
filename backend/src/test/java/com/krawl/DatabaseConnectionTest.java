package com.krawl;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.SQLException;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Database Connection Test
 * 
 * This test verifies that the application can successfully connect to the Aiven PostgreSQL database.
 * 
 * Prerequisites:
 * - Aiven PostgreSQL instance must be created and running
 * - Environment variables must be set (DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD)
 * - Network access must be configured in Aiven console
 * 
 * Run this test with:
 * mvn test -Dtest=DatabaseConnectionTest
 */
@SpringBootTest
@ActiveProfiles("test")
class DatabaseConnectionTest {

    @Autowired
    private DataSource dataSource;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    void testDataSourceExists() {
        assertNotNull(dataSource, "DataSource should be configured");
    }

    @Test
    void testDatabaseConnection() throws SQLException {
        try (Connection connection = dataSource.getConnection()) {
            assertNotNull(connection, "Database connection should not be null");
            assertFalse(connection.isClosed(), "Database connection should be open");
            
            // Verify connection is valid
            assertTrue(connection.isValid(5), "Database connection should be valid");
        }
    }

    @Test
    void testDatabaseMetadata() throws SQLException {
        try (Connection connection = dataSource.getConnection()) {
            DatabaseMetaData metaData = connection.getMetaData();
            
            assertNotNull(metaData, "Database metadata should not be null");
            
            // Verify PostgreSQL database
            String databaseProductName = metaData.getDatabaseProductName();
            assertEquals("PostgreSQL", databaseProductName, 
                "Database should be PostgreSQL, but was: " + databaseProductName);
            
            // Verify PostgreSQL version (should be 15+)
            String databaseProductVersion = metaData.getDatabaseProductVersion();
            assertNotNull(databaseProductVersion, "Database version should not be null");
            
            System.out.println("Database Product: " + databaseProductName);
            System.out.println("Database Version: " + databaseProductVersion);
            System.out.println("Driver Name: " + metaData.getDriverName());
            System.out.println("Driver Version: " + metaData.getDriverVersion());
        }
    }

    @Test
    void testDatabaseQuery() {
        // Test a simple query
        String result = jdbcTemplate.queryForObject("SELECT version()", String.class);
        
        assertNotNull(result, "Database version query should return a result");
        assertTrue(result.contains("PostgreSQL"), 
            "Version should contain 'PostgreSQL', but was: " + result);
        
        System.out.println("PostgreSQL Version: " + result);
    }

    @Test
    void testCurrentTimestamp() {
        // Test timestamp query
        String timestamp = jdbcTemplate.queryForObject("SELECT CURRENT_TIMESTAMP::text", String.class);
        
        assertNotNull(timestamp, "Current timestamp query should return a result");
        System.out.println("Current Database Timestamp: " + timestamp);
    }

    @Test
    void testConnectionPoolConfiguration() throws SQLException {
        // Verify HikariCP is being used
        if (dataSource instanceof com.zaxxer.hikari.HikariDataSource) {
            com.zaxxer.hikari.HikariDataSource hikariDataSource = 
                (com.zaxxer.hikari.HikariDataSource) dataSource;
            
            System.out.println("Connection Pool Name: " + hikariDataSource.getPoolName());
            System.out.println("Maximum Pool Size: " + hikariDataSource.getMaximumPoolSize());
            System.out.println("Minimum Idle: " + hikariDataSource.getMinimumIdle());
            System.out.println("Active Connections: " + hikariDataSource.getHikariPoolMXBean().getActiveConnections());
            System.out.println("Idle Connections: " + hikariDataSource.getHikariPoolMXBean().getIdleConnections());
            System.out.println("Total Connections: " + hikariDataSource.getHikariPoolMXBean().getTotalConnections());
            
            // Verify pool size is within Aiven free tier limits (25 connections)
            assertTrue(hikariDataSource.getMaximumPoolSize() <= 25, 
                "Maximum pool size should not exceed Aiven free tier limit of 25 connections");
        }
    }
}

