import { Model, DataTypes, Optional } from 'sequelize';
import { Sequelize } from 'sequelize';

// Interface for Company attributes
interface CompanyAttributes {
  id?: number;
  name: string;
  logo_url?: string | null;
  category: string;
  location: string;
  description: string;
  verified: boolean;
  stage?: string | null;
  website?: string | null;
  founded_year?: number | null;
  employee_count?: string | null;
  funding_stage?: string | null;
  total_funding?: string | null;
  investor_information?: string | null;
  product_description?: string | null;
  business_model?: string | null;
  target_market?: string | null;
  competitive_landscape?: string | null;
  traction_metrics?: string | null;
  tractionScore?: number | null;
  notes?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface for creating a new Company
interface CompanyCreationAttributes extends Omit<Optional<CompanyAttributes, 'id' | 'verified' | 'logo_url'>, 'createdAt' | 'updatedAt'> {}

// Company model class
class Company extends Model<CompanyAttributes, CompanyCreationAttributes> implements CompanyAttributes {
  declare id: number;
  declare name: string;
  declare logo_url: string | null;
  declare category: string;
  declare location: string;
  declare description: string;
  declare verified: boolean;
  declare stage: string | null;
  declare website: string | null;
  declare founded_year: number | null;
  declare employee_count: string | null;
  declare funding_stage: string | null;
  declare total_funding: string | null;
  declare investor_information: string | null;
  declare product_description: string | null;
  declare business_model: string | null;
  declare target_market: string | null;
  declare competitive_landscape: string | null;
  declare traction_metrics: string | null;
  declare tractionScore: number | null;
  declare notes: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  // Associate method for model relationships
  public static associate(models: any): void {
    // Define associations here if needed
  }
}

// Export a function that initializes the model
export const initCompanyModel = (sequelize: Sequelize): typeof Company => {
  Company.init(
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
      logo_url: {
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
      stage: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      website: {
        type: DataTypes.STRING(500),
        allowNull: true,
        validate: {
          isUrl: true,
        },
      },
      founded_year: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      employee_count: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      funding_stage: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      total_funding: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      investor_information: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      product_description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      business_model: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      target_market: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      competitive_landscape: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      traction_metrics: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      tractionScore: {
        type: DataTypes.INTEGER,
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
      modelName: 'Company',
      tableName: 'companies',
      timestamps: true,
    }
  );

  return Company;
};

export default Company;
