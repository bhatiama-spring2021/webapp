module.exports = {
    HOST: "localhost",
    USER: "bhatiama",
    PASSWORD: "bhatiama",
    DB: "csye6225",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};