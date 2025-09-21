import { Model, DataTypes, Optional } from 'sequelize';
import bcrypt from 'bcryptjs';
import { Sequelize } from 'sequelize';

// Interface for User attributes
interface UserAttributes {
  id?: number;
  full_name: string;
  email: string;
  password?: string | null;
  is_cadenza: boolean;
  is_admin: boolean;
  auth_provider?: string | null;
  auth_provider_id?: string | null;
  profile_picture?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  validPassword?(password: string): Promise<boolean>;
}

// Interface for creating a new User
interface UserCreationAttributes extends Omit<Optional<UserAttributes, 'id' | 'is_cadenza' | 'is_admin' | 'password' | 'auth_provider' | 'auth_provider_id'>, 'createdAt' | 'updatedAt'> {}

// User model class
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: number;
  declare full_name: string;
  declare email: string;
  declare password: string | null;
  declare is_cadenza: boolean;
  declare is_admin: boolean;
  declare auth_provider: string | null;
  declare auth_provider_id: string | null;
  declare profile_picture: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  
  // Method to check password validity
  public async validPassword(password: string): Promise<boolean> {
    if (!this.password) return false;
    return await bcrypt.compare(password, this.password);
  }

  // Associate method for model relationships
  public static associate(models: any): void {
    // Define associations here if needed
  }
}

// Export a function that initializes the model
export const initUserModel = (sequelize: Sequelize): typeof User => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      full_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
          // Custom validator for gmail.com emails as per requirements
          customValidator(value: string) {
            if (!value.endsWith('@gmail.com')) {
              throw new Error('Email must be a Gmail address');
            }
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true, // Allow null for OAuth users
      },
      is_cadenza: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      auth_provider: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      auth_provider_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      profile_picture: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      hooks: {
        // Hash password before saving
        beforeCreate: async (user: User) => {
          if (user.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
        beforeUpdate: async (user: User) => {
          if (user.changed('password') && user.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
      },
    }
  );

  return User;
};

export default User;
