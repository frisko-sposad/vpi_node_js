import mysql from 'mysql2';

export const pool = mysql.createPool({
  host: 'safiko.beget.tech',
  user: 'safiko_vpi_game',
  database: 'safiko_vpi_game',
  password: 'vpi_game2023',
});
