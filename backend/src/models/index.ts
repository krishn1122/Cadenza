import { Sequelize } from 'sequelize';
import { sequelize, initializeDatabase } from '../config/db';
import { initUserModel } from './User';
import { initCompanyModel } from './Company';
import { initPersonModel } from './Person';
import { initBlogModel } from './Blog';
import { seedDatabase } from '../utils/seed';

// Initialize models
const User = initUserModel(sequelize);
const Company = initCompanyModel(sequelize);
const Person = initPersonModel(sequelize);
const Blog = initBlogModel(sequelize);

const models = {
  User,
  Company,
  Person,
  Blog
};

// Set up associations
Blog.associate(models);

// Function to sync all models with the database
export const initDb = async (): Promise<boolean> => {
  try {
    // Initialize database (creates if doesn't exist) and sync models
    const initialized = await initializeDatabase();
    if (!initialized) {
      throw new Error('Failed to initialize database');
    }
    
    console.log('✅ Database models synchronized successfully');
    
    // Create or update admin user
    try {
      const User = models.User;
      const [adminUser, created] = await User.findOrCreate({
        where: { email: 'admin@gmail.com' },
        defaults: {
          full_name: 'Admin User',
          email: 'admin@gmail.com',
          password: 'admin123',
          is_admin: true,
          is_cadenza: true,
          auth_provider: 'local',
          createdAt: new Date(),
          updatedAt: new Date()
        } as any // Temporary type assertion to avoid TS errors
      });

      // If the user exists but is not an admin, update it
      if (!created && (!adminUser.is_admin || !adminUser.is_cadenza)) {
        adminUser.is_admin = true;
        adminUser.is_cadenza = true;
        await adminUser.save();
      }

      console.log('✅ Admin user created or updated');
      console.log('   Admin login: admin@gmail.com / admin123');

      // Check if we have company and person data
      const companyCount = await Company.count();
      const personCount = await Person.count();
      
      console.log(`Database has ${companyCount} companies and ${personCount} people records`);
    } catch (error) {
      console.error('Error creating admin user:', error);
      // Continue even if creating admin user fails
    }
    
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    return false;
  }
};

export { User, Company, Person, Blog };
export default models;
