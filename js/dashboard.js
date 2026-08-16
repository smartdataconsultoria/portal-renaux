let todosDashboards = [];
let categoriaAtiva = null;

async function carregarDashboards(email) {
  console.log('📊 Carregando dashboards para:', email);
  
  // Verificar se é diretor
  const isDiretor = CONFIG.DIRETORES.includes(email);
  console.log('🔑 É diretor?', isDiretor);
  
  let url;
  
  if(isDiretor) {
    // Diretores veem TODOS os dashboards da Renaux
    url = CONFIG.SB_URL + '/rest/v1/dashboards_clientes?select=*&empresa=eq.Renaux&apikey=' + CONFIG.SB_KEY;
    console.log('👔 Carregando TODOS os dashboards da Renaux (Diretor)');
  } else {
    // Outros usuários veem apenas seus dashboards
    const emailEncoded = encodeURIComponent(email);
    url = CONFIG.SB_URL + '/rest/v1/dashboards_clientes?select=*&email_cliente=eq.' + emailEncoded + '&apikey=' + CONFIG.SB_KEY;
    console.log('👤 Carregando dashboards do usuário');
  }
  
  console.log('🔗 URL:', url);
  
  try {
    const resp = await fetch(url);
    console.log('📡 Status:', resp.status);
    
    if(!resp.ok) {
      const erro = await resp.text();
      console.error('❌ Erro:', resp.status, erro);
      return [];
    }
    
    let dashboards = await resp.json();
    
    // Remover duplicatas pelo título
    const titulos = new Set();
    todosDashboards = dashboards.filter(d => {
      if(titulos.has(d.titulo)) {
        console.log('🔄 Removendo duplicata:', d.titulo);
        return false;
      }
      titulos.add(d.titulo);
      return true;
    });
    
    console.log('✓ Carregados:', todosDashboards.length, 'dashboards (sem duplicatas)');
    return todosDashboards;
  } catch(e) {
    console.error('❌ Erro ao carregar:', e);
    return [];
  }
}

function renderizarCategorias() {
  console.log('📂 Renderizando categorias...');
  
  const categorias = {};
  todosDashboards.forEach(d => {
    const cat = d.categoria || 'Sem Categoria';
    if(!categorias[cat]) categorias[cat] = 0;
    categorias[cat]++;
  });
  
  console.log('Categorias encontradas:', Object.keys(categorias));
  
  let html = '';
  Object.keys(categorias).sort().forEach(cat => {
    html += '<div class="category-item" onclick="filtrarCategoria(\'' + esc(cat) + '\')">' +
      '<span>📊</span> ' + esc(cat) +
      '</div>';
  });
  
  document.getElementById('categories-list').innerHTML = html;
  
  if(Object.keys(categorias).length > 0) {
    const primeira = Object.keys(categorias).sort()[0];
    filtrarCategoria(primeira);
  }
}

function filtrarCategoria(categoria) {
  console.log('🔍 Filtrando por:', categoria);
  categoriaAtiva = categoria;
  
  const items = document.querySelectorAll('.category-item');
  items.forEach(item => {
    if(item.textContent.includes(categoria)) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
  
  renderizarDashboards(categoria);
}

function renderizarDashboards(categoria) {
  const grid = document.getElementById('dashboard-grid');
  const filtrados = todosDashboards.filter(d => (d.categoria || 'Sem Categoria') === categoria);
  
  console.log('📊 Renderizando', filtrados.length, 'dashboards');
  
  document.getElementById('greeting-subtitle').textContent = 'Dashboards de ' + esc(categoria);
  
  if(!filtrados.length) {
    grid.innerHTML = '<div class="empty-state">Nenhum dashboard nessa categoria</div>';
    return;
  }
  
  const icons = ['📊', '📈', '📉', '💼', '🎯', '🔍'];
  let html = '<div class="grid">';
  
  filtrados.forEach((d, idx) => {
    const icon = icons[idx % icons.length];
    html += '<div class="card">' +
      '<div class="card-icon">' + icon + '</div>' +
      '<div class="card-title">' + esc(d.titulo) + '</div>' +
      '<div class="card-category">' + esc(categoria) + '</div>' +
      '<div class="card-description">' + esc(d.descricao || 'Dashboard') + '</div>' +
      '<a href="' + esc(d.url) + '" target="_blank" class="card-link">🔗 Abrir</a>' +
      '</div>';
  });
  
  html += '</div>';
  grid.innerHTML = html;
}
async function carregarBancoDados(email) {
  console.log('📊 Carregando banco de dados para:', email);
  
  const isDiretor = CONFIG.DIRETORES.includes(email);
  
  let url;
  
  if(isDiretor) {
    // Diretores veem TUDO
    url = CONFIG.SB_URL + '/rest/v1/arquivos_clientes?select=*&empresa=eq.Renaux&apikey=' + CONFIG.SB_KEY;
  } else {
    // Outros veem apenas os seus
    const emailEncoded = encodeURIComponent(email);
    url = CONFIG.SB_URL + '/rest/v1/arquivos_clientes?select=*&email_cliente=eq.' + emailEncoded + '&apikey=' + CONFIG.SB_KEY;
  }
  
  try {
    const resp = await fetch(url);
    
    if(!resp.ok) {
      console.error('❌ Erro ao carregar banco de dados');
      return [];
    }
    
    const arquivos = await resp.json();
    console.log('✓ Carregados:', arquivos.length, 'arquivos');
    
    renderizarBancoDados(arquivos);
    return arquivos;
  } catch(e) {
    console.error('❌ Erro:', e);
    return [];
  }
}

function renderizarBancoDados(arquivos) {
  const container = document.getElementById('database-list');
  
  if(!arquivos || arquivos.length === 0) {
    container.innerHTML = '<div style="padding: 10px; font-size: 12px; color: #9ca3af;">Nenhum arquivo disponível</div>';
    return;
  }
  
  let html = '';
  
  arquivos.forEach(arquivo => {
    html += '<div class="database-item" onclick="abrirArquivo(\'' + esc(arquivo.url) + '\', \'' + esc(arquivo.nome) + '\')">' +
      '<span class="database-icon">📄</span> ' +
      '<strong>' + esc(arquivo.nome) + '</strong>' +
      '</div>';
  });
  
  container.innerHTML = html;
}

function abrirArquivo(url, nome) {
  console.log('📂 Abrindo:', nome);
  window.open(url, '_blank');
}

function esc(s) {
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}
