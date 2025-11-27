var adminModel = require("../models/adminModel");

function adminAutenticar(req, res) {
  const email = req.body. emailServer;
  const token = req.body. senhaServer;

  console.log("Tentativa de login:", email);

  if (!email) {
    res.status(400). json({ erro: "Email está undefined!" });
    return;
  } else if (!token) {
    res. status(400).json({ erro: "Senha está undefined!" });
    return;
  }

  adminModel
    .adminAutenticar(email, token)
    .then(function (resultadoAutenticar) {
      console.log(`📊 Resultados encontrados: ${resultadoAutenticar.length}`);

      if (resultadoAutenticar. length === 0) {
        console.log("Credenciais inválidas");
        res.status(403).json({ erro: "Email e/ou senha inválido(s)" });
        return;
      }

      const admin = resultadoAutenticar[0];
      console.log("✅ Autenticação bem-sucedida!");

      res.json({
        idAdmin: admin.idAdmin,
        email: admin.email,
        dtAdmissao: admin. dtAdmissao,
      });
    })
    .catch(function (erro) {
      console.error("ERRO COMPLETO:", erro);
      res.status(500).json({
        erro: "Erro interno ao realizar login",
        detalhes: erro. message,
      });
    });
}

function cadastrarEmpresa(req, res) {
  const cnpj = req. body.cnpjServer;
  const nome = req.body. nomeServer;
  const email = req.body. emailServer;

  if (!cnpj || !nome || !email) {
    res.status(400). send("Campos obrigatórios faltando!");
    return;
  }

  if (cnpj.length !== 14 || isNaN(cnpj)) {
    res.status(400).send("CNPJ inválido!");
    return;
  }

  adminModel
    .cadastrarEmpresa(cnpj, nome, email)
    .then(function (resultado) {
      console.log("Empresa cadastrada:", resultado. insertId);
      
      adminModel.registrarLogAtividade('CADASTRO', `Nova empresa: ${nome}`, null, null, null);
      
      res. status(201).json(resultado);
    })
    .catch(function (erro) {
      console.error("Erro ao cadastrar empresa:", erro);
      if (erro.code === "ER_DUP_ENTRY") {
        res. status(409).send("CNPJ já cadastrado!");
      } else {
        res.status(500). json(erro. sqlMessage || erro. message);
      }
    });
}

function cadastrarUsuarioAdmin(req, res) {
  const email = req. body.emailServer;
  const senha = req.body.senhaServer;

  if (!email || ! senha) {
    res.status(400).send("Campos obrigatórios faltando!");
    return;
  }

  if (senha.length < 4) {
    res.status(400). send("A senha deve ter no mínimo 4 caracteres!");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res. status(400).send("Email inválido!");
    return;
  }

  adminModel
    . cadastrarUsuarioAdmin(email, senha)
    .then(function (resultado) {
      console.log("Admin cadastrado:", resultado. insertId);
      res.status(201). json(resultado);
    })
    . catch(function (erro) {
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
          acessos30Dias: 0
        });
      }
    })
    .catch(function (erro) {
      console.error("Erro ao buscar métricas:", erro);
      res.status(500).json({ erro: erro.sqlMessage || erro.message });
    });
}

function buscarCrescimentoUsuarios(req, res) {
  Promise.all([
    adminModel.buscarCrescimentoUsuarios(),
    adminModel.buscarComparativoUsuarios()
  ])
    .then(function ([crescimento, comparativo]) {
      let acumulado = 0;
      const dadosComAcumulado = crescimento.map(item => {
        acumulado += item.novosUsuarios;
        return {
          ... item,
          acumulado: acumulado
        };
      });

      res.status(200). json({
        crescimento: dadosComAcumulado,
        comparativo: comparativo[0] || { usuariosMesAtual: 0, usuariosMesAnterior: 0 }
      });
    })
    . catch(function (erro) {
      console.error("Erro ao buscar crescimento:", erro);
      res.status(500). json({ erro: erro.sqlMessage || erro.message });
    });
}

function buscarTop5Empresas(req, res) {
  adminModel
    .buscarTop5Empresas()
    . then(function (resultado) {
      res.status(200). json(resultado);
    })
    . catch(function (erro) {
      console.error("Erro ao buscar top empresas:", erro);
      res.status(500).json({ erro: erro.sqlMessage || erro.message });
    });
}

function buscarAtividadesRecentes(req, res) {
  const limite = req.query.limite || 10;
  
  adminModel
    .buscarAtividadesRecentes(limite)
    . then(function (resultado) {
      const atividadesFormatadas = resultado. map(atividade => {
        let tempoTexto = '';
        const minutos = atividade.minutosAtras;
        
        if (minutos === null || minutos < 0) {
          tempoTexto = 'Agora';
        } else if (minutos < 60) {
          tempoTexto = `Há ${minutos} minuto${minutos !== 1 ? 's' : ''}`;
        } else if (minutos < 1440) {
          const horas = Math.floor(minutos / 60);
          tempoTexto = `Há ${horas} hora${horas !== 1 ?  's' : ''}`;
        } else {
          const dias = Math.floor(minutos / 1440);
          tempoTexto = `Há ${dias} dia${dias !== 1 ? 's' : ''}`;
        }

        return {
          ...atividade,
          tempoRelativo: tempoTexto
        };
      });

      res.status(200). json(atividadesFormatadas);
    })
    .catch(function (erro) {
      console. error("Erro ao buscar atividades:", erro);
      res.status(500). json({ erro: erro.sqlMessage || erro.message });
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
          totalAtivos: dados.totalUsuarios + dados.totalEmpresasAtivas
        });
      } else {
        res.status(200). json({
          totalUsuarios: 0,
          totalEmpresas: 0,
          empresasAtivas: 0,
          totalAtivos: 0
        });
      }
    })
    .catch(function (erro) {
      console.error("Erro ao buscar total usuários:", erro);
      res.status(500).json({ erro: erro.sqlMessage || erro.message });
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
  buscarTotalUsuarios
};