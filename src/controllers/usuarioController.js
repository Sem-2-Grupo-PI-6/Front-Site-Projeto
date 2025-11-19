var usuarioModel = require("../models/usuarioModel");

function autenticar(req, res) {
  const email = req.body.emailServer;
  const senha = req.body.senhaServer;

  console.log("📧 Tentativa de login:", email);

  if (!email) {
    res.status(400).send("Email está undefined!");
    return;
  } else if (!senha) {
    res.status(400).send("Senha está undefined!");
    return;
  }

  usuarioModel.autenticar(email, senha)
    .then(function (resultadoAutenticar) {
      console.log(`📊 Resultados encontrados: ${resultadoAutenticar.length}`);

      if (resultadoAutenticar.length === 0) {
        console.log("❌ Credenciais inválidas");
        res.status(403).json({ erro: "Email e/ou senha inválido(s)" });
        return;
      }

      const usuario = resultadoAutenticar[0];

    

      console.log("✅ Autenticação bem-sucedida!");



      usuarioModel.atualizarUltimoAcesso(usuario.idUsuario)
        .then(() => console.log("📅 Último acesso atualizado"))
        .catch((erro) => console.warn("⚠️ Erro ao atualizar último acesso:", erro));

      res.json({
        idUsuario: usuario.idUsuario,
        email: usuario.email,
        nome: usuario.nome,
        idEmpresa: usuario.Empresa_idEmpresa,
        nomeEmpresa: usuario.nomeEmpresa,
        cnpj: usuario.cnpj,
        descricaoAcesso: usuario.descricaoAcesso
      });
    })
    .catch(function (erro) {
      console.error("❌ Erro ao autenticar:", erro);
      res.status(500).json({ erro: "Erro interno ao realizar login" });
    });
}


function cadastrar(req, res) {
  var nome = req.body.nomeServer;
  var email = req.body.emailServer;
  var senha = req.body.senhaServer;
  var cnpj = req.body.cnpjServer;

  if (!nome || !cnpj || !email || !senha) {
    res.status(400).send("Campos obrigatórios faltando!");
    return;
  }

  usuarioModel.cadastrar(nome, email, senha, cnpj)
    .then(function (resultado) {
      console.log("✅ Cadastro realizado com sucesso!");
      res.json(resultado);
    })
    .catch(function (erro) {
      console.error("❌ ERRO NO CADASTRO:", erro);
      
      if (erro.code === "ER_DUP_ENTRY") {
        res.status(400).send("Erro: Email ou CNPJ já cadastrado");
      } else {
        res.status(500).send("Erro interno ao realizar cadastro");
      }
    });
}

module.exports = {
  autenticar,
  cadastrar
};