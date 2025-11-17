// ===== ATUALIZAR MÉTRICAS DO DASHBOARD ADMIN =====
async function atualizarMetricasAdmin() {
  try {
    const response = await fetch('http://localhost:3333/monitoramento/metricas');
    
    if (!response.ok) {
      console.warn('⚠️ Erro ao buscar métricas do BD (HTTP ' + response.status + ')');
      
      // Mostrar valores padrão se der erro
      document.getElementById('metrica-requisicoes').textContent = '--';
      document.getElementById('tempo-medio').textContent = '-- ms/req';
      document.getElementById('metrica-sync').innerHTML = '--<span class="unit">%</span>';
      document.getElementById('metrica-erro').innerHTML = '--<span class="unit">%</span>';
      document.getElementById('total-erros').textContent = '-- erros';
      document.getElementById('ultima-sync').textContent = 'Sync: --';
      return;
    }
    
    const dadosBD = await response.json();
    
    console.log('📊 Métricas do BD (dashboard):', dadosBD);
    
    // ✅ REQUISIÇÕES TOTAIS
    const totalReq = parseInt(dadosBD.totalRequisicoes) || 0;
    document.getElementById('metrica-requisicoes').textContent = totalReq.toLocaleString('pt-BR');
    
    // ✅ TEMPO MÉDIO
    const tempoMedio = parseInt(dadosBD.tempoMedioResposta) || 0;
    document.getElementById('tempo-medio').textContent = `${tempoMedio}ms/req`;
    
    // ✅ TAXA DE SUCESSO (SYNC)
    let taxaSucesso = parseFloat(dadosBD.taxaSucesso) || 0;
    
    // Se totalReq for 0, assume 100%
    if (totalReq === 0) {
      taxaSucesso = 100;
    }
    
    document.getElementById('metrica-sync').innerHTML = 
      `${taxaSucesso.toFixed(1)}<span class="unit">%</span>`;
    
    const trendSync = document.getElementById('trend-sync');
    if (taxaSucesso >= 98) {
      trendSync.className = 'trend positive';
      trendSync.innerHTML = '<span class="trend-arrow">↑</span><span class="trend-text">OK</span>';
    } else if (taxaSucesso >= 95) {
      trendSync.className = 'trend neutral';
      trendSync.innerHTML = '<span class="trend-arrow">→</span><span class="trend-text">Alerta</span>';
    } else {
      trendSync.className = 'trend negative';
      trendSync.innerHTML = '<span class="trend-arrow">↓</span><span class="trend-text">Crítico</span>';
    }
    
    // ✅ ÚLTIMA SYNC
    if (dadosBD.dtUltimaSync) {
      const data = new Date(dadosBD.dtUltimaSync);
      const horas = String(data.getHours()).padStart(2, '0');
      const minutos = String(data.getMinutes()).padStart(2, '0');
      document.getElementById('ultima-sync').textContent = `Sync: ${horas}:${minutos}`;
    } else {
      document.getElementById('ultima-sync').textContent = 'Sync: --';
    }
    
    // ✅ TAXA DE ERRO
    let taxaErro = parseFloat(dadosBD.taxaErro) || 0;
    const totalErros = parseInt(dadosBD.requisicoesErro) || 0;
    
    document.getElementById('metrica-erro').innerHTML = 
      `${taxaErro.toFixed(1)}<span class="unit">%</span>`;
    
    document.getElementById('total-erros').textContent = 
      `${totalErros} erro${totalErros !== 1 ? 's' : ''}`;
    
    const trendErro = document.getElementById('trend-erro');
    if (taxaErro === 0) {
      trendErro.className = 'trend positive';
      trendErro.innerHTML = '<span class="trend-arrow">✓</span><span class="trend-text">OK</span>';
    } else if (taxaErro < 5) {
      trendErro.className = 'trend neutral';
      trendErro.innerHTML = '<span class="trend-arrow">→</span><span class="trend-text">Baixo</span>';
    } else {
      trendErro.className = 'trend negative';
      trendErro.innerHTML = '<span class="trend-arrow">↑</span><span class="trend-text">Alto</span>';
    }
    
  } catch (erro) {
    console.error('❌ Erro ao atualizar métricas da dashboard:', erro);
  }
}

// ⚡ ATUALIZAR A CADA 2 SEGUNDOS
setInterval(atualizarMetricasAdmin, 2000);

// Atualizar imediatamente ao carregar
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(atualizarMetricasAdmin, 500);
});