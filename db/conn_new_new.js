import { createConnection } from 'mysql2/promise';

let connection;
async function connect() {
  try {
    if (!connection) {
      connection = await createConnection({
        host: 'localhost',
        user: 'root',
        password: 'adminpass',
        database: 'alumniDatabase2',
        port: 3306,
      });
      console.log('Connected to MySQL');
    }
    return connection;
  } catch (error) {
    console.error(`Failed to create connection: ${error}`);
    throw error;
  }
}

export default connect;
