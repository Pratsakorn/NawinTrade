import financialModelingPrep from "financialmodelingprep";
import dbpool from "../db/connectAWSdb.js";
import jwt from "jsonwebtoken";

export const staffinsertStock = async (req, res) => {
  try {
    const {
      cookies,
      StockSymbol,
      CompanyName,
      Exchange,
      MarketCap,
      Sector,
      Industry,
      Website,
    } = req.body;

    const payload = jwt.verify(cookies, "Bhun-er-staff");
    const staffID = payload["staffID"];
    const pool = dbpool;

    // res.json(res);
    pool.getConnection((err, connection) => {
      if (err) throw err;
      const query_stock = `INSERT INTO Stocks (StockSymbol, CompanyName, Exchange, CurrentPrice, 
                                                MarketCap, LastestDividend, Sector, Industry, Website, ImageURL)
                            VALUES (?, ?, ?, 0, ?, 0, ?, ?, ?, '-');`;
      connection.query(
        query_stock,
        [
          StockSymbol,
          CompanyName,
          Exchange,
          MarketCap,
          Sector,
          Industry,
          Website,
        ],
        (err, results) => {
          if (err) throw err;
          console.log(results);
        }
      );

      const query_BrokerID = `SELECT BrokerID From Broker_Staffs WHERE StaffID = ?;`;
      connection.query(query_BrokerID, [staffID], (err, results) => {
        if (err) throw err;
        const Broker = results[0];
        const query_StockID = `SELECT StockID FROM Stocks WHERE StockSymbol = ?;`;
        connection.query(query_StockID, [StockSymbol], (err, results) => {
          if (err) throw err;
          const Stock = results[0];
          const query_Stock_Available = `INSERT INTO Stock_Available (BrokerID,StockID) VALUES (?, ?);`;
          connection.query(
            query_Stock_Available,
            [Broker["BrokerID"], Stock["StockID"]],
            (err) => {
              if (err) throw err;
              connection.release();
              res.status(200).send("INSERT SUCCESS");
            }
          );
        });
      });
    });
  } catch (error) {
    connection.release();
    res.status(500).send("Error inserting stock");
  }
};

export const staffOrderApprove = async (req, res) => {
  const { orderID, orderType, vol, price, userID } = req.body;
  console.log(orderType);

  dbpool.getConnection((err, connection) => {
    if (err) throw err;

    const updateOrderQuery = `UPDATE Orders SET OrderStatus = 'Success' WHERE OrderID = ?;`;
    connection.query(updateOrderQuery, [orderID], (err, results) => {
      if (err) throw err;
      if (!results) {
        connection.release();
        return res.status(400).json({ error: "Cannot get data" });
      }
    });

    if (orderType == "Sell") {
      const getFeeQuery = `SELECT TradingComFee FROM Brokers WHERE BrokerID = (
                SELECT BrokerID FROM Users WHERE UserID = ?);`;

      connection.query(getFeeQuery, [userID], (err, rows) => {
        if (err) throw err;
        if (!rows) {
          connection.release();
          return res.status(400).json({ error: "Cannot get data" });
        }
        const fee = rows[0]["TradingComFee"];
        const money = vol * price * (1 - fee / 100);
        console.log(vol);
        console.log(price);
        console.log(fee);
        const updateBalanceQuery = `UPDATE Users SET AccountBalance = ? WHERE UserID = ?;`;
        connection.query(
          updateBalanceQuery,
          [money, userID],
          (err, resutls) => {
            if (err) throw err;
            if (!resutls) {
              connection.release();
              return res.status(400).json({ error: "Cannot get data" });
            }
            console.log(money);
            res.status(200).send("order approved");
          }
        );
      });
    } else {
      return res.status(200).send("order approved");
    }
  });
};
