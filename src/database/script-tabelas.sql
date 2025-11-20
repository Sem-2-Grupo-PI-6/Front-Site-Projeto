DROP DATABASE IF EXISTS sixtech;

create database sixtech;
use sixtech;

CREATE TABLE tblSistema (
    idtblSistema INT PRIMARY KEY AUTO_INCREMENT,
    filtroPadrao JSON,
    dtUpdateFiltroSistema TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
);


CREATE TABLE tblAdmin (
    idAdmin INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(45),
    token CHAR(4),
    dtAdmissao DATE,
    tblSistema_idtblSistema INT,
    FOREIGN KEY (tblSistema_idtblSistema) REFERENCES tblSistema(idtblSistema)
);

-- SELECT * FROM tblInflacao;


CREATE TABLE tblEmpresa (
    idEmpresa INT PRIMARY KEY AUTO_INCREMENT,
    cnpj CHAR(14),
    nomeFantasia VARCHAR(45),
    emailCoorportaiva VARCHAR(45),
    dtLicenca DATE,
    sitacaoLicensa ENUM('Ativa', 'Inativa', 'Suspensa', 'Cancelada')
);


CREATE TABLE tblUsuario (
    idUsuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45),
    telefone CHAR(11),
    email VARCHAR(45),
    senha VARCHAR(16),
    dtCriacao DATE,
    filtrosPersonalizados JSON,
    Empresa_idEmpresa INT,
    FOREIGN KEY (Empresa_idEmpresa) REFERENCES tblEmpresa(idEmpresa)
);


CREATE TABLE filtroUsuario (
    idfiltroUsuario INT PRIMARY KEY AUTO_INCREMENT,
    tblUsuario_idUsuario INT,
    tblUsuario_Empresa_idEmpresa INT,
    nomeFiltro VARCHAR(45),
    ativo TINYINT(1),
    config JSON,
    dtCreateFiltro TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP(6),
    dtUpdateFiltro TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    FOREIGN KEY (tblUsuario_idUsuario) REFERENCES tblUsuario(idUsuario),
    FOREIGN KEY (tblUsuario_Empresa_idEmpresa) REFERENCES tblEmpresa(idEmpresa)
);


CREATE TABLE tblLogSistemaAcesso (
    idLogSistema INT PRIMARY KEY AUTO_INCREMENT,
    dtAcontecimento DATE,
    tipoLog VARCHAR(45),
    descricaoLog VARCHAR(45),
    Usuario_idUsuario INT,
    Usuario_Empresa_idEmpresa INT,
    Admin_idAdmin INT,
    tblSistema_idtblSistema INT,
    FOREIGN KEY (Usuario_idUsuario) REFERENCES tblUsuario(idUsuario),
    FOREIGN KEY (Usuario_Empresa_idEmpresa) REFERENCES tblEmpresa(idEmpresa),
    FOREIGN KEY (Admin_idAdmin) REFERENCES tblAdmin(idAdmin),
    FOREIGN KEY (tblSistema_idtblSistema) REFERENCES tblSistema(idtblSistema)
);


CREATE TABLE tblZona (
    idZona INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45)
);


CREATE TABLE tblPopulacao (
    idtblPopulacao INT PRIMARY KEY AUTO_INCREMENT,
    ano VARCHAR(45),
    codigoIbge VARCHAR(45),
    municipio VARCHAR(45),
    qtdpopulacao INT,
    homens INT,
    mulheres INT,
    razaoSexo FLOAT,
    idadeMedia FLOAT,
    densidadeDemo FLOAT,
    tblZona_idZona INT,
    FOREIGN KEY (tblZona_idZona) REFERENCES tblZona(idZona)
);


CREATE TABLE tblPib (
    idPib INT PRIMARY KEY AUTO_INCREMENT,
    trimestre VARCHAR(45),
    ano CHAR(4),
    pibGeral DECIMAL(15,2),
    tblZona_idZona INT,
    FOREIGN KEY (tblZona_idZona) REFERENCES tblZona(idZona)
);


CREATE TABLE tblInflacao (
    idtblInflacao INT PRIMARY KEY AUTO_INCREMENT,
    valorTaxa FLOAT,
    dtApuracao DATE
);


CREATE TABLE tblSelic (
    idtblSelic INT PRIMARY KEY AUTO_INCREMENT,
    valorTaxa FLOAT,
    dtApuracao DATE
);


CREATE TABLE tblPibSetor (
    idtblPibSetor INT PRIMARY KEY AUTO_INCREMENT,
    trimestre VARCHAR(45),
    ano CHAR(4),
    construcaoCivil FLOAT,
    servico FLOAT
);


CREATE TABLE tblPibRegionalSP (
    idtblPibRegionalSP INT PRIMARY KEY AUTO_INCREMENT,
    ano CHAR(4),
    pibSP DECIMAL(5,2)
);

SELECT * FROM tblPibRegionalSP;

CREATE TABLE tblLogArquivos (
    idtblLogArquivos INT PRIMARY KEY AUTO_INCREMENT,
    tipoLog VARCHAR(15),
    dataHoraLeitura DATETIME DEFAULT CURRENT_TIMESTAMP,
    descricao VARCHAR(255),
    tblPibSetor_idtblPibSetor INT,
    tblPibRegionalSP_idtblPibRegionalSP INT,
    tblSelic_idtblSelic INT,
    tblInflacao_idtblInflacao INT,
    tblPopulacao_idtblPopulacao INT,
    tblZona_idZona INT,
    tblPib_idPib INT,
    FOREIGN KEY (tblPibSetor_idtblPibSetor) REFERENCES tblPibSetor(idtblPibSetor),
    FOREIGN KEY (tblPibRegionalSP_idtblPibRegionalSP) REFERENCES tblPibRegionalSP(idtblPibRegionalSP),
    FOREIGN KEY (tblSelic_idtblSelic) REFERENCES tblSelic(idtblSelic),
    FOREIGN KEY (tblInflacao_idtblInflacao) REFERENCES tblInflacao(idtblInflacao),
    FOREIGN KEY (tblPopulacao_idtblPopulacao) REFERENCES tblPopulacao(idtblPopulacao),
    FOREIGN KEY (tblZona_idZona) REFERENCES tblZona(idZona),
    FOREIGN KEY (tblPib_idPib) REFERENCES tblPib(idPib)
);

SELECT * FROM tblLogArquivos;
SELECT * FROM tblPibSetor ORDER BY idtblPibSetor DESC LIMIT 1;

select * FROM tblInflacao;
select * FROM tblSelic;
SELECT * FROM tblPibSetor;
SELECT * FROM tblPibRegionalSP;
SELECT * FROM tblPib;
SELECT municipio FROM tblPopulacao;

SELECT * FROM tblPopulacao ORDER BY idtblPopulacao DESC LIMIT 1;
SELECT count(*) FROM tblPopulacao;
SELECT *FROM tblPopulacao;
CREATE INDEX idx_usuario_email ON tblUsuario(email);
CREATE INDEX idx_usuario_empresa ON tblUsuario(Empresa_idEmpresa);
CREATE INDEX idx_filtro_usuario ON filtroUsuario(tblUsuario_idUsuario);
CREATE INDEX idx_filtro_ativo ON filtroUsuario(ativo);
CREATE INDEX idx_populacao_municipio ON tblPopulacao(municipio);
CREATE INDEX idx_populacao_ano ON tblPopulacao(ano);
CREATE INDEX idx_populacao_zona ON tblPopulacao(tblZona_idZona);
CREATE INDEX idx_empresa_cnpj ON tblEmpresa(cnpj);
CREATE INDEX idx_log_data ON tblLogSistemaAcesso(dtAcontecimento);
CREATE INDEX idx_log_usuario ON tblLogSistemaAcesso(Usuario_idUsuario);
select * FROM tblSelic;
select * FROM tblSelic;
CREATE TABLE tblMetricasSistema (
    idMetrica INT PRIMARY KEY AUTO_INCREMENT,
    totalRequisicoes INT DEFAULT 0,
    requisicoesOK INT DEFAULT 0,
    requisicoesErro INT DEFAULT 0,
    tempoMedioResposta INT DEFAULT 0,
    taxaSucesso DECIMAL(5,2) DEFAULT 100.00,
    taxaErro DECIMAL(5,2) DEFAULT 0.00,
    dtUltimaSync TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    dtResetMetricas TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tblErrosSistema (
    idErro INT PRIMARY KEY AUTO_INCREMENT,
    tipoErro ENUM('ERRO', 'LENTIDAO') NOT NULL,
    endpoint VARCHAR(255),
    mensagem VARCHAR(500),
    tempoResposta INT,
    dtOcorrencia TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_tipo_erro (tipoErro),
    INDEX idx_data_erro (dtOcorrencia)
);

select * from tblUsuario;

  SELECT trimestre, ano, construcaoCivil
    FROM tblPibSetor
    ORDER BY ano DESC, 
      CASE trimestre
        WHEN '4º' THEN 4
        WHEN '3º' THEN 3
        WHEN '2º' THEN 2
        WHEN '1º' THEN 1
      END DESC
    LIMIT 12;
    
     SELECT trimestre, ano, pibGeral
    FROM tblPib
    WHERE tblZona_idZona = 1
    ORDER BY ano DESC, 
      CASE trimestre
        WHEN '4º' THEN 4
        WHEN '3º' THEN 3
        WHEN '2º' THEN 2
        WHEN '1º' THEN 1
      END DESC;
      
          SELECT trimestre, ano, servico
    FROM tblPibSetor
    ORDER BY ano DESC, 
      CASE trimestre
        WHEN '4º' THEN 4
        WHEN '3º' THEN 3
        WHEN '2º' THEN 2
        WHEN '1º' THEN 1
      END DESC
    LIMIT 12;
    
    INSERT INTO tblAdmin (email, token, dtAdmissao, tblSistema_idtblSistema)
VALUES
  ('admin@sixtech.com', 'A1B2', '2024-01-15', 1),
  ('suporte@sixtech.com', 'C3D4', '2024-03-20', 2);

/* 3. tblEmpresa */
INSERT INTO tblEmpresa (cnpj, nomeFantasia, emailCoorportaiva, dtLicenca, sitacaoLicensa)
VALUES
  ('12345678000111', 'Alpha Dados', 'contato@alphadados.com', '2024-02-01', 'Ativa'),
  ('55566677000122', 'Beta Insights', 'suporte@betainsights.com', '2024-05-10', 'Ativa'),
  ('99887766000155', 'Gamma Tech', 'admin@gammatech.com', '2024-06-01', 'Suspensa');

/* 4. tblUsuario */
INSERT INTO tblUsuario (nome, telefone, email, senha, dtCriacao, filtrosPersonalizados, Empresa_idEmpresa)
VALUES
  ('João Silva', '11988887777', 'joao@alphadados.com', 'senha123', '2024-06-10',
     JSON_ARRAY(JSON_OBJECT('nome','População SP','campos',JSON_ARRAY('municipio','qtdpopulacao'))),
     1),
  ('Maria Souza', '11999996666', 'maria@betainsights.com', 'beta2024', '2024-06-12',
     JSON_ARRAY(JSON_OBJECT('nome','PIB Sudeste','periodo','2023')),
     2),
  ('Carlos Lima', '11970001234', 'carlos@gammatech.com', 'gtech#45', '2024-06-15',
     JSON_ARRAY(JSON_OBJECT('nome','Inflacao Últimos 6','intervalo','6m')),
     3);

/* 5. tblZona */
INSERT INTO tblZona (nome)
VALUES ('Norte'), ('Nordeste'), ('Centro-Oeste'), ('Sudeste'), ('Sul');

/* 6. tblPopulacao (exemplo para alguns municípios) */
INSERT INTO tblPopulacao (ano, codigoIbge, municipio, qtdpopulacao, homens, mulheres, razaoSexo, idadeMedia, densidadeDemo, tblZona_idZona)
VALUES
  ('2023', '3550308', 'São Paulo', 11250000, 5200000, 6050000, 5200000/6050000, 32.5, 7500.00, 4),
  ('2023', '3304557', 'Rio de Janeiro', 6700000, 3100000, 3600000, 3100000/3600000, 34.2, 5300.00, 4),
  ('2023', '4205407', 'Florianópolis', 530000, 250000, 280000, 250000/280000, 35.0, 900.00, 5),
  ('2023', '1302603', 'Manaus', 2250000, 1080000, 1170000, 1080000/1170000, 29.8, 190.00, 1),
  ('2023', '2927408', 'Salvador', 2900000, 1330000, 1570000, 1330000/1570000, 30.4, 4100.00, 2),
  ('2022', '3550308', 'São Paulo', 11150000, 5150000, 6000000, 5150000/6000000, 32.3, 7450.00, 4),
  ('2022', '3304557', 'Rio de Janeiro', 6680000, 3090000, 3590000, 3090000/3590000, 34.0, 5280.00, 4),
  ('2022', '4205407', 'Florianópolis', 520000, 245000, 275000, 245000/275000, 34.8, 880.00, 5),
  ('2022', '1302603', 'Manaus', 2235000, 1075000, 1160000, 1075000/1160000, 29.6, 188.00, 1),
  ('2022', '2927408', 'Salvador', 2885000, 1325000, 1560000, 1325000/1560000, 30.2, 4050.00, 2);

/* 7. tblInflacao (IPCA fictício mês a mês 2024) */
INSERT INTO tblInflacao (valorTaxa, dtApuracao)
VALUES
  (0.42, '2024-01-31'),
  (0.83, '2024-02-29'),
  (0.45, '2024-03-31'),
  (0.61, '2024-04-30'),
  (0.23, '2024-05-31'),
  (0.18, '2024-06-30'),
  (0.42, '2024-07-31'),
  (0.25, '2024-08-31'),
  (0.34, '2024-09-30'),
  (0.29, '2024-10-31');

/* 8. tblSelic (taxa anualizada referência – valores fictícios) */
INSERT INTO tblSelic (valorTaxa, dtApuracao)
VALUES
  (11.75, '2024-01-15'),
  (11.50, '2024-02-15'),
  (11.25, '2024-03-15'),
  (10.75, '2024-04-15'),
  (10.50, '2024-05-15'),
  (10.25, '2024-06-15'),
  (10.00, '2024-07-15'),
  (9.75, '2024-08-15'),
  (9.50, '2024-09-15'),
  (9.25, '2024-10-15');

/* 9. tblPib (PIB trimestral por zona – valores fictícios em milhões) */
INSERT INTO tblPib (trimestre, ano, pibGeral, tblZona_idZona)
VALUES
  ('1º', '2023', 850000.00, 4),
  ('2º', '2023', 860500.00, 4),
  ('3º', '2023', 870300.00, 4),
  ('4º', '2023', 880100.00, 4),
  ('1º', '2024', 890500.00, 4),
  ('1º', '2024', 210000.00, 1),
  ('1º', '2024', 340000.00, 2),
  ('1º', '2024', 150000.00, 3),
  ('1º', '2024', 180000.00, 5);

/* 10. tblPibSetor (PIB setorial – valores fictícios) */
INSERT INTO tblPibSetor (trimestre, ano, construcaoCivil, servico)
VALUES
  ('1º', '2023', 12000.50, 450.75),
  ('2º', '2023', 12150.40, 452.60),
  ('3º', '2023', 11890.10, 455.80),
  ('4º', '2023', 12500.90, 460.40),
  ('1º', '2024', 12780.30, 465100.90),
  ('2º', '2024', 12950.20, 468500.60);

/* 11. tblPibRegionalSP (PIB SP anual – valores fictícios em bilhões) */
INSERT INTO tblPibRegionalSP (ano, pibSP)
VALUES 
  ('2022', 750.25),
  ('2023', 770.80),
  ('2024', 785.40);

/* 12. filtroUsuario (relacionado a usuários) */
INSERT INTO filtroUsuario (tblUsuario_idUsuario, tblUsuario_Empresa_idEmpresa, nomeFiltro, ativo, config)
VALUES
  (1, 1, 'População Grandes Capitais', 1, JSON_OBJECT('ano','2023','minPopulacao',2000000)),
  (2, 2, 'PIB Construção', 1, JSON_OBJECT('ano','2024','setor','construcaoCivil')),
  (3, 3, 'Inflacao Mensal', 1, JSON_OBJECT('ultimosMeses',6,'tipo','IPCA'));

drop table filtroUsuario;
/* 13. tblLogSistemaAcesso */
INSERT INTO tblLogSistemaAcesso (dtAcontecimento, tipoLog, descricaoLog, Usuario_idUsuario, Usuario_Empresa_idEmpresa, Admin_idAdmin, tblSistema_idtblSistema)
VALUES
  ('2024-06-20', 'LOGIN', 'Login efetuado', 1, 1, NULL, 1),
  ('2024-06-21', 'API_CALL', 'Consulta PIB', 2, 2, NULL, 1),
  ('2024-06-22', 'CONFIG', 'Admin alterou filtro', NULL, NULL, 1, 1),
  ('2024-06-23', 'LOGIN_FAIL', 'Senha incorreta', 3, 3, NULL, 2);

/* 14. tblLogArquivos (simulando leituras de arquivos de carga) */
INSERT INTO tblLogArquivos (tipoLog, descricao, tblPibSetor_idtblPibSetor, tblPibRegionalSP_idtblPibRegionalSP, tblSelic_idtblSelic, tblInflacao_idtblInflacao, tblPopulacao_idtblPopulacao, tblZona_idZona, tblPib_idPib)
VALUES
  ('LOAD', 'Carga PIB Setor Q1 2024', 5, NULL, NULL, NULL, NULL, NULL, NULL),
  ('LOAD', 'Carga Inflacao Abril 2024', NULL, NULL, NULL, 4, NULL, NULL, NULL),
  ('LOAD', 'Carga População São Paulo 2023', NULL, NULL, NULL, NULL, 1, 4, NULL),
  ('LOAD', 'Carga PIB Sudeste Q1 2024', NULL, NULL, NULL, NULL, NULL, 4, 5);

/* 15. tblMetricasSistema (estado inicial) */
INSERT INTO tblMetricasSistema (totalRequisicoes, requisicoesOK, requisicoesErro, tempoMedioResposta, taxaSucesso, taxaErro)
VALUES
  (0, 0, 0, 0, 100.00, 0.00),
  (150, 140, 10, 220, (140/150)*100, (10/150)*100);

/* 16. tblErrosSistema (exemplos) */
INSERT INTO tblErrosSistema (tipoErro, endpoint, mensagem, tempoResposta)
VALUES
  ('ERRO', '/api/v1/pib', 'Falha ao processar parâmetros', 50),
   ('LENTIDAO', '/api/v1/populacao', 'Tempo de resposta acima do limite (1200ms)', 1200),
  ('ERRO', '/api/v1/inflacao', 'Timeout na consulta', 3000);
  
  
   SELECT 
      p.idtblPopulacao,
      p.municipio,
      p.qtdPopulacao,
      p.idadeMedia,
      p.densidadeDemo,
      z.nome as zona_nome,
      z.idZona as tblZona_idZona
    FROM tblPopulacao p
    INNER JOIN tblZona z ON p.tblZona_idZona = z.idZona
    WHERE z.idZona
    ORDER BY p.ano DESC;
    
        SELECT 
      p.trimestre, 
      p.ano, 
      p.pibGeral as valor,
      z.nome as zona_nome,
      z.idZona as zona_id
    FROM tblPib p
    INNER JOIN tblZona z ON p.idPib = z.idZona
    ORDER BY p.ano DESC, 
      CASE p.trimestre
        WHEN '4º' THEN 4
        WHEN '3º' THEN 3
        WHEN '2º' THEN 2
        WHEN '1º' THEN 1
      END DESC
    LIMIT 36;
    
    
        SELECT idfiltroUsuario, nomeFiltro, ativo, CAST(config AS CHAR) as config, dtCreateFiltro, dtUpdateFiltro 
    FROM filtroUsuario 
    WHERE tblUsuario_idUsuario = 1
    ORDER BY ativo DESC, dtCreateFiltro DESC;
    
    
        SELECT idfiltroUsuario, nomeFiltro, ativo, CAST(config AS CHAR) as config, dtCreateFiltro, dtUpdateFiltro 
    FROM filtroUsuario 
    WHERE tblUsuario_idUsuario = 2
    ORDER BY ativo DESC, dtCreateFiltro DESC;
    
        UPDATE filtroUsuario 
    SET ativo = TRUE 
    WHERE idfiltroUsuario = 2 AND tblUsuario_idUsuario = 2;
    
    
    select * from tblInflacao;