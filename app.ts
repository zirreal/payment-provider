import express from "express";
import prsRouter from "./src/routes/prs.js";
import APIRouter from "./src/routes/api.js";
import GeneralRouter from "./src/routes/generalRoutes.js";

import path from "path";
import ejs from "ejs";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import process from "process";

const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
    path: "./.env",
  });
  
app.use(
bodyParser.json({
    verify: (req, res, buf) => {
    (req as any).rawBody = buf;
    },
}),
);

app.engine("html", ejs.renderFile);
app.set("view engine", "html");
app.set("views", path.join(__dirname, process.env.STATIC_DIR || "./client/html "));


app.use(prsRouter);
app.use(GeneralRouter)
app.use(APIRouter);
app.use("/", express.static(path.join(__dirname, process.env.STATIC_DIR)));

  
app.use((req, res) => {
    res.status(404);
    res.send(`<h1>Error 404: Resource not found</h1>`);
});

app.listen(Number(process.env.PORT) || 5178, process.env.HOST || "127.0.0.1", () =>
    console.log(`Server running on http://${process.env.HOST || "127.0.0.1"}:${process.env.PORT || 5178}`),
);
  
