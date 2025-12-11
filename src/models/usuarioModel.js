var database = require("../database/config");

function autenticar(email, senha) {
  console.log("ACESSEI O USUARIO MODEL - function autenticar():", email);

  var instrucaoSql = `CALL getLoginUsuario(?, ?)`;

  console.log("Executando SQL:\n", instrucaoSql);
  return database.executar(instrucaoSql, [email, senha]);
}

function atualizarUltimoAcesso(idUsuario) {
  console.log(
    "ACESSEI O USUARIO MODEL - function atualizarUltimoAcesso():",
    idUsuario
  );

  var instrucaoSql = `
    UPDATE tblUsuario 
    SET dtUltimoAcesso = NOW()
    WHERE idUsuario = ${idUsuario};
  `;

  return database.executar(instrucaoSql);
}

function atualizarPerfil(idUsuario, nome, telefone) {
  console.log(
    "ACESSEI O USUARIO MODEL - function atualizarPerfil():",
    idUsuario
  );

  var instrucaoSql = `
    UPDATE tblUsuario 
    SET nome = '${nome}',
        telefone = '${telefone}'
    WHERE idUsuario = ${idUsuario};
  `;

  console.log("Executando SQL:\n", instrucaoSql);
  return database.executar(instrucaoSql);
}

function alterarSenha(idUsuario, senhaAtual, novaSenha) {
  console.log("ACESSEI O USUARIO MODEL - function alterarSenha():", idUsuario);

  var instrucaoSql = `CALL updateSenhaUsuario(?, ?, ?);`;

  console.log("Executando SQL:\n", instrucaoSql);
  return database.executar(instrucaoSql, [novaSenha, idUsuario, senhaAtual]);
}

function atualizarPreferencias(idUsuario, receberNotificacao) {
  console.log(
    "ACESSEI O USUARIO MODEL - function atualizarPreferencias():",
    idUsuario
  );

  var instrucaoSql = `
    UPDATE tblUsuario 
    SET receberNotificacao = ${receberNotificacao ? 1 : 0}
    WHERE idUsuario = ${idUsuario};
  `;

  console.log("Executando SQL:\n", instrucaoSql);
  return database.executar(instrucaoSql);
}

function obterDadosUsuario(idUsuario) {
  console.log(
    "ACESSEI O USUARIO MODEL - function obterDadosUsuario():",
    idUsuario
  );

  var instrucaoSql = `
    SELECT
      u.idUsuario,
      u.nome,
      u.email,
      u.telefone,
      u.dtCriacao,
      u.Empresa_idEmpresa,
      e.nomeFantasia,
      e.emailCoorporativa,
      e.cnpj
    FROM tblUsuario u
    INNER JOIN tblEmpresa e ON u.Empresa_idEmpresa = e.idEmpresa
    WHERE u.idUsuario = ${idUsuario};
  `;

  console.log("Executando SQL:\n", instrucaoSql);
  return database.executar(instrucaoSql);
}

function verificarSeEhMaster(idUsuario, idEmpresa) {
  console.log(" verificarSeEhMaster():", { idUsuario, idEmpresa });

  var instrucaoSql = `
    SELECT 
      CASE 
        WHEN idUsuario = (
          SELECT idUsuario 
          FROM tblUsuario 
          WHERE Empresa_idEmpresa = ?  
          ORDER BY idUsuario ASC 
          LIMIT 1
        ) THEN 1
        ELSE 0
      END AS ehMaster
    FROM tblUsuario
    WHERE idUsuario = ?  AND Empresa_idEmpresa = ?;
  `;

  return database.executar(instrucaoSql, [idEmpresa, idUsuario, idEmpresa]);
}

function obterSlack(idEmpresa) {
  console.log(" ACESSEI O USUARIO MODEL - function obterSlack():", idEmpresa);

  var instrucaoSql = `
    SELECT 
      e.fkEquipeSlack,
      s.idEquipeSlack,
      s.nome as nomeEquipeSlack,
      s.receberNotificacao,
      s.maiorPopulacao,
      s.aumentoSelic,
      s.crescimentoPib,
      s.alertaError,
      s.alertaWarning,
      s.alertaInfo
    FROM tblEmpresa e
    LEFT JOIN tblEquipeSlack s ON e.fkEquipeSlack = s.idEquipeSlack
    WHERE e.idEmpresa = ?;
  `;

  return database.executar(instrucaoSql, [idEmpresa]);
}
function verificarUsuarioMaster(idUsuario, idEmpresa) {
  console.log("ACESSEI O USUARIO MODEL - function verificarUsuarioMaster()");

  var instrucaoSql = `
    SELECT idUsuario 
    FROM tblUsuario 
    WHERE Empresa_idEmpresa = ? 
    ORDER BY idUsuario ASC 
    LIMIT 1;
  `;

  return database.executar(instrucaoSql, [idEmpresa]);
}

function criarSlack(
  idEmpresa,
  nomeEmpresa, 
  maiorPopulacao,
  aumentoSelic,
  crescimentoPib,
  alertaError,
  alertaWarning,
  alertaInfo
) {
  console.log("📝 criarSlack() chamado com:", {
    idEmpresa,
    nomeEmpresa,
    maiorPopulacao,
    aumentoSelic,
    crescimentoPib,
    alertaError,
    alertaWarning,
    alertaInfo,
  });

  var instrucaoSql = `
    INSERT INTO tblEquipeSlack (
      nome,
      receberNotificacao,
      maiorPopulacao, 
      aumentoSelic, 
      crescimentoPib, 
      alertaError, 
      alertaWarning, 
      alertaInfo
    )
    VALUES (?, 1, ?, ?, ?, ?, ?, ? );
  `;

  console.log("SQL INSERT tblEquipeSlack:", instrucaoSql);

  return database
    .executar(instrucaoSql, [
      nomeEmpresa || 'Equipe Slack',
      maiorPopulacao || 0,
      aumentoSelic || 0,
      crescimentoPib || 0,
      alertaError || 0,
      alertaWarning || 0,
      alertaInfo || 0,
    ])
    .then((resultado) => {
      console.log(" INSERT tblEquipeSlack executado!");
      console.log(" insertId:", resultado.insertId);

      const idEquipeSlack = resultado.insertId;

      if (! idEquipeSlack) {
        throw new Error("insertId não foi retornado!");
      }

      const updateSql = `
        UPDATE tblEmpresa 
        SET fkEquipeSlack = ? 
        WHERE idEmpresa = ?;
      `;

      console.log(" SQL UPDATE tblEmpresa:", updateSql);

      return database.executar(updateSql, [idEquipeSlack, idEmpresa]).then((resultadoUpdate) => {
        console.log(" UPDATE tblEmpresa executado!");
        console.log(" Linhas afetadas:", resultadoUpdate.affectedRows);

        if (resultadoUpdate.affectedRows === 0) {
          console.warn(" Nenhuma linha foi atualizada no UPDATE!");
        }

        return {
          insertId: idEquipeSlack,
          affectedRows: resultado.affectedRows,
          updateAffectedRows: resultadoUpdate.affectedRows,
        };
      });
    })
    .catch((erro) => {
      console.error(" Erro em criarSlack:", erro);
      throw erro;
    });
}

function atualizarSlack(
  idEquipeSlack,
  maiorPopulacao,
  aumentoSelic,
  crescimentoPib,
  alertaError,
  alertaWarning,
  alertaInfo
) {
  console.log("atualizarSlack() chamado com:", {
    idEquipeSlack,
    maiorPopulacao,
    aumentoSelic,
    crescimentoPib,
    alertaError,
    alertaWarning,
    alertaInfo,
  });

  var instrucaoSql = `
    UPDATE tblEquipeSlack
    SET maiorPopulacao = ?,
        aumentoSelic = ?,
        crescimentoPib = ?,
        alertaError = ?,
        alertaWarning = ?,
        alertaInfo = ?
    WHERE idEquipeSlack = ?;
  `;

  return database.executar(instrucaoSql, [
    maiorPopulacao || 0,
    aumentoSelic || 0,
    crescimentoPib || 0,
    alertaError || 0,
    alertaWarning || 0,
    alertaInfo || 0,
    idEquipeSlack,
  ]);
}

function desativarSlack(idEmpresa) {
  console.log("desativarSlack() chamado para empresa:", idEmpresa);

  var buscarSql = `
    SELECT fkEquipeSlack 
    FROM tblEmpresa 
    WHERE idEmpresa = ?;
  `;

  return database.executar(buscarSql, [idEmpresa]).then((resultado) => {
    if (resultado.length === 0 || ! resultado[0].fkEquipeSlack) {
      console.log("Empresa sem equipe Slack vinculada");
      return { affectedRows: 0 };
    }

    const idEquipeSlack = resultado[0].fkEquipeSlack;


    var updateSql = `
      UPDATE tblEquipeSlack
      SET receberNotificacao = 0
      WHERE idEquipeSlack = ?;
    `;

    return database.executar(updateSql, [idEquipeSlack]);
  });
}

function ativarSlack(idEmpresa) {
  console.log("ativarSlack() chamado para empresa:", idEmpresa);

  var buscarSql = `
    SELECT fkEquipeSlack 
    FROM tblEmpresa 
    WHERE idEmpresa = ?;
  `;

  return database.executar(buscarSql, [idEmpresa]).then((resultado) => {
    if (resultado.length === 0 || !resultado[0].fkEquipeSlack) {
      throw new Error("Empresa sem equipe Slack vinculada");
    }

    const idEquipeSlack = resultado[0].fkEquipeSlack;

    var updateSql = `
      UPDATE tblEquipeSlack
      SET receberNotificacao = 1
      WHERE idEquipeSlack = ?;
    `;

    return database.executar(updateSql, [idEquipeSlack]);
  });
}

module.exports = {
  autenticar,
  atualizarUltimoAcesso,
  atualizarPerfil,
  alterarSenha,
  atualizarPreferencias,
  obterDadosUsuario,
  obterSlack,
  verificarUsuarioMaster,
  criarSlack,
  atualizarSlack,
  desativarSlack,
  ativarSlack,
  verificarSeEhMaster,
};