// var ambiente_processo = 'producao';
var ambiente_processo = "desenvolvimento";

var caminho_env = ambiente_processo === "producao" ? ".env" : ".env.dev";

require("dotenv").config({ path: caminho_env });

var express = require("express");
var cors = require("cors");
var path = require("path");
var PORTA_APP = process.env.APP_PORT;
var HOST_APP = process.env.APP_HOST;

var app = express();

var indexRouter = require("./src/routes/index");
var usuarioRouter = require("./src/routes/usuarios");
var avisosRouter = require("./src/routes/avisos");
var filtrosRouter = require("./src/routes/filtros");
var dadosRouter = require("./src/routes/dados");
var monitoramentoRouter = require("./src/routes/monitoramento");
var empresaRouter = require("./src/routes/empresa");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

app.use("/", indexRouter);
app.use("/usuarios", usuarioRouter);
app.use("/avisos", avisosRouter);
app.use("/filtros", filtrosRouter);
app.use("/dados", dadosRouter);
app.use("/monitoramento", monitoramentoRouter);
app.use("/empresa", empresaRouter);

process.on("uncaughtException", function (erro) {
  console.error("ERRO NÃO TRATADO");
  console.error("Erro:", erro);
  console.error("Stack:", erro.stack);
  console.error(" O servidor CONTINUARÁ rodando, mas corrija este erro!");
});

process.on("unhandledRejection", function (motivo, promise) {
  console.error("PROMISE REJEITADA NÃO TRATADA");
  console.error("Motivo:", motivo);
  console.error("Promise:", promise);
  console.error("O servidor CONTINUARÁ rodando, mas corrija este erro");
});

app.use(function (req, res, next) {
  res.status(404).send("Rota não encontrada:" + req.url);
});

app.use(function (err, req, res, next) {
  console.error("Erro capturado pelo middleware:", err);
  res.status(500).send("Erro interno do servidor");
});

app.listen(PORTA_APP, function () {
  console.log(`
    ##   ##  ######   #####             ####       ##     ######     ##              ##  ##    ####    ######  
    ##   ##  ##       ##  ##            ## ##     ####      ##      ####             ##  ##     ##         ##  
    ##   ##  ##       ##  ##            ##  ##   ##  ##     ##     ##  ##            ##  ##     ##        ##   
    ## # ##  ####     #####    ######   ##  ##   ######     ##     ######   ######   ##  ##     ##       ##    
    #######  ##       ##  ##            ##  ##   ##  ##     ##     ##  ##            ##  ##     ##      ##     
    ### ###  ##       ##  ##            ## ##    ##  ##     ##     ##  ##             ####      ##     ##      
    ##   ##  ######   #####             ####     ##  ##     ##     ##  ##              ##      ####    ######  
    \n\n\n                                                                                                 
    Servidor do seu site já está rodando! Acesse o caminho a seguir para visualizar .: http://${HOST_APP}:${PORTA_APP} :. \n\n
    Você está rodando sua aplicação em ambiente de .:${process.env.AMBIENTE_PROCESSO}:. \n\n
    \tSe .:desenvolvimento:. você está se conectando ao banco local. \n
    \tSe .:producao:. você está se conectando ao banco remoto. \n\n
    \t\tPara alterar o ambiente, comente ou descomente as linhas 1 ou 2 no arquivo 'app.js'\n\n`);
});
