const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "news_blog",
    password: "xxx123123"
});

connection.connect(function (err) {
    if (err) {
        return console.error("Ошибка: " + err.message);
    }
    else {
        console.log("Подключение к серверу MySQL успешно установлено");
    }
});


const createProcedureGetNewsByUser = `
CREATE PROCEDURE news_blog.GetNewsByUser(
    IN name VARCHAR(128))
    BEGIN
        SELECT title,description, cover from news WHERE userName = name;
    END
`;

const createProcedureGetNewsById = `
CREATE PROCEDURE news_blog.GetNewsById(
    IN newsId INT
    )
    BEGIN
        SELECT title, description, cover, userName FROM news WHERE id = newsId;
    END
`;

const createProcedureGetNewsAll = `
CREATE PROCEDURE news_blog.GetAllNews()
BEGIN
	SELECT title,description,userName,cover From news;
END
`

// Выполнение запроса для создания хранимой процедуры
connection.query(createProcedureGetNewsByUser, (error, results, fields) => {
    if (error) {
        console.error('Ошибка при создании хранимой процедуры:', error);
    } else {
        console.log('Хранимая процедура успешно создана');
    }
});

connection.query(createProcedureGetNewsById, (error, results, fields) => {
    if (error) {
        console.error('Ошибка при создании хранимой процедуры:', error);
    } else {
        console.log('Хранимая процедура успешно создана');
    }
});

connection.query(createProcedureGetNewsAll, (error, results, fields) => {
    if (error) {
        console.error('Ошибка при создании хранимой процедуры:', error);
    } else {
        console.log('Хранимая процедура успешно создана');
    }
});

// закрытие подключения
connection.end(function (err) {
    if (err) {
        return console.log("Ошибка: " + err.message);
    }
    console.log("Подключение закрыто");
});