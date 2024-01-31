import express, { json } from 'express';
import router from './routs.js';
var app = express();

const PORT = 5000;

app.use(json());

app.use('/', router);

app.listen(PORT, () => console.log(`server started post on ${PORT}`));

// test
