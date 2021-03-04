module.exports = {
    HOST: process.env.RDS_HOSTNAME || "localhost",
    USER: process.env.RDS_USERNAME || "bhatiama",
    PASSWORD: process.env.RDS_PASSWORD || "bhatiama",
    DB: process.env.RDS_DB_NAME || "csye6225",
    TESTDB: "testDB",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};