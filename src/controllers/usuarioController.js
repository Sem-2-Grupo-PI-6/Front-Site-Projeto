var usuarioModel = require("../models/usuarioModel");

function autenticar(req, res) {
  const email = req.body.emailServer;
  const senha = req.body.senhaServer;

  if (email == undefined) {
    res.status(400).send("Email incorreto!");
    return;
  } else if (senha == undefined) {
    res.status(400).send("Senha inválida!");
    return;
  }

  usuarioModel
    .autenticar(email, senha)
    .then(function (resultadoAutenticar) {
      console.log(`\n📊 Resultados encontrados: ${resultadoAutenticar.length}`);
      console.log(`📄 Resultados:`, resultadoAutenticar);

      if (resultadoAutenticar.length == 1) {
        console.log("✅ Login bem-sucedido!");
        res.json(resultadoAutenticar[0]);
      } else if (resultadoAutenticar.length == 0) {
        console.log("❌ Credenciais inválidas");
        res.status(403).send("Email e/ou senha inválido(s)");
      } else {
        console.log("⚠️ Múltiplos usuários encontrados");
        res.status(403).send("Mais de um usuário com o mesmo login e senha!");
      }
    })
    .catch(function (erro) {
      console.error("❌ ERRO NO LOGIN:", erro);
      console.error("Tipo do erro:", erro.code);
      console.error("Mensagem:", erro.sqlMessage || erro.message);
      

      if (erro.code === 'ER_SP_DOES_NOT_EXIST') {
        res.status(500).send("Erro: Procedure 'GetLogin' não existe no banco de dados");
      } else if (erro.code === 'ECONNREFUSED') {
        res.status(500).send("Erro: Não foi possível conectar ao banco de dados");
      } else {
        res.status(500).send("Erro interno ao realizar login");
      }
    });
}

function cadastrar(req, res) {
  var nome = req.body.nomeServer;
  var email = req.body.emailServer;
  var senha = req.body.senhaServer;
  var cnpj = req.body.cnpjServer;

  if (nome == undefined) {
    res.status(400).send("Seu nome está undefined!");
    return;
  } else if (cnpj == undefined) {
    res.status(400).send("Seu CNPJ está undefined!");
    return;
  } else if (email == undefined) {
    res.status(400).send("Seu email está undefined!");
    return;
  } else if (senha == undefined) {
    res.status(400).send("Sua senha está undefined!");
    return;
  }

  usuarioModel
    .cadastrar(nome, email, senha, cnpj)
    .then(function (resultado) {
      console.log("✅ Cadastro realizado com sucesso!");
      res.json(resultado);
    })
    .catch(function (erro) {
      console.error("❌ ERRO NO CADASTRO:", erro);
      console.error("Tipo do erro:", erro.code);
      console.error("Mensagem:", erro.sqlMessage || erro.message);

      if (erro.code === 'ER_DUP_ENTRY') {
        res.status(400).send("Erro: Email ou CNPJ já cadastrado");
      } else if (erro.code === 'ECONNREFUSED') {
        res.status(500).send("Erro: Não foi possível conectar ao banco de dados");
      } else {
        res.status(500).send("Erro interno ao realizar cadastro");
      }
    });
}

module.exports = {
  autenticar,
  cadastrar,
};