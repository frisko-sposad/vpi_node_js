import mysql from 'mysql2';

export const pool = mysql.createPool({
  host: 'safiko.beget.tech',
  user: 'safiko_vpi_game',
  database: 'safiko_vpi_game',
  password: 'vpi_game2023',
});

// если будут проблемы проверить свой айпи и внести его в доступные для подключения к бд
