(function() {
  var CONFIG = {
    urlMetricas: '/monitoramento/metricas',
    urlRegistrarErro: '/monitoramento/registrar-erro',
    urlAtualizarMetricas: '/monitoramento/atualizar',
    intervaloAtualizacaoDashboard: 300000,
    intervaloSincronizacao: 300000,
    limiarLentidao: 2000
  };

  var metricasLocais = {
    requisicoesTotal: 0,
    requisicoesOK: 0,
    requisicoesErro: 0,
    temposResposta: []
  };

  var fetchOriginal = window.fetch;

  window.fetch = function() {
    var args = arguments;
    var url = typeof args[0] === 'string' ?  args[0] : (args[0] && args[0].url ?  args[0].url : '');
    
    if (url. indexOf('/monitoramento/') !== -1) {
      return fetchOriginal.apply(window, args);
    }

    var inicio = performance.now();
    metricasLocais. requisicoesTotal++;

    return fetchOriginal.apply(window, args)
      .then(function(response) {
        var tempoResposta = Math.round(performance.now() - inicio);
        
        metricasLocais. temposResposta.push(tempoResposta);
        if (metricasLocais.temposResposta.length > 50) {
          metricasLocais. temposResposta.shift();
        }

        if (response.ok) {
          metricasLocais.requisicoesOK++;
        } else {
          metricasLocais.requisicoesErro++;
          registrarErroNoServidor('ERRO', url, 'HTTP ' + response.status, tempoResposta);
        }

        if (tempoResposta > CONFIG.limiarLentidao) {
          registrarErroNoServidor('LENTIDAO', url, 'Tempo: ' + tempoResposta + 'ms', tempoResposta);
        }

        return response;
      })
      .catch(function(erro) {
        var tempoResposta = Math.round(performance.now() - inicio);
        metricasLocais. requisicoesErro++;
        registrarErroNoServidor('ERRO', url, erro.message || 'Erro de conexao', tempoResposta);
        throw erro;
      });
  };

  window.onerror = function(mensagem, arquivo, linha, coluna, erro) {
    var descricao = mensagem + ' em ' + arquivo + ':' + linha;
    registrarErroNoServidor('ERRO', arquivo || window.location.pathname, descricao, 0);
    metricasLocais. requisicoesTotal++;
    metricasLocais. requisicoesErro++;
    return false;
  };

  window.onunhandledrejection = function(evento) {
    var mensagem = 'Promise rejeitada';
    if (evento.reason) {
      if (evento.reason. message) {
        mensagem = evento. reason.message;
      } else if (typeof evento.reason === 'string') {
        mensagem = evento.reason;
      }
    }
    registrarErroNoServidor('ERRO', window.location.pathname, mensagem, 0);
    metricasLocais.requisicoesTotal++;
    metricasLocais.requisicoesErro++;
  };

  function registrarErroNoServidor(tipo, endpoint, mensagem, tempoResposta) {
    try {
      var xhr = new XMLHttpRequest();
      xhr. open('POST', CONFIG.urlRegistrarErro, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify({
        tipoErro: tipo,
        endpoint: endpoint. substring(0, 255),
        mensagem: mensagem. substring(0, 500),
        tempoResposta: tempoResposta || 0
      }));
    } catch (e) {
      console.warn('[Monitoramento] Falha ao registrar erro:', e);
    }
  }

  function sincronizarMetricas() {
    if (metricasLocais.requisicoesTotal === 0) return;

    var tempoMedio = 0;
    if (metricasLocais.temposResposta.length > 0) {
      var soma = 0;
      for (var i = 0; i < metricasLocais. temposResposta.length; i++) {
        soma += metricasLocais.temposResposta[i];
      }
      tempoMedio = Math.round(soma / metricasLocais.temposResposta.length);
    }

    try {
      var xhr = new XMLHttpRequest();
      xhr. open('POST', CONFIG.urlAtualizarMetricas, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onload = function() {
        if (xhr.status === 200) {
          metricasLocais = {
            requisicoesTotal: 0,
            requisicoesOK: 0,
            requisicoesErro: 0,
            temposResposta: []
          };
        }
      };
      xhr.send(JSON.stringify({
        novasRequisicoes: metricasLocais. requisicoesTotal,
        requisicoesOK: metricasLocais.requisicoesOK,
        requisicoesErro: metricasLocais.requisicoesErro,
        tempoMedioResposta: tempoMedio
      }));
    } catch (e) {
      console. warn('[Monitoramento] Falha ao sincronizar:', e);
    }
  }

  function atualizarMetricasDashboard() {
    var elementos = {
      requisicoes: document.getElementById('metrica-requisicoes'),
      tempoMedio: document.getElementById('tempo-medio'),
      sync: document.getElementById('metrica-sync'),
      trendSync: document.getElementById('trend-sync'),
      ultimaSync: document. getElementById('ultima-sync'),
      erro: document.getElementById('metrica-erro'),
      totalErros: document. getElementById('total-erros'),
      trendErro: document.getElementById('trend-erro')
    };

    var temElementos = false;
    for (var chave in elementos) {
      if (elementos[chave] !== null) {
        temElementos = true;
        break;
      }
    }
    if (!temElementos) return;

    var xhr = new XMLHttpRequest();
    xhr. open('GET', CONFIG.urlMetricas, true);
    xhr.onload = function() {
      if (xhr.status !== 200) {
        definirValoresPadrao(elementos);
        return;
      }

      try {
        var dados = JSON.parse(xhr.responseText);

        if (elementos.requisicoes) {
          elementos. requisicoes.textContent = (parseInt(dados.totalRequisicoes) || 0).toLocaleString('pt-BR');
        }

        if (elementos.tempoMedio) {
          elementos.tempoMedio.textContent = (parseInt(dados.tempoMedioResposta) || 0) + 'ms/req';
        }

        var taxaSucesso = parseFloat(dados.taxaSucesso) || 100;
        if (elementos.sync) {
          elementos.sync.innerHTML = taxaSucesso. toFixed(1) + '<span class="unit">%</span>';
        }

        if (elementos.trendSync) {
          if (taxaSucesso >= 98) {
            elementos.trendSync. className = 'trend positive';
            elementos.trendSync.innerHTML = '<span class="trend-arrow">↑</span><span class="trend-text">OK</span>';
          } else if (taxaSucesso >= 95) {
            elementos.trendSync.className = 'trend neutral';
            elementos.trendSync.innerHTML = '<span class="trend-arrow">→</span><span class="trend-text">Alerta</span>';
          } else {
            elementos.trendSync.className = 'trend negative';
            elementos.trendSync.innerHTML = '<span class="trend-arrow">↓</span><span class="trend-text">Critico</span>';
          }
        }

        if (elementos.ultimaSync && dados.dtUltimaSync) {
          var data = new Date(dados.dtUltimaSync);
          var horas = String(data.getHours()).padStart(2, '0');
          var minutos = String(data. getMinutes()).padStart(2, '0');
          elementos.ultimaSync. textContent = 'Sync: ' + horas + ':' + minutos;
        }

        var taxaErro = parseFloat(dados.taxaErro) || 0;
        var totalErros = parseInt(dados.requisicoesErro) || 0;

        if (elementos.erro) {
          elementos.erro. innerHTML = taxaErro.toFixed(1) + '<span class="unit">%</span>';
        }

        if (elementos.totalErros) {
          elementos. totalErros.textContent = totalErros + ' erro' + (totalErros !== 1 ? 's' : '');
        }

        if (elementos.trendErro) {
          if (taxaErro === 0) {
            elementos. trendErro. className = 'trend positive';
            elementos.trendErro.innerHTML = '<span class="trend-arrow">✓</span><span class="trend-text">OK</span>';
          } else if (taxaErro < 5) {
            elementos.trendErro.className = 'trend neutral';
            elementos. trendErro. innerHTML = '<span class="trend-arrow">→</span><span class="trend-text">Baixo</span>';
          } else {
            elementos.trendErro.className = 'trend negative';
            elementos.trendErro.innerHTML = '<span class="trend-arrow">↑</span><span class="trend-text">Alto</span>';
          }
        }
      } catch (e) {
        definirValoresPadrao(elementos);
      }
    };
    xhr.onerror = function() {
      definirValoresPadrao(elementos);
    };
    xhr. send();
  }

  function definirValoresPadrao(elementos) {
    if (elementos.requisicoes) elementos.requisicoes. textContent = '--';
    if (elementos.tempoMedio) elementos.tempoMedio.textContent = '-- ms/req';
    if (elementos.sync) elementos.sync.innerHTML = '--<span class="unit">%</span>';
    if (elementos.erro) elementos.erro.innerHTML = '--<span class="unit">%</span>';
    if (elementos. totalErros) elementos.totalErros. textContent = '-- erros';
    if (elementos.ultimaSync) elementos.ultimaSync.textContent = 'Sync: --';
  }

  setInterval(sincronizarMetricas, CONFIG.intervaloSincronizacao);
  setInterval(atualizarMetricasDashboard, CONFIG. intervaloAtualizacaoDashboard);

  window. addEventListener('beforeunload', sincronizarMetricas);

  if (document. readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(atualizarMetricasDashboard, 2000);
    });
  } else {
    setTimeout(atualizarMetricasDashboard, 2000);
  }

  window.MonitoramentoSistema = {
    atualizarDashboard: atualizarMetricasDashboard,
    sincronizar: sincronizarMetricas,
    getMetricasLocais: function() {
      return {
        requisicoesTotal: metricasLocais.requisicoesTotal,
        requisicoesOK: metricasLocais.requisicoesOK,
        requisicoesErro: metricasLocais.requisicoesErro
      };
    }
  };
})();