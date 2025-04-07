const express = require("express");
const session = require("express-session");
const sqlite3 = require("sqlite3");

const app = express();

const PORT = 8000;

app.use('/static', express.static(__dirname + '/static'));

app.set('view engine', 'ejs');

app.get("/", (req, res) =>{
    console.log("GET /")
    //res.send("Alô SESI Sumaré");
    //res.send("<img src='./static/download.png'/>")
    res.render("index");
});

app.get("/sobre", (req, res) =>{
    console.log("GET /sobre")
    //res.send("Você está na página sobre");
    res.render("sobre");
});

app.get("/dashboard", (req, res) =>{
    console.log("GET /dashboard")
    res.send("Você está na página dashboard");
});

app.listen(PORT);

app.listen(PORT, () =>{
    console.log(`Servidor sendo executado na porta ${PORT}`);
    console.log(__dirname + "\\static");
});