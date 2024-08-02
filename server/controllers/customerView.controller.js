import dbpool from "../db/connectAWSdb.js";
import jwt from "jsonwebtoken";
import MOMENT from "moment";

// stockView controller
export const stockView = (req, res) => {
  const { StockSymbol, cookies } = req.body;
  // console.log("This is cookie" + req.cookies);
  // console.log("This is fake cookie" + cookies);
  const payload = jwt.verify(cookies, "Bhun-er");
  const userID = payload["userID"];
  console.log(cookies);
  console.log(payload["userID"]);
  dbpool.getConnection(async (err, connection) => {
    if (err) throw err;
    try {
      let stock;
      const query = `SELECT * FROM Stocks WHERE StockSymbol = ?`;
      connection.query(query, [StockSymbol], async (err, rows) => {
        if (err) throw err;

        stock = rows[0];
        console.log(stock);

        if (!stock) {
          connection.release();
          return res.status(400).json({ error: "Cannot get data" });
        }

        connection.query(
          `SELECT * FROM Stock_Prices_History WHERE StockID = ?`,
          [stock["StockID"]],
          (err, rows) => {
            if (err) {
              connection.release();
              throw err;
            }

            const stock_hist = rows;
            if (!stock_hist) {
              connection.release();
              return res.status(400).json({ error: "Cannot get data" });
            }
            const query = `SELECT SUM(Volume), OrderType FROM Orders WHERE UserID = ? AND StockID = ? AND (OrderStatus = "Success" OR OrderType = "Sell") GROUP BY OrderType`;
            connection.query(query, [userID, stock["StockID"]], (err, rows) => {
              if (err) {
                connection.release();
                throw err;
              }

              let netVol = 0

              if (!rows) {
                connection.release();
                return res.status(400).json({ error: "Cannot get data" });
              } else if (rows.length===0) {
                netVol = 0
              } else if (rows.length === 2){
                netVol = rows[0]["SUM(Volume)"]  -rows[1]["SUM(Volume)"]
              } else {
                netVol = rows[0]["SUM(Volume)"]
              }
              console.log(rows);


              const query = `SELECT Users.AccountBalance, Brokers.TradingComFee
                                        FROM Users
                                        LEFT JOIN Brokers ON Users.BrokerID = Brokers.BrokerID
                                        WHERE Users.UserID = ?`;
              connection.query(query, [userID], (err, rows) => {
                if (err) {
                  connection.release();
                  throw err;
                }

                if (!rows) {
                  connection.release();
                  return res.status(400).json({ error: "Cannot get data" });
                }
                //console.log(userID);
                const userData = rows[0];
                // console.log(userData)
                const stockViewData = Object.assign(
                  stock,
                  { stock_hist },
                  { netVol },
                  {
                    AccountBalance: userData["AccountBalance"],
                    ComFee: userData["TradingComFee"],
                  }
                );

                console.log(stockViewData);

                connection.release();
                res.status(200).send(stockViewData);
              });
            });
          }
        );
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
};

export const profile = (req, res) => {
  const { cookies } = req.body;
  const payload = jwt.verify(cookies, "Bhun-er");
  const userID = payload["userID"];
  dbpool.getConnection(async (err, connection) => {
    if (err) throw err;
    try {
      const query = `SELECT u.*, b.BrokerName, c.fName AS cfName , c.lName AS clName, c.Email AS cEmail, c.Phone AS cPhone FROM Users u JOIN Brokers b ON u.BrokerID = b.BrokerID JOIN Investment_Consultant c ON u.ConsultID = c.ConsultID WHERE UserID = ?`;
      connection.query(query, [userID], (err, rows) => {
        if (err) throw err;
        const userData = rows[0];
        connection.release();
        res.status(200).send(userData);
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
};

export const portfolio = (req, res) => {
  const { cookies } = req.body;
  const payload = jwt.verify(cookies, "Bhun-er");
  const userID = payload["userID"];
  dbpool.getConnection((err, connection) => {
    if (err) throw err;
    try {
      const getVolQuery = `SELECT 
                                NetVol.StockID,
                                Stocks.StockSymbol,
                               NetVol.Vol,
                                Stocks.CurrentPrice,
                                NetVol.OrderType,
                                LatestPrice.EOD_Price AS SecondLatestEOD_Price
                              FROM (
                                  SELECT  SUM(Volume) AS Vol, StockID, OrderType 
                                  FROM Orders 
                                  WHERE UserID = ? AND (OrderStatus = 'Success' OR OrderType = 'Sell') 
                                  GROUP BY StockID, OrderType
                                  ) AS NetVol
                                LEFT JOIN 
                                  Stocks ON NetVol.StockID = Stocks.StockID
                                LEFT JOIN (
                                  SELECT 
                                    StockID,
                                    MAX(Date) AS LatestDate,
                                    MAX(CASE WHEN Date < (SELECT MAX(Date) FROM Stock_Prices_History WHERE StockID = SPH.StockID) 
                                      THEN Date END) AS SecondLatestDate
                                  FROM Stock_Prices_History SPH
                                  GROUP BY StockID) AS LatestDates 
                                ON NetVol.StockID = LatestDates.StockID
                                LEFT JOIN Stock_Prices_History AS LatestPrice
                                ON LatestDates.StockID = LatestPrice.StockID AND LatestDates.SecondLatestDate = LatestPrice.Date;`;

      connection.query(getVolQuery, [userID], (err, rows) => {
        if (err) throw err;
        const Vol = rows;
        //console.log(Vol)

        const result = [];

        Vol.forEach((item) => {
          const existingItem = result.find(
            (i) => i.StockSymbol === item.StockSymbol
          );
          if (existingItem) {
            if (item.OrderType === "Buy") {
              existingItem.netVol += item.Vol;
            } else if (item.OrderType === "Sell") {
              existingItem.netVol -= item.Vol;
            }
          } else {
            const newItem = {
              StockSymbol: item.StockSymbol,
              netVol: item.OrderType === "Buy" ? item.Vol : -item.Vol,
              currentPrice: item.CurrentPrice,
              SecondLatestEOD_Price: item.SecondLatestEOD_Price,
            };
            result.push(newItem);
          }
        });
        //console.log(Vol)
        connection.release();
        console.log(result);
        res.status(200).send(result);
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
};

export const tradinghistory = (req, res) => {
  const { cookies } = req.body;
  const payload = jwt.verify(cookies, "Bhun-er");
  const userID = payload["userID"];
  const currentdate = MOMENT().subtract(7, 'days').format('YYYY-MM-DD');
  dbpool.getConnection((err, connection) => {
    if (err) throw err;
    try {
      const gethistory = `SELECT
                            o.OrderType,
                            s.StockSymbol,
                            o.Volume,
                            o.Price,
                            o.OrderDateTime,
                            CASE
                                WHEN o.OrderType = 'BUY' THEN o.Price * o.Volume / (1 - ((SELECT TradingComFee FROM Brokers WHERE BrokerID IN
                                (SELECT BrokerID FROM Users WHERE UserID = '0000000001'))) / 100)
                                WHEN o.OrderType = 'SELL' THEN o.Price * o.Volume * (1 - ((SELECT TradingComFee FROM Brokers WHERE BrokerID IN
                                (SELECT BrokerID FROM Users WHERE UserID = '0000000001'))) / 100)
                            END AS amount_money
                          FROM
                            Orders o
                          LEFT JOIN
                            Stocks s ON o.StockID = s.StockID
                          WHERE
                            o.UserID = '0000000001' AND o.OrderStatus = 'Success'
                          ORDER BY
                            o.OrderDateTime DESC;`;

      const getCount = `SELECT OrderType, count(*) AS count
                        FROM Orders 
                        WHERE UserID = ? and OrderStatus = "Success"
                        GROUP BY OrderType;`;

      const getNet7day = `WITH transaction_data AS (
                            SELECT o.OrderType,
                              CASE 
                              WHEN o.OrderType = 'BUY' THEN o.Price * o.Volume / (1 - ((SELECT TradingComFee FROM Brokers WHERE BrokerID = 
                                (SELECT BrokerID FROM Users WHERE UserID = ?)) / 100))
                                WHEN o.OrderType = 'SELL' THEN o.Price * o.Volume * (1 - ((SELECT TradingComFee FROM Brokers WHERE BrokerID = 
                                (SELECT BrokerID FROM Users WHERE UserID = ?)) / 100))
                              END AS amount_money
                            FROM Orders o LEFT JOIN Stocks s ON o.StockID = s.StockID
                            WHERE o.UserID = ? AND o.OrderStatus = 'Success' AND o.OrderDateTime >= ?),
                          amounts AS (
                            SELECT OrderType, SUM(amount_money) AS net
                            FROM transaction_data
                            GROUP BY OrderType),
                          order_types AS (
                            SELECT 'BUY' AS OrderType
                            UNION ALL
                            SELECT 'SELL' AS OrderType)
                          SELECT ot.OrderType, COALESCE(a.net, 0) AS net
                          FROM order_types ot
                          LEFT JOIN amounts a ON ot.OrderType = a.OrderType; `;

      connection.query(gethistory, [userID, userID, userID], (err, rows1) => {
        if (err) throw err;
        connection.query(getCount, [userID], (err, rows2) => {
          if (err) throw err;
          connection.query(getNet7day, [userID, userID, userID, currentdate], (err, rows3) => {
            if (err) throw err;
            const result = {
              tradingHistory: rows1,
              Count: rows2,
              Net7day: rows3,
            };
            connection.release();
            console.log(result);
            res.status(200).send(result);
          });
        });
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
};

export const paymenthistory = (req, res) => {
  const { cookies } = req.body;
  const payload = jwt.verify(cookies, "Bhun-er");
  const userID = payload["userID"];
  const currentdate = MOMENT().subtract(7, 'days').format('YYYY-MM-DD');
  dbpool.getConnection((err, connection) => {
    if (err) throw err;
    try {
      const getpayment = `SELECT Amounts, Types, PaymentDateTime
            FROM Payments WHERE UserID = ?
            ORDER BY PaymentDateTime DESC;`;

      const getbrokername = `SELECT DISTINCT b.BrokerName
            FROM Payments p LEFT JOIN Users u ON p.UserID = u.UserID
            LEFT JOIN Brokers b ON u.BrokerID = b.BrokerID
            WHERE p.UserID = ?;`;

      const getNet7day = `SELECT Types, SUM(Amounts) AS net
            FROM Payments
            WHERE UserID = ? AND PaymentDateTime >= ?
            GROUP BY Types;`;

      connection.query(getpayment, [userID], (err, rows1) => {
        if (err) throw err;
        connection.query(getbrokername, [userID], (err, rows2) => {
          if (err) throw err;
          connection.query(getNet7day, [userID, currentdate], (err, rows3) => {
            if (err) throw err;
            let result = {
              paymentHistory: rows1,
              brokername: rows2,
              Net7day: rows3,
            };
            if (result.Net7day.length == 0) {
              result.Net7day = [{Types: 'Deposit', net: 0}, {Types: 'Withdraw', net: 0}]
            } else if (result.Net7day.length == 1 && result.Net7day[0]['Types']=='Deposit') {
              result.Net7day.push({Types: 'Withdraw', net: 0})
            } else if (result.Net7day.length == 1 && result.Net7day[0]['Types']=='Withdraw' ) {
              let temp = result.Net7day[0]
              result.Net7day = [{Types: 'Deposit', net: 0}]
              result.Net7day.push(temp)
            }
            connection.release();
            console.log(result);
            res.status(200).send(result);
          });
        });
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
};

export const DCAView = (req, res) => {
  const { cookies } = req.body;
  const payload = jwt.verify(cookies, "Bhun-er");
  const userID = payload["userID"];

  dbpool.getConnection((err, connection) => {
    if (err) throw err;
    
    const query = `SELECT d.*, s.StockSymbol FROM DCA_Orders d JOIN Stocks s ON d.StockID = s.StockID WHERE UserID = ?`
    connection.query(query,[userID], (err, rows) => {
      if (!rows) {
        connection.release()
        return res.status(400).json({ error: "Cannot get data" });
      }
      const DCAViewData = rows;
     
      connection.release()
      console.log(DCAViewData)
      return res.status(200).send(DCAViewData)
    })


  });
}