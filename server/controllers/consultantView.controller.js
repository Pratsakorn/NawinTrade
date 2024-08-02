import dbpool from "../db/connectAWSdb.js";
import jwt from "jsonwebtoken";
import axios from "axios";

export const consultCustomerPortView = (req, res) => {
  const { cookies } = req.body;
  const payload = jwt.verify(cookies, "Bhun-er-consultant");
  const consultID = payload["consultID"];

  dbpool.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    const query = `SELECT UserID, fName, lName, AccountNo, Email, Phone FROM Users WHERE ConsultID = ?`;
    connection.query(query, [consultID], async (err, rows) => {
      if (err) {
        connection.release();
        return res.status(500).json({ error: "Internal Server Error" });
      }
      if (!rows || rows.length === 0) {
        connection.release();
        return res.status(400).json({ error: "Cannot get data" });
      }
      const customers = rows;
      const respond = [];

      for (let i = 0; i < customers.length; i++) {
        const customer = customers[i];
        const { UserID, fName, lName, AccountNo, Email, Phone } = customer;
        const token = jwt.sign({ userID: UserID }, "Bhun-er", {
          expiresIn: "15d",
        });

        try {
          const response = await axios.post(
            "http://127.0.0.1:5000/api/customerView/portfolio/",
            { cookies: token }
          );
          const portfolioData = response.data;

          // Add portfolio data along with user details to the respond array
          respond.push({
            UserID,
            fName,
            lName,
            AccountNo,
            Email,
            Phone,
            portfolioData,
          });
        } catch (error) {
          console.error("Error in axios request:", error);
          respond.push({ error: "Failed to fetch portfolio" });
        }
      }

      connection.release();
      console.log("\nThis is from Consult\n");
      console.log(respond); // Now you can see all responses
      res.status(200).json(respond);
    });
  });
};
