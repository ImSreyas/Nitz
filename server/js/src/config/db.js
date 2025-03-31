import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, 
});

pool.connect()
  .then(() => console.log("🔥 PostgreSQL Connected!"))
  .catch(err => console.error("❌ Database Connection Error:", err));

export default pool;
