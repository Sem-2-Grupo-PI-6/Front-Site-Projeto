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

    this.iniciarMonitoramento();
  }

  iniciarMonitoramento() {
    console.log('📊 Sistema de Monitoramento Iniciado');

    this.interceptarFetch();

    setInterval(() => this.calcularMetricas(), 30000);
  }

  interceptarFetch() {
    const fetchOriginal = window.fetch;
    const self = this;

    window.fetch = async function(...args) {
      const url = args[0];
      const inicio = Date.now();
      
      self.metricas.totalRequisicoes++;

      try {
        const resposta = await fetchOriginal.apply(this, args);
        const tempo = Date.now() - inicio;

        if (resposta.ok) {
          self.registrarSucesso(url, tempo);
        } else {
          self.registrarErro(url, tempo, `HTTP ${resposta.status}`);
        }

        return resposta;

      } catch (erro) {
        const tempo = Date.now() - inicio;
        self.registrarErro(url, tempo, erro.message);
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
  }

  registrarErro(url, tempo, mensagem) {
    this.metricas.requisicoesErro++;
    
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

    console.error(`❌ Erro na requisição: ${url} - ${mensagem}`);
    this.salvarMetricas();
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

  resetar() {
    this.metricas = {
      totalRequisicoes: 0,
      requisicoesOK: 0,
      requisicoesErro: 0,
      tempoMedioResposta: [],
      errosDetalhados: [],
      ultimaSync: null
    };
    this.salvarMetricas();
    console.log('🔄 Métricas resetadas');
  }

  salvarMetricas() {
    try {
      localStorage.setItem('METRICAS_SISTEMA', JSON.stringify(this.metricas));
    } catch (erro) {
      console.error('Erro ao salvar métricas:', erro);
    }
  }

  carregarMetricas() {
    try {
      const dados = localStorage.getItem('METRICAS_SISTEMA');
      if (dados) {
        this.metricas = JSON.parse(dados);
      }
    } catch (erro) {
      console.error('Erro ao carregar métricas:', erro);
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

console.log('✅ Sistema de Monitoramento Carregado');