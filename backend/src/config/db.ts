import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

// We'll dynamically import models to avoid circular dependencies
const modelFiles = ['User', 'Company', 'Person', 'Blog'];

// Function to import all models
export const importModels = (sequelize: Sequelize) => {
  const models: { [key: string]: any } = {};
  
  modelFiles.forEach(file => {
    const modelModule = require(`../models/${file}`);
    const model = modelModule.default || modelModule;
    models[file] = model;
  });
  
  return models;
};

// Database configuration
const DB_NAME = process.env.DB_NAME || 'cadenza';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || "8890";
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = parseInt(process.env.DB_PORT || '5432', 10);

class Database {
  private static instance: Database;
  private sequelize: Sequelize;

  private constructor() {
    this.sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
      host: DB_HOST,
      port: DB_PORT,
      dialect: 'postgres',
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public getSequelize(): Sequelize {
    return this.sequelize;
  }

  public async initialize(): Promise<boolean> {
    try {
      // First, connect to the default postgres database to check/create our database
      const adminSequelize = new Sequelize('postgres', DB_USER, DB_PASSWORD, {
        host: DB_HOST,
        port: DB_PORT,
        dialect: 'postgres',
        logging: false,
      });

      try {
        // Check if database exists
        const [results] = await adminSequelize.query(
          `SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}';`
        );
        
        // If database doesn't exist, create it
        if (results.length === 0) {
          console.log(`Database ${DB_NAME} does not exist. Creating...`);
          await adminSequelize.query(`CREATE DATABASE "${DB_NAME}";`);
          console.log(`Database ${DB_NAME} created successfully.`);
        } else {
          console.log(`Database ${DB_NAME} already exists.`);
        }
      } finally {
        await adminSequelize.close();
      }

      // Now connect to our application database
      await this.sequelize.authenticate();
      console.log('Database connection has been established successfully.');
      
      // Sync all models with the database (creates tables if they don't exist)
      await this.syncModels();
      
      return true;
    } catch (error) {
      console.error('Unable to initialize database:', error);
      return false;
    }
  }

  private async syncModels() {
    try {
      // Import models with the current sequelize instance
      const models = importModels(this.sequelize);
      
      // Log all registered models before syncing
      console.log('Registered models:', Object.keys(models).join(', '));
      
      // Sync all models
      await this.sequelize.sync({ force: true });
      console.log('✅ Database models synchronized successfully.');
      
      // Associate models if needed
      Object.values(models).forEach(model => {
        if (model.associate) {
          model.associate(models);
        }
      });
      
      console.log('✅ All database tables have been created');
    } catch (error) {
      console.error('Error synchronizing database models:', error);
      throw error;
    }
  }
}

// Create a singleton instance
const database = Database.getInstance();
const sequelize = database.getSequelize();

// Export the initialized sequelize instance
export { database, sequelize };

// Export a function to initialize the database
export const initializeDatabase = async (): Promise<boolean> => {
  return database.initialize();
};

// If this file is run directly, initialize the database
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
