import mysql from "mysql";

const dbpool  = mysql.createPool({
    host: 'nawintrade-db.cta0k8w6kiam.ap-southeast-2.rds.amazonaws.com',
    port: '3306',
    user: 'admin',
    password: 'Bhun123456',
    database: 'nawintradeDB'
  });

export default dbpool;

