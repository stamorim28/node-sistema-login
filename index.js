const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Cadastro = require("./database/Cadastro");
const transporter = require("./database/nodemailer");
const md5 = require('md5');

//BANCO DE DADOS ---------------------------------------------------------------
connection.authenticate().then(() => {console.log("Conexão feita com o banco de dados")})
.catch((erro) => {
  console.log(erro)
});

//BIBLIOTECAS ------------------------------------------------------------------
app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//ROTAS ------------------------------------------------------------------------
app.get("/", (req, res) => {
  res.render("index");
})

app.post("/login", (req, res) => {
  let email = req.body.email;
  let senha = md5(req.body.senha);

  Cadastro.findOne({
    where: {email: email, senha: senha}
  }).then((cadastro) => {
    if(cadastro != undefined){
      res.render("obrigado")
    } else if (email == '' || senha == '' || cadastro == undefined) {
      res.redirect("/")
    }
  })
    
})

app.get("/cadastrar", (req, res) => {
  res.render("cadastro")
})

app.post("/salvarcadastro",(req, res) => {
  let nome = req.body.nome;
  let email = req.body.email;
  let senha = md5(req.body.senha);
  let confisenha = md5(req.body.confisenha);
  
  Cadastro.create({
    nome: nome,
    email: email,
    senha: senha
  }).then(() => {
    if(senha != confisenha || nome == "" || email == "" || senha == "" || confisenha == ""){
      Cadastro.destroy({
        where: {
          nome: nome,
          email: email,
          senha: senha
        }
      })
      res.redirect("/cadastrar")
       
    } else {
      res.redirect("/")
      transporter.sendMail({
        from: "Stênio Amorim <testamais.01@gmail.com>",
        to: email,
        subject: "Obrigado por testar minha aplicação!",
        html: `Olá ${nome}, se este email chegou até você então seu cadastro na aplicação foi feito com sucesso. &#128236; &#9989;<br><br>
        Para informações de <strong><a href='https://linktr.ee/stamorim28'>contato</a></strong> é só clicar, valeu. &#128513;<br><br>
        &#9940; email de teste, favor não responder. &#9940;`,
      }).then((msg) => {
        console.log(msg);
      }).catch((erro) => {
        console.log(erro);
      })
    }
    
  })
})

//SERVIDOR LOCAL ---------------------------------------------------------------
app.listen(5656, () =>{
  console.log("A aplicação está funcionando!");
})