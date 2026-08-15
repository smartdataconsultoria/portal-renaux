async function verificarSessao() {
  console.log('🔐 Verificando autenticação...');
  
  const {data:{session}} = await sb.auth.getSession();
  
  if(!session) {
    console.log('❌ Sem sessão, redirecionando para login');
    window.location.href = './login.html';
    return null;
  }
  
  console.log('✅ Autenticado como:', session.user.email);
  return session;
}

async function logout() {
  console.log('🚪 Fazendo logout...');
  await sb.auth.signOut();
  window.location.href = './login.html';
}