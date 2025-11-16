// =========================================
// SISTEMA DE MONITORAMENTO GLOBAL - SEGURO
// =========================================

class MonitoramentoSistema {
  constructor() {
    this.metricas = {
      totalRequisicoes: 0,
      requisicoesOK: 0,
      requisicoesErro: 0,
      tempoMedioResposta: [],
      errosDetalhados: [],
      ultimaSync: null
    };

    this.limites = {
      tempoMaximo: 3000,
      tempoAlerta: 2000
    };

    // ⚠️ PROTEÇÃO CONTRA LOOP
    this.sincronizandoBD = false;
    this.ultimaSincronizacao = 0;
    this.intervaloMinimoBD = 5000;
    
    // ✅ FLAG PARA SABER SE JÁ CARREGOU DO BD
    this.metricasCarregadas = false;

    this.iniciarMonitoramento();
  }

  async iniciarMonitoramento() {
    console.log('📊 Sistema de Monitoramento Iniciado');
    
    // ✅ CARREGAR MÉTRICAS DO BD PRIMEIRO
    await this.carregarMetricasDoBanco();
    
    this.interceptarFetch();
    
    // Sincronizar a cada 10 segundos
    setInterval(() => {
      if (!this.sincronizandoBD) {
        this.sincronizarComBanco();
      }
    }, 10000);
  }

  // ✅ CARREGAR MÉTRICAS DO BANCO DE DADOS
// ✅ CARREGAR MÉTRICAS DO BANCO DE DADOS
async carregarMetricasDoBanco() {
  try {
    console.log('🔄 Carregando métricas do banco de dados...');
    
    const response = await fetch('http://localhost:3333/monitoramento/metricas');
    
    if (response.ok) {
      const dadosBD = await response.json();
      
      console.log('📊 Métricas do BD:', dadosBD);
      
      // ✅ ATUALIZAR AS MÉTRICAS LOCAIS COM OS DADOS DO BD
      this.metricas.totalRequisicoes = dadosBD.totalRequisicoes || 0;
      this.metricas.requisicoesOK = dadosBD.requisicoesOK || 0;
      this.metricas.requisicoesErro = dadosBD.requisicoesErro || 0;
      this.metricas.ultimaSync = dadosBD.dtUltimaSync || null;
      
      // Preencher array de tempo médio (simulado)
      if (dadosBD.tempoMedioResposta > 0) {
        this.metricas.tempoMedioResposta = [dadosBD.tempoMedioResposta];
      }
      
      this.metricasCarregadas = true;
      
      console.log('✅ Métricas carregadas do BD:', {
        total: this.metricas.totalRequisicoes,
        ok: this.metricas.requisicoesOK,
        erro: this.metricas.requisicoesErro,
        taxaErro: this.metricas.totalRequisicoes > 0 
          ? ((this.metricas.requisicoesErro / this.metricas.totalRequisicoes) * 100).toFixed(1) + '%'
          : '0%'
      });
      
      this.salvarMetricas();
      
      // ⚠️ NÃO RESETAR - APENAS CARREGAR
      
    } else if (response.status === 204) {
      console.warn('⚠️ Nenhuma métrica encontrada no BD (204), mantendo valores atuais');
      // ⚠️ NÃO ZERAR - MANTER O QUE JÁ TEM
    } else {
      console.warn('⚠️ Erro ao buscar métricas (HTTP ' + response.status + ')');
    }
  } catch (erro) {
    console.error('❌ Erro ao carregar métricas do BD:', erro.message);
    // ⚠️ EM CASO DE ERRO, MANTER MÉTRICAS ATUAIS
  }
}
  interceptarFetch() {
    const fetchOriginal = window.fetch;
    const self = this;

    window.fetch = async function(...args) {
      const url = args[0];
      const inicio = Date.now();
      
      // ⚠️ IGNORAR ENDPOINTS DE MONITORAMENTO (EVITA LOOP)
      if (url.includes('/monitoramento/')) {
        return fetchOriginal.apply(this, args);
      }
      
      self.metricas.totalRequisicoes++;
      console.log(`📡 Requisição #${self.metricas.totalRequisicoes}: ${url}`);

      try {
        const resposta = await fetchOriginal.apply(this, args);
        const tempo = Date.now() - inicio;

        if (resposta.ok) {
          self.registrarSucesso(url, tempo);
        } else {
          console.error(`🔴 ERRO HTTP ${resposta.status} em ${url}`);
          self.registrarErro(url, tempo, `HTTP ${resposta.status}`);
          
          // 🔥 SINCRONIZAR IMEDIATAMENTE APÓS ERRO
          setTimeout(() => self.sincronizarComBanco(), 500);
        }

        return resposta;

      } catch (erro) {
        const tempo = Date.now() - inicio;
        console.error(`🔴 ERRO DE REDE em ${url}:`, erro.message);
        self.registrarErro(url, tempo, erro.message || 'Erro de rede');
        
        // 🔥 SINCRONIZAR IMEDIATAMENTE APÓS ERRO
        setTimeout(() => self.sincronizarComBanco(), 500);
        
        throw erro;
      }
    };
  }

  registrarSucesso(url, tempo) {
    this.metricas.requisicoesOK++;
    this.metricas.tempoMedioResposta.push(tempo);

    if (this.metricas.tempoMedioResposta.length > 100) {
      this.metricas.tempoMedioResposta.shift();
    }

    if (tempo > this.limites.tempoAlerta) {
      console.warn(`⚠️ Requisição lenta: ${url} (${tempo}ms)`);
      this.metricas.errosDetalhados.push({
        tipo: 'LENTIDAO',
        url: this.extrairEndpoint(url),
        tempo: tempo,
        timestamp: new Date().toISOString()
      });
    }

    this.metricas.ultimaSync = new Date().toISOString();
    this.salvarMetricas();
    
    console.log(`✅ Sucesso registrado. Total OK: ${this.metricas.requisicoesOK}`);
  }

  registrarErro(url, tempo, mensagem) {
    this.metricas.requisicoesErro++;
    
    console.log(`❌ ERRO REGISTRADO #${this.metricas.requisicoesErro}:`, {
      url: this.extrairEndpoint(url),
      mensagem: mensagem,
      tempo: tempo,
      totalRequisicoes: this.metricas.totalRequisicoes,
      taxaErro: ((this.metricas.requisicoesErro / this.metricas.totalRequisicoes) * 100).toFixed(1) + '%'
    });
    
    this.metricas.errosDetalhados.push({
      tipo: 'ERRO',
      url: this.extrairEndpoint(url),
      mensagem: mensagem,
      tempo: tempo,
      timestamp: new Date().toISOString()
    });

    if (this.metricas.errosDetalhados.length > 50) {
      this.metricas.errosDetalhados.shift();
    }

    this.salvarMetricas();
  }

  async sincronizarComBanco() {
    const agora = Date.now();
    
    if (this.sincronizandoBD) {
      console.log('⏸️ Sincronização já em andamento...');
      return;
    }

    this.sincronizandoBD = true;
    this.ultimaSincronizacao = agora;
    
    const metricas = this.calcularMetricas();
    
    console.log('🔄 Sincronizando métricas com BD:', metricas);
    
    try {
      const response = await fetch('http://localhost:3333/monitoramento/metricas/atualizar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          totalRequisicoes: this.metricas.totalRequisicoes,
          requisicoesOK: this.metricas.requisicoesOK,
          requisicoesErro: this.metricas.requisicoesErro,
          tempoMedioResposta: metricas.tempoMedio
        })
      });

      if (response.ok) {
        console.log('✅ Métricas sincronizadas com BD');
      } else {
        console.warn('⚠️ Erro ao sincronizar métricas (HTTP ' + response.status + ')');
      }
    } catch (erro) {
      console.error('❌ Erro ao sincronizar com BD (rede):', erro.message);
    } finally {
      this.sincronizandoBD = false;
    }
  }

  calcularMetricas() {
    const total = this.metricas.totalRequisicoes;
    
    if (total === 0) return {
      taxaSucesso: 100,
      taxaErro: 0,
      tempoMedio: 0,
      totalErros: 0
    };

    const taxaSucesso = ((this.metricas.requisicoesOK / total) * 100).toFixed(1);
    const taxaErro = ((this.metricas.requisicoesErro / total) * 100).toFixed(1);
    
    const tempoMedio = this.metricas.tempoMedioResposta.length > 0
      ? (this.metricas.tempoMedioResposta.reduce((a, b) => a + b, 0) / this.metricas.tempoMedioResposta.length).toFixed(0)
      : 0;

    return {
      taxaSucesso: parseFloat(taxaSucesso),
      taxaErro: parseFloat(taxaErro),
      tempoMedio: parseInt(tempoMedio),
      totalErros: this.metricas.requisicoesErro,
      ultimaSync: this.metricas.ultimaSync
    };
  }

  obterMetricas() {
    return this.calcularMetricas();
  }

  obterErrosRecentes(limite = 10) {
    return this.metricas.errosDetalhados.slice(-limite).reverse();
  }

async resetar() {
  console.warn('🔴🔴🔴 ATENÇÃO: resetar() foi chamado! 🔴🔴🔴');
  console.trace('Stack trace do reset:'); // ← Mostra quem chamou
  
  if (!confirm('⚠️ Tem certeza que deseja RESETAR todas as métricas?\n\nEsta ação não pode ser desfeita!')) {
    console.log('❌ Reset cancelado pelo usuário');
    return;
  }
  
  this.metricas = {
    totalRequisicoes: 0,
    requisicoesOK: 0,
    requisicoesErro: 0,
    tempoMedioResposta: [],
    errosDetalhados: [],
    ultimaSync: null
  };
  this.salvarMetricas();
  
  // Sincronizar reset com BD
  await this.sincronizarComBanco();
  
  console.log('🔄 Métricas resetadas');
}

  salvarMetricas() {
    try {
      localStorage.setItem('METRICAS_SISTEMA', JSON.stringify(this.metricas));
    } catch (erro) {
      console.error('Erro ao salvar métricas:', erro);
    }
  }

  extrairEndpoint(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname;
    } catch {
      return url;
    }
  }
}

window.MonitorSistema = new MonitoramentoSistema();
console.log('✅ Sistema de Monitoramento Carregado (com BD)');