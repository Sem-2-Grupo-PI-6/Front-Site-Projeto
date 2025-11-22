var adminModel = require("../models/adminModel");

function adminAutenticar(req, res) {
  const email = req.body.emailServer;
  const token = req.body.senhaServer;

  console.log("📧 Tentativa de login:", email);

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
      console.log(`📊 Resultados encontrados: ${resultadoAutenticar.length}`);

      if (resultadoAutenticar.length === 0) {
        console.log("❌ Credenciais inválidas");
        res.status(403).json({ erro: "Email e/ou senha inválido(s)" });
        return;
      }

      const admin = resultadoAutenticar[0];

      console.log("✅ Autenticação bem-sucedida!");

      res.json({
        idAdmin: admin.idAdmin,
        email: admin.email,
        dtAdmissao: admin.dtAdmissao,
      });
    })
    .catch(function (erro) {
      console.error("❌ ERRO COMPLETO:", erro);
      console.error("❌ Stack trace:", erro.stack);

      res.status(500).json({
        erro: "Erro interno ao realizar login",
        detalhes: erro.message,
      });
    });
}

module.exports = {
  adminAutenticar,
};
