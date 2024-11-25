import express, { json } from 'express';
import router from './src/routs.js';
import cors from 'cors';

var app = express();

const PORT = 5000;
app.use(cors());
app.use(json());

app.use('/', router);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type'
  );
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Помните, использование звёздочек в качестве маски может быть рискованным.
  next();
});

app.listen(PORT, () => console.log(`server started post on ${PORT}`));
