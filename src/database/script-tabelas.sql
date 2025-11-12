-- Foi utilizado este script para testar as procedures, atualmente está funcionando as procs: SetCadastro, GetLogin.

DROP DATABASE IF EXISTS sixtech;
CREATE DATABASE sixtech;
USE sixtech;


CREATE TABLE zona (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(45)
);

INSERT INTO zona (nome) VALUES 
('Litoral'),
('Zona Sul'),
('Zona Leste'),
('Zona Oeste'),
('Zona Norte');


CREATE TABLE pib (
  id INT PRIMARY KEY AUTO_INCREMENT,
  trimestre VARCHAR(10) NOT NULL,
  ano CHAR(4) NOT NULL,
  pibGeral DECIMAL(5,2) NOT NULL,
  idZona INT,
  FOREIGN KEY (idZona) REFERENCES zona(id)
);

CREATE INDEX idx_ano_trimestre ON pib(ano DESC, trimestre DESC);


INSERT INTO pib (trimestre, ano, pibGeral, idZona) VALUES
-- Grande SP
('1º', '2023', 0.4, 1), ('2º', '2023', -0.1, 1), ('3º', '2023', 0.8, 1), ('4º', '2023', 0.4, 1),
('1º', '2024', 2.5, 1), ('2º', '2024', 0.3, 1), ('3º', '2024', -0.4, 1), ('4º', '2024', 1.1, 1),
('1º', '2025', -0.2, 1), ('2º', '2025', 0.5, 1), ('3º', '2025', 0.8, 1), ('4º', '2025', 1.2, 1),
-- Interior
('1º', '2023', 0.6, 2), ('2º', '2023', 0.2, 2), ('3º', '2023', 1.0, 2), ('4º', '2023', 0.6, 2),
('1º', '2024', 2.8, 2), ('2º', '2024', 0.5, 2), ('3º', '2024', -0.2, 2), ('4º', '2024', 1.3, 2),
('1º', '2025', 0.1, 2), ('2º', '2025', 0.7, 2), ('3º', '2025', 1.0, 2), ('4º', '2025', 1.4, 2),
-- Litoral
('1º', '2023', 0.3, 3), ('2º', '2023', -0.3, 3), ('3º', '2023', 0.6, 3), ('4º', '2023', 0.2, 3),
('1º', '2024', 2.2, 3), ('2º', '2024', 0.1, 3), ('3º', '2024', -0.6, 3), ('4º', '2024', 0.9, 3),
('1º', '2025', -0.4, 3), ('2º', '2025', 0.3, 3), ('3º', '2025', 0.6, 3), ('4º', '2025', 1.0, 3);


CREATE TABLE pibSetor (
  id INT PRIMARY KEY AUTO_INCREMENT,
  trimestre VARCHAR(10) NOT NULL,
  ano CHAR(4) NOT NULL,
  construcaoCivil DECIMAL(5,2) NOT NULL,
  servicos DECIMAL(5,2) NOT NULL
);

CREATE INDEX idx_setor_ano ON pibSetor(ano DESC, trimestre DESC);

-- Inserir dados de Construção Civil e Serviços (últimos 12 trimestres)
INSERT INTO pibSetor (trimestre, ano, construcaoCivil, servicos) VALUES
('1º', '2023', 2.5, 6.7), ('2º', '2023', 2.1, 6.4), ('3º', '2023', -0.6, 6.3), ('4º', '2023', 1.0, 5.9),
('1º', '2024', 1.2, 5.6), ('2º', '2024', -0.2, 5.5), ('3º', '2024', -2.0, 5.3), ('4º', '2024', 0.1, 5.2),
('1º', '2025', -1.2, 4.8), ('2º', '2025', 0.5, 4.7), ('3º', '2025', 0.8, 4.5), ('4º', '2025', 1.5, 4.3);

CREATE TABLE pibRegionalSP (
  id INT PRIMARY KEY AUTO_INCREMENT,
  ano CHAR(4) NOT NULL,
  pibSP DECIMAL(5,2) NOT NULL
);

CREATE INDEX idx_ano_pib_sp ON pibRegionalSP(ano DESC);

INSERT INTO pibRegionalSP (ano, pibSP) VALUES
('2013', 2.8), ('2014', -1.4), ('2015', -4.1), ('2016', -3.0), ('2017', 0.3),
('2018', 1.5), ('2019', 1.7), ('2020', -3.5), ('2021', 4.7), ('2022', 3.4);


CREATE TABLE populacao (
  id INT PRIMARY KEY AUTO_INCREMENT,
  ano CHAR(4),
  codigoIbge VARCHAR(45),
  municipio VARCHAR(45),
  qtdPopulacao INT,
  homens INT,
  mulheres INT,
  razaoSexo DECIMAL(5,2),
  idadeMedia DECIMAL(5,2),
  densidadeDemografico DECIMAL(10,2),
  idZona INT,
  FOREIGN KEY (idZona) REFERENCES zona(id)
);

-- Inserir dados demográficos por zona
INSERT INTO populacao (ano, codigoIbge, municipio, qtdPopulacao, homens, mulheres, razaoSexo, idadeMedia, densidadeDemografico, idZona) VALUES
('2024', '3550308', 'São Paulo', 12400000, 5900000, 6500000, 110.2, 32.3, 7142.8, 1),
('2024', '3509502', 'Campinas', 1220000, 595000, 625000, 105.0, 31.5, 1235.6, 2),
('2024', '3548500', 'Santos', 433000, 198000, 235000, 118.7, 37.4, 1494.6, 3),
('2024', '3547809', 'Santo André', 721000, 347000, 374000, 107.8, 33.2, 4089.3, 4),
('2024', '3509601', 'Itaquaquecetuba', 365000, 180000, 185000, 102.8, 28.5, 4502.5, 5),
('2024', '3534401', 'Osasco', 699000, 338000, 361000, 106.8, 30.8, 10500.2, 5),
('2024', '3518800', 'Guarulhos', 1400000, 682000, 718000, 105.3, 29.6, 4389.1, 4),
('2024', '3548708', 'São Bernardo do Campo', 844000, 408000, 436000, 106.9, 32.1, 2043.5, 3),
('2024', '3530607', 'Mauá', 477000, 233000, 244000, 104.7, 30.5, 7723.1, 2),
('2024', '3513009', 'Diadema', 426000, 207000, 219000, 105.8, 31.8, 13846.2, 1);

CREATE TABLE cadastro (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(99),
  email VARCHAR(99),
  senha VARCHAR(99),
  cnpj CHAR(14)
);

CREATE TABLE selic (
  id INT PRIMARY KEY AUTO_INCREMENT,
  taxaSelic DECIMAL(5,2),
  dataApuracao DATE
);

INSERT INTO selic (dataApuracao, taxaSelic) VALUES
('2024-10-10', 10.75), ('2024-11-07', 11.25), ('2024-12-12', 12.25),
('2025-01-30', 13.25), ('2025-03-20', 14.25), ('2025-05-08', 14.75),
('2025-06-19', 15.00), ('2025-10-10', 15.00);

CREATE TABLE inflacao (
  id INT PRIMARY KEY AUTO_INCREMENT,
  taxaInflacao DECIMAL(5,2),
  dataApuracao DATE
);

INSERT INTO inflacao (dataApuracao, taxaInflacao) VALUES
('2024-10-01', 4.76), ('2024-11-01', 4.87), ('2024-12-01', 4.83),
('2025-01-01', 4.56), ('2025-02-01', 5.06), ('2025-03-01', 5.48),
('2025-04-01', 5.53), ('2025-05-01', 5.32), ('2025-06-01', 5.35),
('2025-07-01', 5.23), ('2025-08-01', 5.13), ('2025-09-01', 5.17);

CREATE TABLE filtrosUsuario (
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_user INT NOT NULL,
  nome VARCHAR(100) NOT NULL,
  ativo BOOLEAN DEFAULT FALSE,
  config JSON NOT NULL,
  create_f TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_f TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_user) REFERENCES cadastro(id)
);

CREATE TABLE loginADM (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(55),
  senha VARCHAR(50),
  token CHAR(4)
);

/*
SELECT 'ZONAS' AS Tabela, COUNT(*) AS Total FROM zona
UNION ALL SELECT 'PIB GERAL', COUNT(*) FROM pib
UNION ALL SELECT 'PIB SETORES', COUNT(*) FROM pibSetor
UNION ALL SELECT 'PIB REGIONAL SP', COUNT(*) FROM pibRegionalSP
UNION ALL SELECT 'POPULAÇÃO', COUNT(*) FROM populacao
UNION ALL SELECT 'SELIC', COUNT(*) FROM selic
UNION ALL SELECT 'INFLAÇÃO', COUNT(*) FROM inflacao;
*/

select * from cadastro;

DELIMITER $$

CREATE PROCEDURE GetLogin(
    IN login_email VARCHAR(99),
    IN login_senha VARCHAR(99)
)
BEGIN
    SELECT
        ID, 
        NOME, 
        EMAIL 
    FROM CADASTRO 
    WHERE EMAIL = login_email
    AND SENHA = login_senha;
END$$

DELIMITER ;


DELIMITER $$

CREATE PROCEDURE SetCadastro(
    IN cad_nome VARCHAR(99),
    IN cad_email VARCHAR(99),
	IN cad_senha VARCHAR(99),
	IN cad_cnpj CHAR(14)
)
BEGIN
    INSERT INTO cadastro (nome, email, senha, cnpj) VALUES (cad_nome, cad_email, cad_senha, cad_cnpj);
END$$

DELIMITER ;

, [nome, email, senha, cnpj]

CALL SetCadastro(
    'Rodrigo Proc',
    'rodrigoproc@admin.net',
	'12345678',
	'44251251000120'
);