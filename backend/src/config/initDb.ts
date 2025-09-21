import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { execSync } from 'child_process';

dotenv.config();

const DB_NAME = process.env.DB_NAME || 'cadenza';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || '8890';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '5432';

async function initializeDatabase() {
  try {
    // Connect to the default postgres database
    const sequelize = new Sequelize('postgres', DB_USER, DB_PASSWORD, {
      host: DB_HOST,
      port: parseInt(DB_PORT, 10),
      dialect: 'postgres',
      logging: false,
    });

    // Check if database exists
    const result = await sequelize.query(
      `SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}';`
    );

    // If database doesn't exist, create it
    if (result[0].length === 0) {
      console.log(`Database ${DB_NAME} does not exist. Creating...`);
      await sequelize.query(`CREATE DATABASE "${DB_NAME}";`);
      console.log(`Database ${DB_NAME} created successfully.`);
    } else {
      console.log(`Database ${DB_NAME} already exists.`);
    }

    await sequelize.close();

    // Now connect to the new database and run migrations
    const appSequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
      host: DB_HOST,
      port: parseInt(DB_PORT, 10),
      dialect: 'postgres',
      logging: false,
    });

    // Test the connection
    await appSequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    return true;
  } catch (error) {
    console.error('Unable to initialize database:', error);
    return false;
  }
}

// Run the initialization
if (require.main === module) {
  initializeDatabase()
    .then(success => {
      if (success) {
        console.log('Database initialization completed successfully.');
        process.exit(0);
      } else {
        console.error('Database initialization failed.');
        process.exit(1);
      }
    });
}

export { initializeDatabase };
