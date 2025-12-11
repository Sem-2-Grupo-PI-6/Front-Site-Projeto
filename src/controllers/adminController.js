var adminModel = require("../models/adminModel");

function adminAutenticar(req, res) {
  const email = req.body.emailServer;
  const token = req.body.senhaServer;

  console.log("Tentativa de login:", email);

  if (!email) {
    res.status(400).json({ erro: "Email está undefined!" });
    return;
  } else if (!token) {
    res.status(400).json({ erro: "Senha está undefined!" });
    return;
  }

  adminModel
    .adminAutenticar(email, token)
    .then(function (resultadoAutenticar) {
      console.log(`Resultados encontrados: ${resultadoAutenticar.length}`);

      if (resultadoAutenticar.length === 0) {
        console.log("Credenciais inválidas");
        res.status(403).json({ erro: "Email e/ou senha inválido(s)" });
        return;
      }

      const admin = resultadoAutenticar[0];
      console.log("Autenticação bem-sucedida!");
      console.log("Dados retornados:", admin);

      res.json({
        idAdmin: admin.idAdmin,
        nome: admin.nome,
        email: admin.email,
        dtAdmissao: admin.dtAdmissao,
      });
    })
    .catch(function (erro) {
      console.error("ERRO COMPLETO:", erro);
      res.status(500).json({
        erro: "Erro interno ao realizar login",
        detalhes: erro.message,
      });
    });
}
function cadastrarEmpresa(req, res) {
  const cnpj = req.body.cnpjServer;
  const nome = req.body.nomeServer;
  const email = req.body.emailServer;

  if (!cnpj || !nome || !email) {
    res.status(400).send("Campos obrigatórios faltando!");
    return;
  }

  if (cnpj.length !== 14 || isNaN(cnpj)) {
    res.status(400).send("CNPJ inválido!");
    return;
  }

  adminModel
    .cadastrarEmpresa(cnpj, nome, email)
    .then(function (resultado) {
      console.log("Empresa cadastrada:", resultado.insertId);

      adminModel.registrarLogAtividade(
        "CADASTRO",
        `Nova empresa: ${nome}`,
        null,
        null,
        null
      );

      res.status(201).json(resultado);
    })
    .catch(function (erro) {
      console.error("Erro ao cadastrar empresa:", erro);
      if (erro.code === "ER_DUP_ENTRY") {
        res.status(409).send("CNPJ já cadastrado!");
      } else {
        res.status(500).json(erro.sqlMessage || erro.message);
      }
    });
}

function cadastrarUsuarioAdmin(req, res) {
  const nome = req.body.nomeServer;
  const email = req.body.emailServer;
  const senha = req.body.senhaServer;

  if (!nome || !email || !senha) {
    res.status(400).send("Campos obrigatórios faltando!");
    return;
  }

  if (senha.length < 8) {
    res.status(400).send("A senha deve ter no mínimo 8 caracteres!");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).send("Email inválido!");
    return;
  }

  adminModel
    .cadastrarUsuarioAdmin(nome, email, senha)
    .then(function (resultado) {
      console.log("Admin cadastrado:", resultado.insertId);
      res.status(201).json(resultado);
    })
    .catch(function (erro) {
      console.error("Erro ao cadastrar admin:", erro);
      if (erro.code === "ER_DUP_ENTRY") {
        res.status(409).send("Email já cadastrado!");
      } else {
        res.status(500).json(erro.sqlMessage || erro.message);
      }
    });
}

function buscarMetricasDashboard(req, res) {
  adminModel
    .buscarMetricasDashboard()
    .then(function (resultado) {
      if (resultado.length > 0) {
        res.status(200).json(resultado[0]);
      } else {
        res.status(200).json({
          totalUsuarios: 0,
          empresasAtivas: 0,
          totalEmpresas: 0,
          novosUsuariosMes: 0,
          acessos30Dias: 0,
        });
      }
    })
    .catch(function (erro) {
      console.error("Erro ao buscar métricas:", erro);
      res.status(500).json({ erro: erro.sqlMessage || erro.message });
    });
}

function buscarCrescimentoUsuarios(req, res) {
  adminModel
    .buscarCrescimentoUsuarios()
    .then(function (crescimento) {
      let acumulado = 0;
      const dadosComAcumulado = crescimento.map((item, index) => {
        acumulado += item.novosUsuarios;
        let variacaoPercentual = 0;
        if (index > 0) {
          const mesAnterior = crescimento[index - 1].novosUsuarios;
          if (mesAnterior > 0) {
            variacaoPercentual = ((item.novosUsuarios - mesAnterior) / mesAnterior) * 100;
          }
        }
        return {
          ...item,
          acumulado:  acumulado,
          variacaoPercentual: variacaoPercentual.toFixed(1)
        };
      });
      const ultimoMes = dadosComAcumulado[dadosComAcumulado.length - 1];
      const penultimoMes = dadosComAcumulado[dadosComAcumulado.length - 2];
      const comparativo = {
        usuariosMesAtual: ultimoMes?.novosUsuarios || 0,
        usuariosMesAnterior: penultimoMes?.novosUsuarios || 0,
        variacao: ultimoMes?.variacaoPercentual || 0,
        cresceu: ultimoMes && penultimoMes ? ultimoMes.novosUsuarios > penultimoMes.novosUsuarios :  false
      };

      res.status(200).json({
        crescimento: dadosComAcumulado,
        comparativo: comparativo,
      });
    })
    .catch(function (erro) {
      console.error("Erro ao buscar crescimento:", erro);
      res.status(500).json({ erro: erro.sqlMessage || erro.message });
    });
}

function buscarTop5Empresas(req, res) {
  adminModel
    .buscarTop5Empresas()
    .then(function (resultado) {
      res.status(200).json(resultado);
    })
    .catch(function (erro) {
      console.error("Erro ao buscar top empresas:", erro);
      res.status(500).json({ erro: erro.sqlMessage || erro.message });
    });
}

function buscarAtividadesRecentes(req, res) {
  const limite = req.query.limite || 10;

  adminModel
    .buscarAtividadesRecentes(limite)
    .then(function (resultado) {
      const atividadesFormatadas = resultado.map((atividade) => {
        let tempoTexto = "";
        const minutos = atividade.minutosAtras;

        if (minutos === null || minutos < 0) {
          tempoTexto = "Agora";
        } else if (minutos < 60) {
          tempoTexto = `Há ${minutos} minuto${minutos !== 1 ? "s" : ""}`;
        } else if (minutos < 1440) {
          const horas = Math.floor(minutos / 60);
          tempoTexto = `Há ${horas} hora${horas !== 1 ? "s" : ""}`;
        } else {
          const dias = Math.floor(minutos / 1440);
          tempoTexto = `Há ${dias} dia${dias !== 1 ? "s" : ""}`;
        }

        return {
          ...atividade,
          tempoRelativo: tempoTexto,
        };
      });

      res.status(200).json(atividadesFormatadas);
    })
    .catch(function (erro) {
      console.error("Erro ao buscar atividades:", erro);
      res.status(500).json({ erro: erro.sqlMessage || erro.message });
    });
}

function buscarTotalUsuarios(req, res) {
  adminModel  
    .buscarTotalUsuariosAtivos()
    .then(function (resultado) {
      if (resultado.length > 0) {
        const dados = resultado[0];
        res.status(200).json({
          totalUsuarios: dados.totalUsuarios,
          totalEmpresas: dados.totalEmpresas,
          empresasAtivas: dados.totalEmpresasAtivas,
          totalAtivos: dados.totalUsuarios + dados.totalEmpresasAtivas,
        });
      } else {
        res.status(200).json({
          totalUsuarios: 0,
          totalEmpresas: 0,
          empresasAtivas: 0,
          totalAtivos: 0,
        });
      }
    })
    .catch(function (erro) {
      console.error("Erro ao buscar total usuários:", erro);
      res.status(500).json({ erro: erro.sqlMessage || erro.message });
    });
}

function listarUsuariosEmpresas(req, res) {
  adminModel
    .listarUsuariosEmpresas()
    .then((resultado) => {
      res.status(200).json(resultado);
    })
    .catch((erro) => {
      console.error("Erro ao listar usuários/empresas:", erro);
      res.status(500).json({ erro: erro.message || erro.sqlMessage });
    });
}

function editarUsuario(req, res) {
  const idAdmin = req.params.id;
  const nome = req.body.nomeServer;
  const novaSenha = req.body.novaSenhaServer;

  console.log("✏️ Atualizando admin - ID:", idAdmin);

  if (!nome) {
    res.status(400).json({ erro: "Nome está undefined!" });
    return;
  }

  adminModel
    .editarUsuario(novaSenha, nome, idAdmin)
    .then(function (resultadoAtualizar) {
      if (resultadoAtualizar.affectedRows === 0) {
        console.log(" Nenhum registro atualizado");
        res.status(404).json({ erro: "Admin não encontrado" });
        return;
      }

      console.log("✅ Admin atualizado com sucesso!");
      res.json({ mensagem: "Perfil atualizado com sucesso" });
    })
    .catch(function (erro) {
      console.error(" ERRO COMPLETO:", erro);
      res.status(500).json({ erro: "Erro interno do servidor" });
    });
}

function excluirUsuario(req, res) {
  const idUsuario = req.params.id;

  adminModel
    .excluirUsuario(idUsuario)
    .then((resultado) => {
      console.log("Usuário excluído:", idUsuario);

      adminModel.registrarLogAtividade(
        "EXCLUSAO",
        `Usuário ID ${idUsuario} excluído`,
        null,
        null,
        null
      );

      res.status(200).json({ mensagem: "Usuário excluído com sucesso!" });
    })
    .catch((erro) => {
      console.error("Erro ao excluir usuário:", erro);
      if (erro.code === "ER_ROW_IS_REFERENCED_2") {
        res
          .status(409)
          .send("Não é possível excluir: usuário possui registros vinculados!");
      } else {
        res.status(500).json({ erro: erro.sqlMessage || erro.message });
      }
    });
}

function buscarUsuarioPorId(req, res) {
  const idUsuario = req.params.id;

  adminModel
    .buscarUsuarioPorId(idUsuario)
    .then((resultado) => {
      if (resultado.length > 0) {
        res.status(200).json(resultado[0]);
      } else {
        res.status(404).json({ erro: "Usuário não encontrado" });
      }
    })
    .catch((erro) => {
      console.error("Erro ao buscar usuário:", erro);
      res.status(500).json({ erro: erro.sqlMessage || erro.message });
    });
}

function listarEmpresas(req, res) {
  adminModel
    .listarEmpresas()
    .then((resultado) => {
      res.status(200).json(resultado);
    })
    .catch((erro) => {
      console.error("Erro ao listar empresas:", erro);
      res.status(500).json({ erro: erro.sqlMessage || erro.message });
    });
}

function listarUsuariosEmpresasPaginado(req, res) {
  const pagina = parseInt(req.query.pagina) || 1;
  const limite = parseInt(req.query.limite) || 20;
  const offset = (pagina - 1) * limite;

  Promise.all([
    adminModel.listarUsuariosEmpresasPaginado(limite, offset),
    adminModel.contarTotalUsuarios(),
  ])
    .then(([usuarios, total]) => {
      const totalUsuarios = total[0].total;
      const totalPaginas = Math.ceil(totalUsuarios / limite);

      res.status(200).json({
        usuarios: usuarios,
        paginacao: {
          paginaAtual: pagina,
          totalPaginas: totalPaginas,
          totalUsuarios: totalUsuarios,
          usuariosPorPagina: limite,
          temProxima: pagina < totalPaginas,
          temAnterior: pagina > 1,
        },
      });
    })
    .catch((erro) => {
      console.error("Erro ao listar usuários paginados:", erro);
      res.status(500).json({ erro: erro.message || erro.sqlMessage });
    });
}

function listarEmpresasPaginado(req, res){
  const pagina = parseInt(req.query.pagina) || 1;
  const limite = parseInt(req.query.limite) || 20;
  const offset = (pagina - 1) * limite;

  Promise.all([
    adminModel.listarEmpresasPaginado(limite, offset),
    adminModel.contarTotalEmpresas(),
  ])
    .then(([empresas, total]) => {
      const totalEmpresas = total[0].total;
      const totalPaginas = Math.ceil(totalEmpresas / limite);

      res.status(200).json({
        empresas: empresas,
        paginacao: {
          paginaAtual: pagina,
          totalPaginas: totalPaginas,
          totalEmpresas: totalEmpresas,
          empresasPorPagina: limite,
          temProxima: pagina < totalPaginas,
          temAnterior: pagina > 1,
        },
      });
    })
    .catch((erro) => {
      console.error("Erro ao listar empresas paginado:", erro);
      res.status(500).json({erro: erro.message || erro.sqlMessage});
    });
}

function buscarEmpresaPorId(req, res){
  const idEmpresa = req.params.id;

  adminModel
    .buscarEmpresaPorId(idEmpresa)
    .then((resultado) => {
      if(resultado.length > 0){
        res.status(200).json(resultado[0]);
      }else{
        res.status(404).json({erro: "Empresa não encontrada"});
      }
    })
    .catch((erro) => {
      console.error("Erro ao buscar empresa:", erro);
      res.status(500).json({erro: erro.sqlMessage || erro.message});
    });
}

function atualizarEmpresa(req, res) {
  const idEmpresa = req.params.id;
  const dados = {
    nomeFantasia: req.body.nomeServer,
    emailCoorporativa: req.body.emailServer,
    cnpj: req.body.cnpjServer,
    situacaoLicensa: req.body.licensaServer,
    senha: req.body.senhaServer,
  };

  adminModel
    .atualizarEmpresa(idEmpresa, dados)
    .then((resultado) => {
      if(resultado.affectedRows === 0){
        return res.status(404).json({erro: "Empresa não encontrada"});
      }
      res.status(200).json({mensagem: "Empresa atualizada com sucesso"});
    })
    .catch((erro) => {
      console.error("Erro ao atualizar empresa:", erro);
      res.status(500).json({erro: erro.sqlMessage || erro.message});
    });
}
function excluirEmpresa(req, res){
  const idEmpresa = req.params.id;

  adminModel
    .excluirEmpresa(idEmpresa)
    .then((resultado) => {
      console.log("Empresa excluída:", idEmpresa);

      adminModel.registrarLogAtividade(
        "EXCLUSAO",
        `Empresa ID ${idEmpresa} excluída`,
        null,
        null,
        null
      );

      res.status(200).json({mensagem: "Empresa excluída com sucesso"});
    })
    .catch((erro) => {
      console.error("Erro ao excluir empresa:", erro);
      if(erro.code === "ER_ROW_IS_REFERENCED_2") {
        res
          .status(409)
          .send("Não é possível excluir: empresa possui usuários vinculados");
      } else{
        res.status(500).json({erro: erro.sqlMessage || erro.message});
      }
    });
}
module.exports = {
  adminAutenticar,
  cadastrarEmpresa,
  cadastrarUsuarioAdmin,
  buscarMetricasDashboard,
  buscarCrescimentoUsuarios,
  buscarTop5Empresas,
  buscarAtividadesRecentes,
  buscarTotalUsuarios,
  listarUsuariosEmpresas,
  listarUsuariosEmpresasPaginado,
  editarUsuario,
  excluirUsuario,
  buscarUsuarioPorId,
  listarEmpresas,
  listarEmpresasPaginado,
  buscarEmpresaPorId,
  atualizarEmpresa,
  excluirEmpresa,
};