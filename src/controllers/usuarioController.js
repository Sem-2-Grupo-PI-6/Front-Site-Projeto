var usuarioModel = require("../models/usuarioModel");

function autenticar(req, res) {
  const email = req.body.emailServer;
  const senha = req.body.senhaServer;
  const tipoEsperado = req.body.tipoEsperadoServer; 

  console.log("📧 Tentativa de login:", email, "| Tipo esperado:", tipoEsperado);

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

      if (!usuario.podeAcessar) {
        console.log("❌ Acesso negado:", usuario.descricaoAcesso);
        
        if (usuario.sitacaoLicensa === 'Suspensa') {
          res.status(403).json({ erro: "Licença da empresa suspensa. Entre em contato com o suporte." });
        } else if (usuario.sitacaoLicensa === 'Inativa') {
          res.status(403).json({ erro: "Licença da empresa inativa. Renove sua assinatura." });
        } else if (!usuario.usuarioAtivo) {
          res.status(403).json({ erro: "Usuário desativado. Entre em contato com o administrador." });
        } else {
          res.status(403).json({ erro: "Acesso negado. Verifique suas credenciais." });
        }
        return;
      }


      if (tipoEsperado && usuario.tipoUsuario !== tipoEsperado) {
        console.log(`❌ Tipo incorreto. Esperado: ${tipoEsperado}, Recebido: ${usuario.tipoUsuario}`);
        
        let mensagemErro = "";
        if (tipoEsperado === 'admin' && usuario.tipoUsuario !== 'admin') {
          mensagemErro = "Este portal é exclusivo para administradores.";
        } else if (tipoEsperado === 'empresa' && usuario.tipoUsuario !== 'empresa') {
          mensagemErro = "Este portal é exclusivo para gestores de empresa.";
        } else if (tipoEsperado === 'usuario' && usuario.tipoUsuario !== 'usuario') {
          mensagemErro = "Este portal é exclusivo para usuários.";
        }
        
        res.status(403).json({ erro: mensagemErro });
        return;
      }

      console.log("✅ Autenticação bem-sucedida!");
      console.log("👤 Tipo de usuário:", usuario.tipoUsuario);


      usuarioModel.atualizarUltimoAcesso(usuario.idUsuario)
        .then(() => console.log("📅 Último acesso atualizado"))
        .catch((erro) => console.warn("⚠️ Erro ao atualizar último acesso:", erro));

      res.json({
        idUsuario: usuario.idUsuario,
        email: usuario.email,
        nome: usuario.nome,
        tipoUsuario: usuario.tipoUsuario,
        idEmpresa: usuario.Empresa_idEmpresa,
        nomeEmpresa: usuario.nomeEmpresa,
        cnpj: usuario.cnpj,
        tipoPlano: usuario.tipoPlano,
        limiteUsuarios: usuario.limiteUsuarios,
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