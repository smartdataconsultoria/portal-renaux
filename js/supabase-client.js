let sb = null;

async function initSupabase() {
  console.log('🔧 Inicializando Supabase...');
  
  if(typeof supabase === 'undefined') {
    console.error('❌ Biblioteca Supabase não carregada');
    setTimeout(initSupabase, 100);
    return;
  }
  
  sb = supabase.createClient(CONFIG.SB_URL, CONFIG.SB_KEY);
  console.log('✅ Supabase inicializado!');
  return sb;
}