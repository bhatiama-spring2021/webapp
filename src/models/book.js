module.exports = (sequelize, Sequelize) => {
  const Book = sequelize.define(
    "books",
    {
      book_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      author: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      isbn: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      published_date: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          isDate: true,
          isBefore: sequelize.fn('NOW')
        },
      },
      user_id: {
        type: Sequelize.UUID,
        references: {
          model: "users",
          key: "user_id",
        },
      },
    },
    {
      createdAt: "book_created",
    });

Book.associate = function(models) {
  Book.belongsTo(models.User, {
    foreignKey: "user_id"
  });
};

  return Book;
};
