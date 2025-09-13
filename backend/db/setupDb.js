import fs from 'fs/promises';
import path from 'path';
import { pool } from './db.js';
import {fileURLToPath} from 'url'

export async function setupDatabase() {
  try {
    // Load the SQL file content
    const currentFile = fileURLToPath(import.meta.url)
    const dirname = path.dirname(currentFile)
    
    const sqlPath = path.join(dirname, "../schema/schema.sql")
    const schemaSQL = await fs.readFile(sqlPath, 'utf8');

    // check if tables already exist (example: users table)
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `);

    if (result.rows[0].exists) {
      console.log('Database already set up. Skipping schema execution.');
      return;
    }

    // Run the full schema wrapped in BEGIN...COMMIT
    await pool.query(schemaSQL);
    console.log(' Database schema applied successfully.');
  } catch (err) {
    console.error(' Error setting up database schema:', err.message);
  } finally {
    await pool.end();
  }
}

// we run this if we don't import in the server.js and run it every time the server starts. since it isn't necessary to do that we should just run this file once only before the server starts and then don't call it inside server.js
setupDatabase();
