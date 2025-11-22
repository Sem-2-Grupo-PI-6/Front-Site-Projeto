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

  usuarioModel
    .autenticar(email, senha)
    .then(function (resultadoAutenticar) {
      console.log(`📊 Resultados encontrados: ${resultadoAutenticar.length}`);

      if (resultadoAutenticar.length === 0) {
        console.log("Credenciais inválidas");
        res.status(403).json({ erro: "Email e/ou senha inválido(s)" });
        return;
      }

      const usuario = resultadoAutenticar[0];

      if (usuario.usuario_pertence_a_empresa_ativa === 0) {
        console.log("Empresa sem licença ativa");
        res.status(403).json({
          erro: "Empresa sem licença ativa! Entre em contato com o suporte.",
        });
        return;
      }

      console.log("Autenticação bem-sucedida!");

      usuarioModel
        .atualizarUltimoAcesso(usuario.idUsuario)
        .then(() => console.log("Último acesso atualizado"))
        .catch((erro) =>
          console.warn("Erro ao atualizar último acesso:", erro)
        );

      res.json({
        idUsuario: usuario.idUsuario,
        email: usuario.email,
        nome: usuario.nome,
        idEmpresa: usuario.Empresa_idEmpresa,
        nomeEmpresa: usuario.nomeEmpresa,
        cnpj: usuario.cnpj,
        descricaoAcesso: usuario.descricaoAcesso,
        usuario_pertence_a_empresa_ativa:
          usuario.usuario_pertence_a_empresa_ativa,
      });
    })
    .catch(function (erro) {
      console.error("Erro ao autenticar:", erro);
      res.status(500).json({ erro: "Erro interno ao realizar login" });
    });
}

function cadastrar(req, res) {
  var nome = req.body.nomeServer;
  var email = req.body.emailServer;
  var senha = req.body.senhaServer;

  if (!nome || !email || !senha) {
    res.status(400).send("Campos obrigatórios faltando!");
    return;
  }

  usuarioModel
    .cadastrar(nome, email, senha)
    .then(function (resultado) {
      console.log("✅ Cadastro realizado com sucesso!");
      res.json(resultado);
    })
    .catch(function (erro) {
      console.error("ERRO NO CADASTRO:", erro);

      if (erro.code === "ER_DUP_ENTRY") {
        res.status(500).send("Erro interno ao realizar cadastro");
      }
    });
}

function obterDados(req, res) {
  const idUsuario = req.params.idUsuario;

  console.log("Buscando dados do usuário:", idUsuario);

  if (!idUsuario) {
    res.status(400).send("ID do usuário está undefined!");
    return;
  }

  usuarioModel
    .obterDadosUsuario(idUsuario)
    .then(function (resultado) {
      if (resultado.length === 0) {
        res.status(404).json({ erro: "Usuário não encontrado" });
        return;
      }

      console.log("✅ Dados do usuário obtidos com sucesso!");
      res.json(resultado[0]);
    })
    .catch(function (erro) {
      console.error("Erro ao obter dados:", erro);
      res.status(500).json({ erro: "Erro ao buscar dados do usuário" });
    });
}

function atualizarPerfil(req, res) {
  const idUsuario = req.body.idUsuarioServer;
  const nome = req.body.nomeServer;
  const telefone = req.body.telefoneServer;

  console.log("📝 Atualizando perfil do usuário:", idUsuario);

  if (!idUsuario || !nome) {
    res.status(400).send("Campos obrigatórios faltando!");
    return;
  }

  usuarioModel
    .atualizarPerfil(idUsuario, nome, telefone)
    .then(function (resultado) {
      console.log("✅ Perfil atualizado com sucesso!");
      res.json({ mensagem: "Perfil atualizado com sucesso!", resultado });
    })
    .catch(function (erro) {
      console.error("Erro ao atualizar perfil:", erro);
      res.status(500).json({ erro: "Erro ao atualizar perfil" });
    });
}

function alterarSenha(req, res) {
  const idUsuario = req.body.idUsuarioServer;
  const senhaAtual = req.body.senhaAtualServer;
  const novaSenha = req.body.novaSenhaServer;

  console.log("Alterando senha do usuário:", idUsuario);

  if (!idUsuario || !senhaAtual || !novaSenha) {
    res.status(400).send("Campos obrigatórios faltando!");
    return;
  }

  if (novaSenha.length < 8) {
    res.status(400).send("A nova senha deve ter no mínimo 8 caracteres!");
    return;
  }

  usuarioModel
    .alterarSenha(idUsuario, senhaAtual, novaSenha)
    .then(function (resultado) {
      if (resultado.affectedRows === 0) {
        console.log("Senha atual incorreta");
        res.status(403).json({ erro: "Senha atual incorreta!" });
        return;
      }

      console.log("✅ Senha alterada com sucesso!");
      res.json({ mensagem: "Senha alterada com sucesso!" });
    })
    .catch(function (erro) {
      console.error("Erro ao alterar senha:", erro);
      res.status(500).json({ erro: "Erro ao alterar senha" });
    });
}

function atualizarPreferencias(req, res) {
  const idUsuario = req.body.idUsuarioServer;
  const receberNotificacao = req.body.receberNotificacaoServer;

  console.log("Atualizando preferências do usuário:", idUsuario);

  if (!idUsuario) {
    res.status(400).send("ID do usuário está undefined!");
    return;
  }

  usuarioModel
    .atualizarPreferencias(idUsuario, receberNotificacao)
    .then(function (resultado) {
      console.log("Preferências atualizadas!");
      res.json({ mensagem: "Preferências salvas com sucesso!" });
    })
    .catch(function (erro) {
      console.error("Erro ao atualizar preferências:", erro);
      res.status(500).json({ erro: "Erro ao salvar preferências" });
    });
}

module.exports = {
  autenticar,
  cadastrar,
  obterDados,
  atualizarPerfil,
  alterarSenha,
  atualizarPreferencias
};