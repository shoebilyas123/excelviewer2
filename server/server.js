const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

require("dotenv").config();

const fileRouter = require("./routes/files");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors({ origin: "*" }));

app.use("/api/v1/files", fileRouter);

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
