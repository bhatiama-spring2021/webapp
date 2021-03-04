module.exports = (sequelize, Sequelize) => {
  const File = sequelize.define(
    "file",
    {
      file_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
      },
      file_name: {
        type: Sequelize.STRING,
        noUpdate: true,
      },
      s3_object_name: {
        type: Sequelize.STRING,
        noUpdate: true,
      },
      user_id: {
        type: Sequelize.UUID,
        references: {
          model: "users",
          key: "user_id",
        },
      },
      book_id: {
        type: Sequelize.UUID,
        onDelete: "CASCADE",
        references: {
          model: "books",
          key: "book_id",
        },
      },
    },
    {
      createdAt: "created_date",
    }
  );
  File.associate = function (models) {
    File.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user_id",
    });

    File.belongsTo(models.Book, {
      foreignKey: "book_id",
      as: "book_id",
    });
  };

  return File;
};
