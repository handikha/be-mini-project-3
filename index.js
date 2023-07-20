import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import * as middleware from "./src/midlewares/index.js";

// @config dotenv
dotenv.config();

// @create express app
const app = express();

// @use body-parser
app.use(bodyParser.json());
app.use(middleware.requestLogger);
app.use(cors({ exposedHeaders: "Authorization" }));

//@exposed public folder
app.use("/public", express.static("public"));

// @root route
app.get("/", (req, res) => {
  res.status(200).send("<h1>Wellcome to Mini Project 03 REST-API</h1>");
});

// @use router
import AuthRouters from "./src/controllers/authentication/routers.js";
import CashierManagement from "./src/controllers/cashierManagement/routers.js";

app.use("/api/v1/auth", AuthRouters);
app.use("/api/v1/", CashierManagement);

//@global errorHandler
app.use(middleware.errorHandler);

// @listen to port
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
