var mysql = require("mysql2");

var mySqlConfig = {
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_DATABASE || "sixtech",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "senha",
    port: process.env.DB_PORT || 3306
};

function executar(instrucaoSql, parametros = []) {
    return new Promise(function (resolve, reject) {
        var conexao = mysql.createConnection(mySqlConfig);

        conexao.connect(function (erro) {
            if (erro) {
                console.error("❌ Erro ao conectar ao MySQL:", erro);
                reject(erro);
                return;
            }
            console.log("✅ Conexão MySQL estabelecida");
        });

        const isProcedure = instrucaoSql.trim().toUpperCase().startsWith('CALL');

        conexao.query(instrucaoSql, parametros, function (erro, resultados) {
            conexao.end();

            if (erro) {
                console.error("❌ Erro ao executar query:", erro);
                console.error("SQL:", instrucaoSql);
                reject(erro);
                return;
            }

            if (!resultados) {
                console.warn("⚠️ Query não retornou resultados");
                resolve([]);
                return;
            }

            if (isProcedure) {
                if (Array.isArray(resultados) && resultados.length > 0 && resultados[0]) {
                    console.log("✅ PROCEDURE executada com sucesso");
                    resolve(resultados[0]);
                } else {
                    console.warn("⚠️ PROCEDURE não retornou dados");
                    resolve([]);
                }
            } else {
                console.log("✅ Query executada com sucesso");
                resolve(resultados);
            }
        });
    });
}

module.exports = {
    executar
};