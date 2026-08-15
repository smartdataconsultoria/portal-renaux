async function iniciarApp() {
  console.log('🟡 [INIT] App iniciando...');
  
  // 1. Inicializar Supabase
  await initSupabase();
  
  // 2. Verificar se está logado
  const session = await verificarSessao();
  if(!session) return;
  
  // 3. Preencher dados do usuário
  const userName = session.user.email.split('@')[0];
  document.getElementById('user-name').textContent = userName;
  document.getElementById('user-email').textContent = session.user.email;
  
  // 4. Atualizar data
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateStr = now.toLocaleDateString('pt-BR', options);
  document.getElementById('current-date').textContent = dateStr;
  
  // 5. Carregar dashboards
  await carregarDashboards(session.user.email);
  
  // 6. Renderizar categorias e dashboards
  renderizarCategorias();
  
  console.log('✅ App pronto!');
}

// Iniciar quando a página carregar
document.addEventListener('DOMContentLoaded', iniciarApp);