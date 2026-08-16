async function iniciarApp() {
  console.log('🟡 [INIT] App iniciando...');
  
  // 1. Inicializar Supabase
  await initSupabase();
  
  // 2. Verificar se está logado
  const session = await verificarSessao();
  if(!session) return;
  
  // 3. Preencher dados do usuário
  const email = session.user.email;
  const userName = email.split('@')[0].toUpperCase();
  document.getElementById('user-name').textContent = userName;
  document.getElementById('user-email').textContent = email;
  
  // 4. Atualizar data
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateStr = now.toLocaleDateString('pt-BR', options);
  document.getElementById('current-date').textContent = dateStr;
  
  // 5. Adicionar saudação dinâmica com hora do dia
  const hora = now.getHours();
  let saudacao = '';
  
  if(hora >= 5 && hora < 12) {
    saudacao = 'Bom dia';
  } else if(hora >= 12 && hora < 18) {
    saudacao = 'Boa tarde';
  } else {
    saudacao = 'Boa noite';
  }
  
  const greetingTitle = document.querySelector('.greeting-title');
  greetingTitle.textContent = saudacao + ', ' + userName + '! 👋';
  
  // 6. Carregar dashboards
  await carregarDashboards(email);
  
  // 7. Renderizar categorias e dashboards
  renderizarCategorias();
  // Carregar banco de dados
  await carregarBancoDados(email);
  
  console.log('✅ App pronto!');
}

// Iniciar quando a página carregar
document.addEventListener('DOMContentLoaded', iniciarApp);
