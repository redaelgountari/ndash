import mysql from 'mysql2';

const pool = mysql.createPool({
  host: "127.0.0.1",        
  user: "root",             
  password: "",    
  database: "hairzaman"
});

const promisePool = pool.promise();

export default promisePool;


