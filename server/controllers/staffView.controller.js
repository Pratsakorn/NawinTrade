import financialModelingPrep from "financialmodelingprep";
import dbpool from "../db/connectAWSdb.js";
import jwt from "jsonwebtoken";

//staffProfile controller
export const staffProfile = (req, res) => {
  // const {cookies} = req.body
  // const payload = jwt.verify(cookies, 'Bhun-er')
  // const  userID = payload['userID']
  dbpool.getConnection(async (err, connection) => {
    if (err) throw err;
    try {
      const query_staff = `SELECT * FROM Broker_Staffs WHERE StaffID = ?`;
      connection.query(query_staff, [1], (err, rows) => {
        if (err) throw err;
        const staffData = rows[0];
        //console.log(staffData)
        const query_broker = `SELECT * FROM Brokers WHERE BrokerID = (SELECT BrokerID FROM Broker_Staffs WHERE StaffID = ? )`;
        connection.query(query_broker, staffData["StaffID"], (err, rows) => {
          if (err) throw err;
          const brokerData = rows[0];
          connection.release();
          //console.log(brokerData)
          const staffViewData = Object.assign(staffData, brokerData);
          res.status(200).send(staffViewData);
        });
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
};

export const staffOrderView = (req, res) => {
  const { cookies } = req.body;
  const payload = jwt.verify(cookies, "Bhun-er-staff");
  const staffID = payload["staffID"];

  dbpool.getConnection((err, connection) => {
    if (err) throw err;
    const query = `SELECT Orders.*, Stocks.StockSymbol, Users.fName, Users.lName
        FROM Orders JOIN Stocks ON Orders.StockID = Stocks.StockID
        JOIN Users ON Orders.UserID = Users.UserID
        WHERE Orders.UserID IN (
        SELECT UserID 
        FROM Users 
        WHERE BrokerID IN (
        SELECT BrokerID 
        FROM Broker_Staffs 
        WHERE StaffID = ?
        ) 
        AND OrderStatus = 'Pending'
    );`;
    connection.query(query, [staffID], (err, rows) => {
      if (err) throw err;
      if (!rows) {
        connection.release();
        return res.status(400).json({ error: "Cannot get data" });
      }
      const result = rows;
      //console.log(staffID);
      connection.release();
      res.status(200).send(result);
    });
  });
};

export const staffPortfolio = (req, res) => {
  const { cookies } = req.body;
  const payload = jwt.verify(cookies, "Bhun-er-staff");
  const staffID = payload["staffID"];

  //const staffID = 1;

  dbpool.getConnection((err, connection) => {
    if (err) throw err;
    const queryByStock = `SELECT
                            s.StockSymbol,
                            s.currentPrice,
                            COALESCE(SUM(CASE WHEN o.OrderType = 'Buy' THEN o.Volume ELSE -o.Volume END), 0) AS netVolume
                          FROM
                            Stock_Available sa JOIN
                            Stocks s ON sa.StockID = s.StockID AND sa.BrokerID = (SELECT BrokerID FROM Broker_Staffs WHERE StaffID = ?) LEFT JOIN
                            Orders o ON sa.StockID = o.StockID AND o.OrderStatus = 'Success' LEFT JOIN
                            Users u ON o.UserID = u.UserID AND u.BrokerID =  (SELECT BrokerID FROM Broker_Staffs WHERE StaffID = ?) 
                          GROUP BY s.StockSymbol, s.currentPrice;`;
    connection.query(queryByStock, [staffID, staffID], (err, rows) => {
      if (err) throw err;
      if (!rows) {
        connection.release();
        return res.status(400).json({ error: "Cannot get data" });
      }
      const resultByStock = rows;
      //console.log(resultByStock)
      const queryByDate = `SELECT
                            DATE(o.OrderDateTime) AS orderDate,
                            SUM(s.currentPrice * o.Volume) AS netValue
                          FROM
                            Orders o JOIN
                            Users u ON o.UserID = u.UserID JOIN
                            Stocks s ON o.StockID = s.StockID
                          WHERE
                            u.BrokerID = (SELECT BrokerID FROM Broker_Staffs WHERE StaffID = ?)
                            AND o.OrderStatus = 'Success'
                          GROUP BY orderDate;`;
      connection.query(queryByDate, [staffID], (err, rows) => {
        if (err) throw err;
        if (!rows) {
          connection.release();
          return res.status(400).json({ error: "Cannot get data" });
        }
        const resultByDate = rows;

        const queryCustomer = `SELECT u.UserID, u.fName, u.lName, u.AccountNo, u.BankAccount, 
                                  SUM((CASE WHEN o.OrderType = 'Buy' THEN o.Volume*s.CurrentPrice ELSE -o.Volume*o.Price END)) AS netValue
                              FROM Users u JOIN Orders o ON u.UserID = o.UserID JOIN Stocks s ON o.StockID = s.StockID
                              WHERE u.BrokerID = (SELECT BrokerID FROM Broker_Staffs WHERE StaffID = ?) AND (OrderStatus = 'Success' OR OrderType = 'Sell')
                              GROUP BY u.UserID`;

        connection.query(queryCustomer, [staffID], (err, rows) => {
          if (err) throw err;
          if (!rows) {
            connection.release();
            return res.status(400).json({ error: "Cannot get data" });
          }
          const resultByUser = rows;
          const staffPortData = Object.assign({
            resultByStock,
            resultByDate,
            resultByUser,
          });
          console.log(staffPortData);
          connection.release();
          res.status(200).send(staffPortData);
        });
      });
    });
  });
};
