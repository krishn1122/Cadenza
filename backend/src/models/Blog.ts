import { Model, DataTypes, Optional, Sequelize } from 'sequelize';

// Interface for Blog attributes
interface BlogAttributes {
  id?: number;
  title: string;
  content: string;
  summary: string;
  image_url?: string | null;
  author_id: number;
  category?: string | null;
  tags?: string | null;
  published: boolean;
  publish_date?: Date | null;
  pinned?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface for creating a new Blog
interface BlogCreationAttributes extends Omit<Optional<BlogAttributes, 'id' | 'published'>, 'createdAt' | 'updatedAt'> {}

// Blog model class
class Blog extends Model<BlogAttributes, BlogCreationAttributes> implements BlogAttributes {
  declare id: number;
  declare title: string;
  declare content: string;
  declare summary: string;
  declare image_url: string | null;
  declare author_id: number;
  declare category: string | null;
  declare tags: string | null;
  declare published: boolean;
  declare publish_date: Date | null;
  declare pinned: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  // Associate method for model relationships
  public static associate(models: any): void {
    // Associate Blog with User (author)
    Blog.belongsTo(models.User, {
      foreignKey: 'author_id',
      as: 'author'
    });
  }
}

// Export a function that initializes the model
export const initBlogModel = (sequelize: Sequelize): typeof Blog => {
  Blog.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      summary: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      image_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      author_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      category: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      tags: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      published: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      publish_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      pinned: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
      modelName: 'Blog',
      tableName: 'blogs',
      timestamps: true,
    }
  );

  return Blog;
};

export default Blog;
