# Service_nodeJS_postgres

Проект веб-сервиса с использованием Nodejs и PostgreSQL, состоящий
из 5 операций: создание пользователя, просмотр созданного пользователя, вывод всех пользователей,
изменение пользователя, удаление пользователя.
Данный проект позволено использовать в целях обучения написанию скриптов нагрузочного
тестирования (НТ) с использованием инструментов НТ.

Сервис запускается по адресу: http://localhost:5000.

## Описание API с примерами

Веб-сервис реализует следующие операции:

```
POST    http://localhost:5000/api/user       - Cоздание пользователя
GET     http://localhost:5000/api/user       - Вывод всех пользователей которые есть в базе даных
GET     http://localhost:5000/api/user/{id}  - Вывод конкретного пользователя по id
PUT     http://localhost:5000/api/user       - Изменение пользователя
DELETE  http://localhost:5000/api/user/{id}  - Удаление пользователя по id
```

### POST

 <details><summary>.</summary>

Body

```JSON
{
   "name": "Polina",
   "surname": "Alexeivna"
}
```

</details>

### GET

 <details><summary>.</summary>

URL

Тело запроса отсутствует

</details>

### GET

 <details><summary>.</summary>

URL

Тело запроса отсутствует

</details>

### PUT

 <details><summary>.</summary>

Body

```JSON
{
   "name": "John",
    "surname": "Mactavish",
    "id": 5
}
```

Изменение происходит по id в теле запроса

</details>

### DELETE

 <details><summary>.</summary>

URL

Тело запроса отсутствует

</details>

### В файлах "database.sql", "db.js" описание подключения к Postgre.
