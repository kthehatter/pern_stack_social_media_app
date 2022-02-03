module.exports = (sequelize, DataTypes) => {
  const messages = sequelize.define(
    "messages",
    {
      message_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      message_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      message_image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      message_video: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      message_audio: {
        type: DataTypes.STRING,
        allowNull: true,
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
  return messages;
};
