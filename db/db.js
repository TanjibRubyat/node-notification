var mysql = require("mysql");

var conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Quadque*2022Tech",
  database: "crm_notification",
});

conn.connect((err) => {
  if (!err) {
    console.log("connected");
  } else console.log(err);
});

module.exports = conn;