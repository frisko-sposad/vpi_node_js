import { Router } from 'express';
import { pool } from './db.js';

const router = Router();

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

// Персонажи и соседние феоды с кем граничит
router.get('/user/:userId', function (req, res) {
  // res.send('users');
  res.header('Access-Control-Allow-Origin', '*');

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

// Отряды
router.get('/user_squads/:userId', function (req, res) {
  res.header('Access-Control-Allow-Origin', '*');
  console.log(req.params);
  pool.query(
    `SELECT heroes.hero_owner,heroes.hero_id, heroes.hero_name, locations.locations_name, units.unit_name, units_squad.number FROM units_squad JOIN (locations, heroes, units) ON ( units_squad.units_squad_hero_id = heroes.hero_id AND units_squad.squad_location_id = locations.locations_id AND units_squad.units_squad_unit_id = units.unit_id) WHERE heroes.hero_owner = '${req.params.userId}' ORDER BY heroes.hero_name ASC`,
    function (err, results) {
      if (err) console.log(err);
      res.json(results);
    }
  );
  console.log(res);
});

// Информация по феоду
router.get('/feods/:userId', function (req, res) {
  // res.send('users');
  res.header('Access-Control-Allow-Origin', '*');

  console.log(req.params);
  pool.query(
    `SELECT * FROM locations JOIN users ON users.user_id = locations.locations_owner WHERE locations.locations_owner = '${req.params.userId}'`,
    function (err, results) {
      if (err) console.log(err);
      res.json(results);
    }
  );
  console.log(res);
});

// // Информация по рабочим доходы и затраты феоду NEW
// router.get('/feods-info/:userId', function (req, res) {
//   // res.send('users');
//   res.header('Access-Control-Allow-Origin', '*');
//   pool.query(
//     `SELECT
// locations_info.locations_id,
// locations_info.locations_name,
// users.login,
// mines_peasent,
// mines_slave,
// mines_limits,
// forest_peasent,
// forest_slave,
// forest_limits,
// horses_peasent,
// horses_slave,
// horses_limits,
// skins_peasent,
// skins_slave,
// skins_limits,
// food_peasent,
// food_slave,
// food_limits,
// unused_peasents,
// unused_slaves,
// (mines_peasent + forest_peasent + horses_peasent + skins_peasent + food_peasent) as work_peasent,
// (mines_slave + forest_slave + horses_slave + skins_slave + food_slave) as work_slave,
// (mines_limits + forest_limits + skins_limits + horses_limits + food_limits) as work_limits,
// (mines_peasent + forest_peasent + skins_peasent + horses_peasent + food_peasent + unused_peasents) as all_peasent,
// (mines_slave + forest_slave + skins_slave + horses_slave + food_slave + unused_slaves) as all_slave,
// (mines_peasent + forest_peasent + horses_peasent + skins_peasent + food_peasent + unused_peasents + mines_slave + forest_slave + horses_slave + skins_slave + food_slave + unused_slaves) as all_peasent_and_slave,
// army_prise_table.army_number,
// army_prise_table.army_prise
// FROM locations_info
// JOIN users ON users.user_id = locations_info.locations_user_id
// JOIN locations_production ON locations_production.locations_id = locations_info.locations_id
// JOIN (SELECT
// locations_info.locations_id,
// locations_info.locations_name,
// users.user_id,
// users.login,
// sum(units.unit_price * locations_army.locations_army_number) as army_prise,
// sum(locations_army.locations_army_number) as army_number FROM locations_info
// JOIN users ON users.user_id = locations_info.locations_user_id
// JOIN locations_army ON locations_army.locations_army_location_id = locations_info.locations_id
// JOIN units ON units.unit_id = locations_army.locations_army_unit_id
// WHERE locations_info.locations_user_id = '${req.params.userId}' GROUP by locations_info.locations_id ORDER by locations_info.locations_id) as army_prise_table ON army_prise_table.locations_id = locations_info.locations_id
// WHERE locations_info.locations_user_id = '${req.params.userId}'`,
//     function (err, results) {
//       if (err) console.log(err);
//       res.json(results);
//     }
//   );
// });

// Информация по рабочим NEW
router.get('/feods-info-worker/:userId', function (req, res) {
  // res.send('users');
  res.header('Access-Control-Allow-Origin', '*');
  pool.query(
    `SELECT 
locations_info.locations_id,
locations_user_id,
locations_info.locations_name,
users.login,
mines_peasent,
mines_slave,
mines_limits,
forest_peasent,
forest_slave,
forest_limits,
horses_peasent,
horses_slave,
horses_limits,
skins_peasent,
skins_slave,
skins_limits,
food_peasent,
food_slave,
food_limits,
unused_peasents,
unused_slaves,
(mines_peasent + forest_peasent + horses_peasent + skins_peasent + food_peasent) as work_peasent,
(mines_slave + forest_slave + horses_slave + skins_slave + food_slave) as work_slave,
(mines_limits + forest_limits + skins_limits + horses_limits + food_limits) as work_limits,
(mines_peasent + forest_peasent + skins_peasent + horses_peasent + food_peasent + unused_peasents) as all_peasent,
(mines_slave + forest_slave + skins_slave + horses_slave + food_slave + unused_slaves) as all_slave,
(mines_peasent + forest_peasent + horses_peasent + skins_peasent + food_peasent + unused_peasents + mines_slave + forest_slave + horses_slave + skins_slave + food_slave + unused_slaves) as all_peasent_and_slave
FROM locations_info 
JOIN users ON users.user_id = locations_info.locations_user_id
JOIN locations_production ON locations_production.locations_id = locations_info.locations_id
WHERE locations_info.locations_user_id = '${req.params.userId}'`,
    function (err, results) {
      if (err) console.log(err);
      res.json(results);
    }
  );
});
// Информация по цене армии NEW
router.get('/feods-info-army-price/:userId', function (req, res) {
  // res.send('users');
  res.header('Access-Control-Allow-Origin', '*');
  pool.query(
    `SELECT 
locations_info.locations_id,
locations_info.locations_name,
users.login,
army_prise_table.army_number,
army_prise_table.army_prise
FROM locations_info 
JOIN users ON users.user_id = locations_info.locations_user_id
JOIN (SELECT
locations_info.locations_id,
locations_info.locations_name,
users.user_id,
users.login,
sum(units.unit_price * locations_army.locations_army_number) as army_prise,
sum(locations_army.locations_army_number) as army_number FROM locations_info
JOIN users ON users.user_id = locations_info.locations_user_id
JOIN locations_army ON locations_army.locations_army_location_id = locations_info.locations_id
JOIN units ON units.unit_id = locations_army.locations_army_unit_id
WHERE locations_info.locations_user_id = '${req.params.userId}' GROUP by locations_info.locations_id ORDER by locations_info.locations_id) as army_prise_table ON army_prise_table.locations_id = locations_info.locations_id
WHERE locations_info.locations_user_id = '${req.params.userId}'`,
    function (err, results) {
      if (err) console.log(err);
      res.json(results);
    }
  );
});

// Информация по ресурсам феоду NEW
router.get('/feods-resources/:userId', function (req, res) {
  // res.send('users');
  res.header('Access-Control-Allow-Origin', '*');
  pool.query(
    `SELECT
locations_info.locations_id,
locations_info.locations_name,
users.user_id,
users.login
locations_resource_id,
iron,
forest,
skin,
horse,
food,
money
FROM locations_info 
JOIN users ON users.user_id = locations_info.locations_user_id
JOIN locations_resource ON locations_resource.locations_id = locations_info.locations_id
WHERE locations_info.locations_user_id = '${req.params.userId}'`,
    function (err, results) {
      if (err) console.log(err);
      res.json(results);
    }
  );
});

// выгрузка суммы жалования для армии в феоде
// SELECT
// locations_info.locations_id,
// locations_info.locations_name,
// users.user_id,
// users.login,
// sum(units.unit_price * locations_army.locations_army_number) as army_prise FROM locations_info
// JOIN users ON users.user_id = locations_info.locations_user_id
// JOIN locations_army ON locations_army.locations_army_location_id = locations_info.locations_id
// JOIN units ON units.unit_id = locations_army.locations_army_unit_id
// WHERE locations_info.locations_user_id = 2 GROUP by locations_info.locations_id ORDER by locations_info.locations_id

// Информация по гарнизону феода
router.get('/feods-army/:userId', function (req, res) {
  // res.send('users');
  res.header('Access-Control-Allow-Origin', '*');
  pool.query(
    `SELECT 
locations_info.locations_id, 
locations_info.locations_name, 
users.user_id, users.login,  
locations_army.locations_army_number,
units.unit_name,
unit_price,
hero_id,
hero_name
FROM locations_info 
JOIN users ON users.user_id = locations_info.locations_user_id
JOIN locations_army ON locations_army.locations_army_location_id = locations_info.locations_id
JOIN units ON units.unit_id = locations_army.locations_army_unit_id
JOIN heroes ON locations_army.locations_army_hero_id = heroes.hero_id
WHERE locations_info.locations_user_id = '${req.params.userId}' ORDER by locations_info.locations_id`,
    function (err, results) {
      if (err) console.log(err);
      res.json(results);
    }
  );
});

// Информация по отрядам игрока
router.get('/units_squad/:userId', function (req, res) {
  // res.send('users');
  res.header('Access-Control-Allow-Origin', '*');
  pool.query(
    `SELECT 
locations_info.locations_id, 
locations_info.locations_name, 
users.user_id, users.login,  
units_squad.number,
units.unit_name,
unit_price, 
hero_id,
hero_name
FROM locations_info 
JOIN users ON users.user_id = locations_info.locations_user_id
JOIN units_squad ON units_squad.squad_location_id = locations_info.locations_id
JOIN units ON units.unit_id = units_squad.units_squad_unit_id
JOIN heroes ON units_squad.units_squad_hero_id = heroes.hero_id
WHERE locations_info.locations_user_id = '${req.params.userId}' ORDER by locations_info.locations_id`,
    function (err, results) {
      if (err) console.log(err);
      res.json(results);
    }
  );
});

// Соседние феоды
router.get('/feods-navigation/:userId', function (req, res) {
  // res.send('users');
  res.header('Access-Control-Allow-Origin', '*');
  pool.query(
    `SELECT
path_graph_id,
path_graph_location_id_from,
li_from.locations_name,
path_graph_location_id_to,
li_to.locations_name,
li_from.locations_user_id
FROM path_graph
JOIN locations_info as li_from ON path_graph.path_graph_location_id_from = li_from.locations_id
JOIN locations_info as li_to  ON path_graph.path_graph_location_id_to = li_to.locations_id
WHERE li_from.locations_user_id = '${req.params.userId}'`,
    function (err, results) {
      if (err) console.log(err);
      res.json(results);
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

// добавить феод
router.post('/add_feod', async function (req, res) {
  res.header('Access-Control-Allow-Origin', '*');
  const {} = await req.body;

  pool.query(
    `INSERT INTO locations (mines_peasent, forest_peasent) VALUES (123,123);`,
    function (err, results) {
      if (err) console.log(err);
      res.json(`Добавлен feod`);
    }
  );
});

// Обновить данные по феоду
router.put('/update_feod', async function (req, res) {
  res.header('Access-Control-Allow-Origin', '*');
  const {
    locations_id,
    locations_name,
    mines_peasent,
    forest_peasent,
    horses_peasent,
    skins_peasent,
    food_peasent,
    mines_slave,
    forest_slave,
    horses_slave,
    skins_slave,
    food_slave,
    mines_limits,
    forest_limits,
    horses_limits,
    skins_limits,
    food_limits,
    unused_peasents,
    unused_slaves,
  } = await req.body;
  pool.query(
    `UPDATE locations SET mines_peasent = ${mines_peasent}, forest_peasent = ${forest_peasent}, horses_peasent = ${horses_peasent}, skins_peasent = ${skins_peasent}, food_peasent = ${food_peasent}, mines_slave = ${mines_slave}, forest_slave = ${forest_slave}, horses_slave = ${horses_slave}, skins_slave = ${skins_slave}, food_slave = ${food_slave}, mines_limits = ${mines_limits}, forest_limits = ${forest_limits}, horses_limits = ${horses_limits}, skins_limits = ${skins_limits}, food_limits = ${food_limits}, unused_peasents = ${unused_peasents}, unused_slaves = ${unused_slaves} WHERE locations.locations_id = ${locations_id};`,
    function (err, results) {
      if (err) console.log(err);
      res.json(`Феод "${locations_name}" обновлён`);
    }
  );
});

export default router;
// const { user_id, login, pass, info } = req.body;
//   console.log(user_id, login, pass, info);

// запрос на список путей в соседние локации строкой
//SELECT GROUP_CONCAT(locations.locations_name) FROM locations JOIN (path_graph) ON ( locations.locations_id= path_graph_location_near) WHERE path_graph_location_id = 2
// SELECT  path_graph_location_id, GROUP_CONCAT(locations.locations_name) FROM locations JOIN (path_graph) ON ( locations.locations_id= path_graph_location_near) GROUP BY path_graph_location_id
// SELECT * FROM locations JOIN (SELECT  path_graph_location_id, GROUP_CONCAT(locations.locations_name) FROM locations JOIN (path_graph) ON ( locations.locations_id= path_graph_location_near)  GROUP BY path_graph_location_id) as ttt ON locations.locations_id=path_graph_location_id
// SELECT hero_id, hero_name, hero_title, hero_name, login, games_id, locations.locations_name,  locations.locations_id, concat_view.concat_loc FROM heroes JOIN (houses, users, locations) ON (heroes.hero_house = houses.house_id  AND heroes.hero_owner = users.user_id AND heroes.hero_location = locations.locations_id) JOIN (SELECT  path_graph_location_id, GROUP_CONCAT(locations.locations_name) as concat_loc FROM locations JOIN (path_graph) ON ( locations.locations_id= path_graph_location_near)  GROUP BY path_graph_location_id) as concat_view ON locations.locations_id=path_graph_location_id WHERE heroes.hero_owner = 40
