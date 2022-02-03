module.exports = (sequelize, DataTypes) => {
    const users = sequelize.define(
      "users",
      {
        user_id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        first_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        last_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        profile_picture: {
            type: DataTypes.BLOB,
            allowNull: false,
        },
        confirmed_email: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        
      },
      {
        timestamps: false,
      }
    );
  
    return users;
  };