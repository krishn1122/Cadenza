import { Model, DataTypes, Optional, Sequelize } from 'sequelize';

// Interface for Person attributes
interface PersonAttributes {
  id?: number;
  name: string;
  avatar_url?: string | null;
  category: string;
  location: string;
  description: string;
  verified: boolean;
  company?: string | null;
  position?: string | null;
  email?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
  education?: string | null;
  experience?: string | null;
  skills?: string | null;
  achievements?: string | null;
  notes?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface for creating a new Person
interface PersonCreationAttributes extends Omit<Optional<PersonAttributes, 'id' | 'verified' | 'avatar_url' | 'company' | 'position' | 'email' | 'linkedin' | 'twitter' | 'education' | 'experience' | 'skills' | 'achievements' | 'notes'>, 'createdAt' | 'updatedAt'> {}

// Person model class
class Person extends Model<PersonAttributes, PersonCreationAttributes> implements PersonAttributes {
  declare id: number;
  declare name: string;
  declare avatar_url: string | null;
  declare category: string;
  declare location: string;
  declare description: string;
  declare verified: boolean;
  declare company: string | null;
  declare position: string | null;
  declare email: string | null;
  declare linkedin: string | null;
  declare twitter: string | null;
  declare education: string | null;
  declare experience: string | null;
  declare skills: string | null;
  declare achievements: string | null;
  declare notes: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  // Associate method for model relationships
  public static associate(models: any): void {
    // Define associations here if needed
  }
}

// Export a function that initializes the model
export const initPersonModel = (sequelize: Sequelize): typeof Person => {
  Person.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      avatar_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      category: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      company: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      position: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
          isEmail: true,
        },
      },
      linkedin: {
        type: DataTypes.STRING(500),
        allowNull: true,
        validate: {
          isUrl: true,
        },
      },
      twitter: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      education: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      experience: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      skills: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      achievements: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
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
      modelName: 'Person',
      tableName: 'people',
      timestamps: true,
    }
  );

  return Person;
};

export default Person;
