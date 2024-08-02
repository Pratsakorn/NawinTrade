import financialModelingPrep from "financialmodelingprep";
import dbpool from "../db/connectAWSdb.js";
import jwt from "jsonwebtoken";
import MOMENT from "moment";

//makeOrder controller ----sell function incomplete----
export const makeOrder = async (req, res) => {
  const currentdate = MOMENT().format("YYYY-MM-DD HH:mm:ss");
  console.log(currentdate);
  const { StockSymbol, Amounts, AccountBalance, OrderType, cookies } = req.body;
  const apiKey = "gQERlMvVTI5GZJtzaVkQgSLTBpXiuxW7";
  const fmp = financialModelingPrep(apiKey);
  const stockjson = await fmp.stock("AAPL").current_price();
  const payload = jwt.verify(cookies, "Bhun-er");
  const userID = payload["userID"];
  // console.log(cookies)
  // console.log(payload['userID'])

  // console.log(stockjson['companiesPriceList'][0]['price'])
  // res.send("stockjson")

  dbpool.getConnection((err, connection) => {
    if (err) throw err;

    //RealNoCom = Value*(1-(com['TradingComFee']/100));
    //console.log(RealNoCom)

    const query_com = `SELECT BrokerName, TradingComFee From Brokers WHERE BrokerID = (SELECT BrokerID FROM Users WHERE UserID = ? )`;
    connection.query(query_com, [userID], async (err, rows) => {
      if (err) throw err;
      const com = rows[0];
      console.log(rows);
      if (!com) {
        connection.release();
        return res.status(400).json({ error: "Cannot get data" });
      }

      let moneyValue;
      let Volume;
      let RealNoCom;
      let money;
      if (OrderType == "Buy") {
        moneyValue = Amounts;
        RealNoCom = moneyValue * (1 - com["TradingComFee"] / 100);
        Volume = RealNoCom / stockjson["companiesPriceList"][0]["price"];
        money = AccountBalance - Amounts;
      } else {
        moneyValue = Amounts * stockjson["companiesPriceList"][0]["price"];
        RealNoCom = moneyValue * (1 - com["TradingComFee"] / 100);
        Volume = Amounts;
        //money = Number(AccountBalance) + Number(RealNoCom)
        money = AccountBalance;
      }

      const query_CheckAvailable = `SELECT * FROM Stock_Available 
                                    WHERE BrokerID = (SELECT BrokerID FROM Users WHERE UserID = ?) 
                                    AND StockID = (SELECT StockID FROM Stocks WHERE StockSymbol = ?);`;

      connection.query(
        query_CheckAvailable,
        [userID, StockSymbol],
        (err, rows) => {
          if (err) throw err;
          if (!rows) {
            connection.release();
            return res.status(400).json({ error: "Cannot get data" });
          }
        }
      );

      const query_balance = `UPDATE Users SET AccountBalance = ?  WHERE UserID = ?;`;
      connection.query(query_balance, [money, userID], async (err, rows) => {
        if (err) throw err;
        console.log(money);
        //res.status(200).send("Balance Updated")
      });

      const query_StockID = `SELECT * FROM Stocks WHERE StockSymbol = ?;`;
      connection.query(query_StockID, [StockSymbol], async (err, rows) => {
        if (err) throw err;
        const stock = rows[0];
        // console.log(stock['StockID'],OrderType,Volume);

        if (!stock) {
          connection.release();
          return res.status(400).json({ error: "Cannot get data" });
        }

        const query_Order = `INSERT INTO Orders (UserID, StockID, OrderType, Volume, Price, OrderStatus, OrderDateTime) 
                              VALUES (?,?,?,?,?,"Pending",?);`;

        connection.query(
          query_Order,
          [
            userID,
            stock["StockID"],
            OrderType,
            Volume,
            stockjson["companiesPriceList"][0]["price"],
            currentdate,
          ],
          (err, result) => {
            if (err) throw err;
            const orderInfo = Object.assign(
              { Volume },
              { price: stockjson["companiesPriceList"][0]["price"] },
              { RealNoCom },
              { Com: Amounts - RealNoCom },
              { BrokerName: com["BrokerName"] },
              { orderID: result["insertId"] }
            );
            console.log(orderInfo);
            console.log("Insert order complete");
            connection.release();
            res.status(200).send(orderInfo);
          }
        );
      });
    });
  });
};

export const makePayment = (req, res) => {
  const { cookies, Amounts, Types, AccountBalance } = req.body;
  const payload = jwt.verify(cookies, "Bhun-er");
  const userID = payload["userID"];
  const currentdate = MOMENT().format("YYYY-MM-DD HH:mm:ss");
  //console.log(currentdate)

  dbpool.getConnection(async (err, connection) => {
    if (err) throw err;
    try {
      const insertQuery = `INSERT INTO Payments (UserID, Amounts, Types, PaymentDateTime) VALUES(?,?,?,?);`;
      connection.query(
        insertQuery,
        [userID, Amounts, Types, currentdate],
        (err, results) => {
          if (err) throw err;
          console.log(results);
        }
      );
      const editBalanceQuery = `UPDATE Users SET AccountBalance = ? WHERE UserID = ?;`;
      let money;
      if (Types == "Withdraw") {
        money = Number(AccountBalance) - Number(Amounts);
      } else {
        money = Number(AccountBalance) + Number(Amounts);
      }
      connection.query(editBalanceQuery, [money, userID], (err, results) => {
        if (err) throw err;
        console.log(results);
        connection.release();
        res.status(200).send("Complete payment : " + Types + "success");
      });
    } catch (error) {
      connection.release();
      console.log(error);
    }
  });
};

export const makeDCA = async (req, res) => {
  const { StockSymbol, Amounts, providedDayOfMonth, EndDate, cookies } =
    req.body;
  const today = MOMENT(); // Current date
  // const providedDayOfMonth = 2; // Example: Day provided by the user
  // let nextDCADate = MOMENT().date(providedDayOfMonth); // Set the provided day of the month
  // if (nextDCADate.isBefore(today)) {
  //     // If the provided date is in the past, adjust to the next month
  //     nextDCADate = nextDCADate.add(1, 'months').startOf('month').date(providedDayOfMonth);
  // }
  // const formattedNextDCADate = nextDCADate.format('YYYY-MM-DD');
  //console.log(formattedNextDCADate);

  const payload = jwt.verify(cookies, "Bhun-er");
  const userID = payload["userID"];
  // console.log(cookies)
  // console.log(payload['userID'])

  dbpool.getConnection((err, connection) => {
    if (err) throw err;

    const query_CheckAvailable = `SELECT * FROM Stock_Available
                                   WHERE BrokerID = (SELECT BrokerID FROM Users WHERE UserID = ?)
                                    AND StockID = (SELECT StockID FROM Stocks WHERE StockSymbol = ?);`;

    connection.query(
      query_CheckAvailable,
      [userID, StockSymbol],
      (err, rows) => {
        if (err) throw err;
        if (!rows) {
          connection.release();
          return res.status(400).json({ error: "Cannot get data" });
        }
      }
    );

    const query_userBalance = `SELECT AccountBalance FROM Users WHERE UserID = ?;`;
    connection.query(query_userBalance, [userID], async (err, rows) => {
      if (err) throw err;
      const Balance = rows[0];
      //console.log(Balance['AccountBalance'])
      if (!Balance) {
        connection.release();
        return res.status(400).json({ error: "Cannot get data" });
      }

      let money;
      if (Balance["AccountBalance"] >= Amounts) {
        money = Balance["AccountBalance"] - Amounts;
      } else {
        console.log("Not Enough Balance");
      }

      const query_updateBalance = `UPDATE Users SET AccountBalance = ?  WHERE UserID = ?;`;
      connection.query(query_updateBalance, [money, userID], async (err) => {
        if (err) throw err;
        console.log(money);
        // res.status(200).send("Balance Updated")
      });

      const query_StockID = `SELECT * FROM Stocks WHERE StockSymbol = ?;`;
      connection.query(query_StockID, [StockSymbol], async (err, rows) => {
        if (err) throw err;
        const stock = rows[0];
        console.log(stock["StockID"]);

        if (!stock) {
          connection.release();
          return res.status(400).json({ error: "Cannot get data" });
        }

        const query_DCAOrder = `INSERT INTO DCA_Orders (UserID, StockID, Amounts, DCADate, EndDate)
                                 VALUES (?,?,?,?,?)`;
        connection.query(
          query_DCAOrder,
          [userID, stock["StockID"], Amounts, providedDayOfMonth, EndDate],
          (err, result) => {
            if (err) throw err;
            if (!result) {
              console.log(providedDayOfMonth);
              connection.release();
              return res.status(400).json({ error: "Cannot get data" });
            }
            //console.log('Insert DCA order complete')
            connection.release();
            res.status(200).send("Insert DCA order complete");
          }
        );
      });
    });
  });
};
