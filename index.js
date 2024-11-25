import express, { json } from 'express';
import router from './src/routs.js';
const cors = require('cors');
var app = express();

const PORT = 5000;
app.use(cors());
app.use(json());

app.use('/', router);

app.listen(PORT, () => console.log(`server started post on ${PORT}`));
