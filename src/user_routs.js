import { Router } from 'express';
import { pool } from './db.js';

const router = Router();

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

// добавить юзера
router.post('/add_user', async function (req, res) {
  res.header('Access-Control-Allow-Origin', '*');
  const { user_id, login, page_code } = await req.body;
  console.log(user_id, login, page_code);
  const response = pool.query(
    `INSERT INTO users (user_id, login, page_code) VALUES (${user_id}, '${login}', '${page_code}')`,
    function (err, result) {
      if (err) {
        console.log(err);
        `Ошибка в запросе`;
      } else res.json(`Добавлен юзер: login: ${login} page_code: ${page_code}`);
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

export default router;
