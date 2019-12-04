/**
 * @prettier
 */

const express = require("express"); // importing a CommonJS module
const helmet = require("helmet");

const hubsRouter = require("./hubs/hubs-router.js");

const server = express();

// Middlewares
server.use(helmet());
server.use(express.json());

// custom middleware
function validatePassword(req, res, next) {
  const password = req.headers.password;
  if (password && password === "melon") {
    next();
  } else {
    res.status(401).json({ message: "invalid password" });
  }
}

function checkRole(role) {
  return function(req, res, next) {
    if (role && role === req.headers.role) {
      next();
    } else {
      res.status(403).json({ message: "Invalid role permissions" });
    }
  };
}

server.use("/api/hubs", checkRole("admin"), hubsRouter);

server.get("/", (req, res) => {
  const nameInsert = req.name ? ` ${req.name}` : "";

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

server.get("/area51", validatePassword, checkRole("agent"), (req, res) => {
  res.send(req.headers);
});

module.exports = server;
