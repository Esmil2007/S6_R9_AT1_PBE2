const express = require("express");
const session = require("express-session");
const sqlite3 = require("sqlite3");
//const bodyparser = require("body-parser");

const app = express();

const PORT = 8000;

//Conexao com o BD
const db = new sqlite3.Database("users.db");

db.serialize(() => {
    db.run(
        "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)"
    )
})

app.use(
    session({
        secret: "senhaforteparacriptografarasessao",
        resave: true,
        saveUninitialized: true,
    })
)

app.use('/static', express.static(__dirname + '/static'));

//Configuração Expressa para processar requisições POST com Body Parameters
//app.use(bodyparser.urlencoded({extended: true})); //versão express 4
app.use(express.urlencoded({ extended: true })); //versão express 5

app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    console.log("GET /")
    //res.send("Alô SESI Sumaré");
    //res.send("<img src='./static/download.png'/>")
    res.render("./pages/index", { titulo: "Index", req: req });
});

app.get("/sobre", (req, res) => {
    console.log("GET /sobre")
    res.render("./pages/sobre", { titulo: "Sobre", req: req });
});

app.get("/cadastro", (req, res) => {
    console.log("GET /cadastro")
    res.render("./pages/cadastro", { titulo: "Cadastro", req: req });
});

app.post("/cadastro", (req, res) => {
    console.log("POST /cadastro");
    console.log(JSON.stringify(req.body));
    const { username, password } = req.body;

    const query = "SELECT * FROM users WHERE username =?"

    db.get(query, [username,], (err, row) => {
        if (err) throw err;

        //1. Verificar se o usuário existe
        console.log("Query SELECT do cadastro:", JSON.stringify(row));
        if (row) {
            //2. Se o usuário existir e a senha é válida no BD, executar processo de login
            console.log(`Usuário: ${username} já cadastrado.`);
            res.send("Usuário já cadastrado");
        } else {
            //3. Se não, executar processo de negação de login
            const insert = "INSERT INTO users (username, password) VALUES (?,?)"
            db.get(insert, [username, password], (err, row) => {
                if (err) throw err;

                console.log(`Usuário: ${username} cadastrado com sucesso.`)
                res.redirect("/login");
            })
        }


    })

    //res.render("./pages/login");
})

app.get("/login", (req, res) => {
    console.log("GET /login")
    res.render("./pages/login", { titulo: "Login", req: req });
});

app.post("/login", (req, res) => {
    console.log("POST /login")
    console.log(JSON.stringify(req.body));
    const { username, password } = req.body;

    const query = "SELECT * FROM users WHERE username=? AND password=?"
    db.get(query, [username, password], (err, row) => {
        if (err) throw err;

        //1. Verificar se o usuário existe
        console.log(JSON.stringify(row));
        if (row) {
            //2. Se o usuário existir e a senha é válida no BD, executar processo de login
            req.session.username = username;
            req.session.loggedin = true;
            res.redirect("/dashboard");
        } else {
            //3. Se não, executar processo de negação de login
            res.send("Usuário inválido");
        }


    })

    //res.render("./pages/login");
});

app.get("/logout", (req, res) =>{
    console.log("GET /logout");
    req.session.destroy(() =>{
        res.redirect("/");
    });
});

app.get("/dashboard", (req, res) => {
    console.log("GET /dashboard")
    //res.render("./pages/dashboard", {titulo: "Dashboard"});
    //Listar todos os usurios
    if(req.session.loggedin){
    const query = "SELECT * FROM users";
    db.all(query, [], (err, row) => {
        if (err) throw err;
        console.log(JSON.stringify(row));
        res.render("pages/dashboard", { titulo: "Tabela de usuários", dados: row, req: req });
    })
    } else {
        res.send("Usuário não logado");
    }
});

app.listen(PORT);

app.listen(PORT, () => {
    console.log(`Servidor sendo executado na porta ${PORT}`);
    console.log(__dirname + "\\static");
});