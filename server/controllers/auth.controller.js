import bcrypt from "bcrypt";
import dbpool from "../db/connectAWSdb.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";
import jwt from "jsonwebtoken";

// signin controller
export const signin = async (req, res) => {
  try {
    const { username, password, brokerID } = req.body;
    dbpool.getConnection(async (err, connection) => {
      if (err) throw err;
      connection.query(
        "SELECT * FROM Users WHERE Username = ? AND BrokerID = ?",
        [username, brokerID],
        async (err, rows) => {
          if (err) throw err;
          const user = rows[0];

          //console.log(rows)
          //connection.release()
          if (!user) {
            return res
              .status(400)
              .json({ error: "Invalid username or password or brokerID" });
          }

          // Compare passwords
          const isPasswordCorrect = await bcrypt.compare(
            password,
            user["Password"]
          );

          if (!isPasswordCorrect) {
            return res
              .status(400)
              .json({ error: "Invalid username or password or brokerID" });
          }

          // Login successful, generate token and set cookie
          //constgenerateTokenAndSetCookie(user['UserID'], res); // Call the function with userId

          const userID = user["UserID"];

          // Respond with user information
          const token = jwt.sign({ userID }, "Bhun-er", {
            expiresIn: "15d",
          });

          console.log("login success");
          res
            .cookie("jwt", token, {
              maxAge: 15 * 24 * 60 * 60 * 1000, // MS
              httpOnly: true, // prevent XSS attacks cross-site scripting attacks
              sameSite: "strict", // CSRF attacks cross-site request forgery attacks
              secure: process.env.NODE_ENV !== "development",
            })
            .status(200)
            .json({ token });
        }
      );
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// signout controller not finish wait for kennn
export const signout = (req, res) => {
  try {
    console.log(req);
    res.cookie("user-auth", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const signinStaff = (req, res) => {
  try {
    const { username, password } = req.body;
    dbpool.getConnection(async (err, connection) => {
      if (err) throw err;
      connection.query(
        "SELECT * FROM Broker_Staffs WHERE Username = ? ",
        [username],
        async (err, rows) => {
          if (err) throw err;
          const staff = rows[0];

          console.log(rows);
          //connection.release()
          if (!staff) {
            return res
              .status(400)
              .json({ error: "Invalid username or password " });
          }

          // Compare passwords
          const isPasswordCorrect = await bcrypt.compare(
            password,
            staff["Password"]
          );

          if (!isPasswordCorrect) {
            console.log("wrong password");
            console.log(staff["Password"]);
            return res
              .status(400)
              .json({ error: "Invalid username or password" });
          }

          // Login successful, generate token and set cookie
          //constgenerateTokenAndSetCookie(user['UserID'], res); // Call the function with userId

          const staffID = staff["StaffID"];

          // Respond with user information
          const token = jwt.sign({ staffID }, "Bhun-er-staff", {
            expiresIn: "15d",
          });

          console.log("login success");
          res
            .cookie("jwt", token, {
              maxAge: 15 * 24 * 60 * 60 * 1000, // MS
              httpOnly: true, // prevent XSS attacks cross-site scripting attacks
              sameSite: "strict", // CSRF attacks cross-site request forgery attacks
              secure: process.env.NODE_ENV !== "development",
            })
            .status(200)
            .json({ token });
        }
      );
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const signoutStaff = (req, res) => {
  try {
    console.log(req);
    res.cookie("staff-auth", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const signinConsultant = (req, res) => {
  try {
    const { username, password } = req.body;
    dbpool.getConnection(async (err, connection) => {
      if (err) throw err;
      connection.query(
        "SELECT * FROM Investment_Consultant WHERE Username = ? ",
        [username],
        async (err, rows) => {
          if (err) throw err;
          const consultant = rows[0];

          console.log(rows);
          //connection.release()
          if (!consultant) {
            return res
              .status(400)
              .json({ error: "Invalid username or password " });
          }

          // Compare passwords
          const isPasswordCorrect = await bcrypt.compare(
            password,
            consultant["Password"]
          );

          if (!isPasswordCorrect) {
            console.log("wrong password");
            console.log(consultant["Password"]);
            return res
              .status(400)
              .json({ error: "Invalid username or password" });
          }

          // Login successful, generate token and set cookie
          //constgenerateTokenAndSetCookie(user['UserID'], res); // Call the function with userId

          const consultID = consultant["ConsultID"];

          // Respond with user information
          const token = jwt.sign({ consultID }, "Bhun-er-consultant", {
            expiresIn: "15d",
          });

          console.log("login success");
          res
            .cookie("jwt", token, {
              maxAge: 15 * 24 * 60 * 60 * 1000, // MS
              httpOnly: true, // prevent XSS attacks cross-site scripting attacks
              sameSite: "strict", // CSRF attacks cross-site request forgery attacks
              secure: process.env.NODE_ENV !== "development",
            })
            .status(200)
            .json({ token });
        }
      );
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const signoutConsultant = (req, res) => {
  try {
    console.log(req);
    res.cookie("consultant-auth", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
