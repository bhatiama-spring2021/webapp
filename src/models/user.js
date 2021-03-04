module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "users",
    {
      user_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        noUpdate: true,
        validate: {
          notEmpty: true,
          isEmail: true,
        },
      },
    },
    {
      createdAt: "account_created",
      updatedAt: "account_updated",
    }
  );

  User.associate = function (models) {
    User.hasMany(models.Book, {
      foreignKey: "user_id",
    });

    User.hasMany(models.File, {
      as: "file_id",
    });
  };
  return User;
};
