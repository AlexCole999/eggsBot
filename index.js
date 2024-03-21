const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'sh4757307.c.had.su',
  user: 'u4757307_user',
  password: 'f7{ci{_oO%f;',
  database: 'u4757307_database1'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});