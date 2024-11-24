import { Router } from 'express';
import { pool } from './db.js';
import cors from 'cors';
const router = Router();

const server = express();
server.use(cors());

// middleware that is specific to this router
// router.use(function timeLog(req, res, next) {
//   console.log('Time: ', Date.now());
//   next();
// });

router.get('/', function (req, res) {
  res.send('Home Page');
});

router.get('/page1', function (req, res) {
  res.send('Page1');
});

// показать всех юзеров
router.get('/users', function (req, res) {
  res.header('Access-Control-Allow-Origin', '*');
  // res.send('users');
  pool.query('SELECT * FROM users', function (err, results) {
    if (err) console.log(err);
    console.log(results);
    res.json(results);
  });
});

// показать юзера по id
router.get('/show_users/:userId', function (req, res) {
  // res.send('users');
  res.header('Access-Control-Allow-Origin', '*');
  const { userId } = req.params;
  pool.query(
    `SELECT * FROM users WHERE user_id = ${userId}`,
    function (err, results) {
      if (err) console.log(err);
      console.log(results);
      res.json(results);
    }
  );
});

// Удалить юзера по id
router.delete('/delete_users/:userId', function (req, res) {
  res.header('Access-Control-Allow-Origin', '*');
  // res.send('users');
  const { userId } = req.params;
  pool.query(
    `DELETE FROM users WHERE user_id = ${userId}`,
    function (err, results) {
      if (err) console.log(err);
      res.json(`Удалён юзер: id: ${userId}`);
    }
  );
});

// добавить юзера
router.post('/add_user', async function (req, res) {
  res.header('Access-Control-Allow-Origin', '*');
  const { user_id, login, pass, role, info } = await req.body;
  console.log(user_id, login, pass, role, info);
  pool.query(
    `INSERT INTO users (user_id, login, pass, role, info) VALUES (${user_id}, '${login}', '${pass}', '${role}', '${info}')`,
    function (err, results) {
      if (err) console.log(err);
      res.json(`Добавлен юзер: login: ${login}`);
    }
  );
});

// показать юзера
router.get('/user/:userId', function (req, res) {
  // res.send('users');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,OPTIONS,PATCH,DELETE,POST,PUT'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  console.log(req.params);
  pool.query(
    `SELECT hero_id, hero_name, hero_title, hero_name, login, games_id, locations.locations_name,  locations.locations_id, concat_view.concat_loc FROM heroes JOIN (houses, users, locations) ON (heroes.hero_house = houses.house_id  AND heroes.hero_owner = users.user_id AND heroes.hero_location = locations.locations_id) JOIN (SELECT  path_graph_location_id, GROUP_CONCAT(locations.locations_name) as concat_loc FROM locations JOIN (path_graph) ON ( locations.locations_id= path_graph_location_near)  GROUP BY path_graph_location_id) as concat_view ON locations.locations_id=path_graph_location_id WHERE heroes.hero_owner = '${req.params.userId}'`,
    function (err, results) {
      if (err) console.log(err);
      res.json(results);
    }
  );
  console.log(res);
});

export default router;
// const { user_id, login, pass, info } = req.body;
//   console.log(user_id, login, pass, info);

// запрос на список путей в соседние локации строкой
//SELECT GROUP_CONCAT(locations.locations_name) FROM locations JOIN (path_graph) ON ( locations.locations_id= path_graph_location_near) WHERE path_graph_location_id = 2
// SELECT  path_graph_location_id, GROUP_CONCAT(locations.locations_name) FROM locations JOIN (path_graph) ON ( locations.locations_id= path_graph_location_near) GROUP BY path_graph_location_id
// SELECT * FROM locations JOIN (SELECT  path_graph_location_id, GROUP_CONCAT(locations.locations_name) FROM locations JOIN (path_graph) ON ( locations.locations_id= path_graph_location_near)  GROUP BY path_graph_location_id) as ttt ON locations.locations_id=path_graph_location_id
// SELECT hero_id, hero_name, hero_title, hero_name, login, games_id, locations.locations_name,  locations.locations_id, concat_view.concat_loc FROM heroes JOIN (houses, users, locations) ON (heroes.hero_house = houses.house_id  AND heroes.hero_owner = users.user_id AND heroes.hero_location = locations.locations_id) JOIN (SELECT  path_graph_location_id, GROUP_CONCAT(locations.locations_name) as concat_loc FROM locations JOIN (path_graph) ON ( locations.locations_id= path_graph_location_near)  GROUP BY path_graph_location_id) as concat_view ON locations.locations_id=path_graph_location_id WHERE heroes.hero_owner = 40
