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
    res.render("./pages/index");
});

app.get("/sobre", (req, res) =>{
    console.log("GET /sobre")
    res.render("./pages/sobre");
});

app.get("/cadastro", (req, res) =>{
    console.log("GET /cadastro")
    res.render("./pages/cadastro");
});

app.get("/login", (req, res) =>{
    console.log("GET /login")
    res.render("./pages/login");
});

app.get("/dashboard", (req, res) =>{
    console.log("GET /dashboard")
    res.render("./pages/dashboard");
});

app.listen(PORT);

app.listen(PORT, () =>{
    console.log(`Servidor sendo executado na porta ${PORT}`);
    console.log(__dirname + "\\static");
});