const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

require('dotenv').config();

const fileRouter = require('./routes/files');
const authRouter = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 8000;
const MONGOURI = process.env.MONGO_URI.replace(
  '<DB_USERNAME>',
  process.env.DB_USERNAME
).replace('<DB_PASSWORD>', process.env.DB_PASSWORD);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors({ origin: '*' }));

app.use('/api/v1/files', fileRouter);
app.use('/api/v1/auth', authRouter);

console.log({ MONGOURI });

mongoose.connect(MONGOURI).then((con) => {
  console.log(`Connected to: ${con.connection.db}`);
  app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
  });
});
