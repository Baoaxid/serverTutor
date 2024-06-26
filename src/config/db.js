// const odbc = require("odbc");
const mssql = require("mssql");
const dotenv = require("dotenv");

dotenv.config();

// const dbConfig = {
//   connectionString: `Driver={ODBC Driver 18 for SQL Server};Server=${process.env.DB_SERVER};Database=${process.env.DB_DATABASE};Uid=${process.env.DB_USER};Pwd=${process.env.DB_PASSWORD};Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;`,
// };
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true, // Use true if you're using encryption
    trustServerCertificate: true, // Accept self-signed certificates
    enableArithAbort: true,
  },
};

let connection;

const connectDB = async () => {
  if (connection) {
    return connection;
  }
  try {
    connection = await mssql.connect(dbConfig);
    console.log("Database connected successfully");
    return connection;
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
