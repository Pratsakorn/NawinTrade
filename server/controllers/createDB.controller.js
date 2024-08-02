import financialModelingPrep from "financialmodelingprep";
import dbpool from "../db/connectAWSdb.js";
import jwt from "jsonwebtoken";

export const insertStock = async (req, res) => {
  const apiKey = "gQERlMvVTI5GZJtzaVkQgSLTBpXiuxW7";
  const fmp = financialModelingPrep(apiKey);
  const stockjson = await fmp.stock("").profile();
  const pool = dbpool;
  // res.json(res);
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    console.log(stockjson["profile"]["companyName"]);
    const query = `INSERT INTO Stocks (StockID, StockSymbol, CompanyName, Exchange, CurrentPrice, MarketCap, LastestDividend, Sector, Industry, Website, ImageURL)
            VALUES (5, ?, ?, ?, 0, ?, 0, ?, ?, ?,  ?)`;
    connection.query(
      query,
      [
        stockjson["symbol"],
        stockjson["profile"]["companyName"],
        stockjson["profile"]["exchange"],
        stockjson["profile"]["mktCap"],
        stockjson["profile"]["sector"],
        stockjson["profile"]["industry"],
        stockjson["profile"]["website"],
        stockjson["profile"]["image"],
      ],
      (err, results, fields) => {
        if (err) throw err;
        console.log("Stock insert successfully: ", results);
      }
    );
  });
};

export const insertHistory = async (req, res) => {
  
  const apiKey = "gQERlMvVTI5GZJtzaVkQgSLTBpXiuxW7";
  const fmp = financialModelingPrep(apiKey);
  const stockjson = await fmp.stock("ibm").history();
  const pool = dbpool;
  // res.json(res);
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    // console.log(stockjson[0]);

    const queryGetHist = `SELECT * FROM Stock_Prices_History WHERE StockID = ?`
    let date
    connection.query(queryGetHist, [4], (err, rows) => {
       date = rows[0]['Date']
    })

    const query = `INSERT INTO Stock_Prices_History (StockID, Date, Open_Price, EOD_Price, Hi_Price, Lo_Price)
        VALUES (4, ?, ?, ?, ?, ?)`;
    for (let i = 0; i < 180; i++) {
      if (stockjson["historical"][i]["date"] == date ) {
        break
      }
      connection.query(
        query,
        [
          stockjson["historical"][i]["date"],
          stockjson["historical"][i]["open"],
          stockjson["historical"][i]["adjClose"],
          stockjson["historical"][i]["high"],
          stockjson["historical"][i]["low"],
        ],
        (err, results) => {
          if (err) throw err;
        }
      );
    }

    // const q = `DELETE FROM Stock_Prices_History WHERE StockID = "0000000005"`
    // connection.query(q, (err, results) => {
    //     if (err ) throw err
    // })

    console.log("History inserted!");
    connection.release();
  });
};

export const setStockPrice = async (req, res) => {
  const apiKey = "gQERlMvVTI5GZJtzaVkQgSLTBpXiuxW7";
  const fmp = financialModelingPrep(apiKey);
  //const stockjson = await fmp.stock("nke").history();
  const pool = dbpool;
  // res.json(res);
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);

    const q = `UPDATE Stocks
        SET CurrentPrice = (
            SELECT EOD_Price
            FROM Stock_Prices_History
            WHERE Stock_Prices_History.StockID = Stocks.StockID
            ORDER BY Date DESC
            LIMIT 1
        ) WHERE StockID = 0000000005`;
    connection.query(q, (err, results) => {
      if (err) throw err;
      console.log(results);
    });

    console.log("Price is set!");
    connection.release();
  });
};

export const insertYieldHistory = async (req, res) => {
  const apiKey = "gQERlMvVTI5GZJtzaVkQgSLTBpXiuxW7";
  const fmp = financialModelingPrep(apiKey);
  const stockjson = await fmp.stock("nke").dividend_history();
  const pool = dbpool;
  // res.json(res);
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    console.log(stockjson["historical"][0]);
    const query = `INSERT INTO Trailing_Dividend_Payment (StockID, ExDate, DeclarationDate, RecordDate, PaymentDate, Dividend)
        VALUES (5, ?, ?, ?, ?, ?)`;

    for (let i = 0; i < 20; i++) {
      connection.query(
        query,
        [
          stockjson["historical"][i]["date"],
          stockjson["historical"][i]["declarationDate"],
          stockjson["historical"][i]["recordDate"],
          stockjson["historical"][i]["paymentDate"],
          stockjson["historical"][i]["dividend"],
        ],
        (err, results) => {
          if (err) throw err;
        }
      );
    }

    // const q = `DELETE FROM Stock_Prices_History WHERE StockID = "0000000004"`
    // connection.query(q, (err, results) => {
    //     if (err ) throw err
    // })

    console.log("History inserted!");
    connection.release();
  });
};
