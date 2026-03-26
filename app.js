const SUPABASE_URL = 'https://fjjkqwmuycnuzalaeszs.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ox8ZqXVfzYWzjAmtz3KIMg_w3F7fas7';
const { createClient } = window.supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY);

const translations = {
    en: {
        'game-title': 'Battle!',
        'game-subtitle': 'Make your move to start the shape match',
        'phase-committing': 'COMMITTING',
        'phase-reveal': 'REVEAL PHASE',
        'phase-battle': 'BATTLE START!',
        'phase-over': 'BATTLE OVER',
        'p1-label': 'YOU',
        'p2-label': 'SHAPE MASTER',
        'awaiting': 'Awaiting...',
        'thinking': 'Thinking...',
        'ready': 'READY',
        'locked': 'LOCKED',
        'rock': 'ROCK',
        'paper': 'PAPER',
        'scissors': 'SCISSORS',
        'play-again': 'PLAY AGAIN',
        'syncing': 'SYNCING PAYOUT...',
        'win': 'YOU WON!',
        'loss': 'YOU LOST!',
        'draw': 'DRAW MATCH',
        'refund': 'STAKE REFUNDED',
        'searching': 'Searching for opponent...',
        'opponent-found': 'Opponent found!',
        'opponent-played': 'Hurry! Opponent ready!',
        'pvp-mode': 'ONLINE PVP',
        'timeout': 'TIME OUT!',
        'name-short': 'Nickname too short!',
        'name-taken': 'This BATTLE ID is taken!',
        'name-error': 'Error saving nickname',
        'joining': 'JOINING ARENA...',
        'score-wins': 'WINS',
        'score-draws': 'DRAWS',
        'score-losses': 'LOSSES',
        'menu-profile': 'Profile',
        'menu-password': 'Change Password',
        'menu-wallet': 'Wallet Shop',
        'menu-manual': 'Manual',
        'menu-admin': 'Admin Center'
    },
    es: {
        'game-title': '¡Batalla!',
        'game-subtitle': 'Haz tu movimento para empezar la batalha',
        'phase-committing': 'COMETIENDO',
        'phase-reveal': 'FASE DE REVELACIÓN',
        'phase-battle': '¡EMPIEZA LA BATALLA!',
        'phase-over': 'BATALLA TERMINADA',
        'p1-label': 'TÚ',
        'p2-label': 'MAESTRO DE FORMAS',
        'awaiting': 'Esperando...',
        'thinking': 'Pensando...',
        'ready': 'LISTO',
        'locked': 'BLOQUEADO',
        'rock': 'PIEDRA',
        'paper': 'PAPEL',
        'scissors': 'TIJERAS',
        'play-again': 'JUGAR DE NUEVO',
        'syncing': 'SINCRONIZANDO PAGO...',
        'win': '¡GANASTE!',
        'loss': '¡PERDISTE!',
        'draw': 'EMPATE',
        'refund': 'APUESTA REEMBOLSADA',
        'searching': 'Buscando oponente...',
        'opponent-found': '¡Oponente encontrado!',
        'opponent-played': '¡Rápido! Oponente listo!',
        'pvp-mode': 'PVP EN LÍNEA',
        'timeout': '¡TIEMPO AGOTADO!',
        'name-short': '¡Apodo muy corto!',
        'name-taken': '¡BATTLE ID ya usado!',
        'name-error': 'Error al guardar apodo',
        'joining': 'ENTRANDO...',
        'score-wins': 'VICTORIAS',
        'score-draws': 'EMPATES',
        'score-losses': 'DERROTAS',
        'menu-profile': 'Perfil',
        'menu-password': 'Cambiar Contraseña',
        'menu-wallet': 'Tienda Wallet',
        'menu-manual': 'Manual',
        'menu-admin': 'Centro Admin'
    },
    pt: {
        'game-title': 'Batalha!',
        'game-subtitle': 'Faça sua jogada para iniciar o duelo',
        'phase-committing': 'APOSTANDO',
        'phase-reveal': 'FASE DE REVELAÇÃO',
        'phase-battle': 'BATALHA INICIADA!',
        'phase-over': 'BATALHA ENCERRADA',
        'p1-label': 'VOCÊ',
        'p2-label': 'MESTRE DAS FORMAS',
        'awaiting': 'Aguardando...',
        'thinking': 'Pensando...',
        'ready': 'PRONTO',
        'locked': 'BLOQUEADO',
        'rock': 'PEDRA',
        'paper': 'PAPEL',
        'scissors': 'TESOURA',
        'play-again': 'JUGAR NOVAMENTE',
        'syncing': 'SINCRONIZANDO PAGAMENTO...',
        'win': 'VOCÊ VENCEU!',
        'loss': 'VOCÊ PERDEU!',
        'draw': 'EMPATE',
        'refund': 'APOSTA REEMBOLSADA',
        'searching': 'Procurando oponente...',
        'opponent-found': 'Oponente encontrado!',
        'opponent-played': 'Depressa! Oponente pronto!',
        'pvp-mode': 'PVP ONLINE',
        'timeout': 'TEMPO ESGOTADO!',
        'name-short': 'Nickname muito curto!',
        'name-taken': 'Este BATTLE ID já existe!',
        'name-error': 'Erro ao salvar nickname',
        'joining': 'ENTRANDO...',
        'score-wins': 'VITÓRIAS',
        'score-draws': 'EMPATES',
        'score-losses': 'DERROTAS',
        'menu-profile': 'Perfil',
        'menu-password': 'Trocar Senha',
        'menu-wallet': 'Wallet Shop',
        'menu-manual': 'Manual',
        'menu-admin': 'Centro Admin'
    }
};

const langEmojis = { en: '🇺🇸', es: '🇪🇸', pt: '🇧🇷' };
let currentLang = localStorage.getItem('battlerps-lang') || 'pt';

const config = {
    stake: 100.00,
    platformFee: 0.05
};

const moveUris = {
    rock: 'images/rock.png',
    paper: 'images/paper.png',
    scissors: 'images/scissors.png',
    unknown: 'images/question.png'
};

// Economia Joken (JK$)
const JOKEN_RATE = 100; // Constante Global

function formatJK(val) {
    return 'JK$ ' + Math.floor(val).toLocaleString('pt-BR');
}

let balance = 0;
let myMove = null;
let botMove = null;
let phase = 'COMMIT';
let gameMode = 'bot';
let pvpChannel = null;
let partnerId = null;
let pvpMoveReceived = null;
let partnerName = null;
let countdownInterval = null;
let currentTime = 5;
let firstPlayedSide = null;
let currentWallet = localStorage.getItem('battlerps-device-id');
let myUsername = localStorage.getItem('battlerps-user-handle');
let currentUser = null;
let pvpDiscoveryInterval = null;
let myAvatarUrl = 'https://fjjkqwmuycnuzalaeszs.supabase.co/storage/v1/object/public/avatars/avatar_p1.png';
let pvpSearchReadyAt = 0; // Timestamp mínimo para aceitar novo parceiro

async function checkUser() {
    const { data: { session } } = await db.auth.getSession();
    await handleAuthTransition(session);
}

async function handleAuthTransition(session) {
    if (session && session.user) {
        currentUser = session.user;
        if (elBtnAdmin) {
            if (currentUser.email === 'marcosjscabral@gmail.com') {
                elBtnAdmin.classList.remove('hidden');
            } else {
                elBtnAdmin.classList.add('hidden');
            }
        }

        const { data: profile } = await db.from('user_profiles').select('*').eq('id', currentUser.id).single();
        
        // Atualiza UI para Logado (Verde)
        elLoginTrigger.textContent = '👤';
        elLoginTrigger.style.color = '#10b981';
        elLoginTrigger.title = 'Minha Conta';
        
        let activeProfile = profile;
        if (!activeProfile) {
            // Se o perfil ainda não existir no banco (falha no trigger?), avisamos
            alert("Perfil de usuário não sincronizado. Por favor, faça logout e entre novamente para ativar sua conta.");
            // Mantemos um perfil local temporário para não quebrar a UI, mas as operações falharão se não houver linha no DB
            activeProfile = { id: currentUser.id, username: generateRandomUsername(), balance: 1500.00, avatar_url: 'images/player_default.png' };
        }

        myUsername = activeProfile.username;
        if (!myUsername) {
            myUsername = generateRandomUsername();
            const { error: updError } = await db.from('user_profiles').update({ username: myUsername }).eq('id', currentUser.id);
            if (updError) alert("Erro ao atualizar nome: " + updError.message);
            activeProfile.username = myUsername;
        }

        updateBalance(activeProfile.balance || 0);
        elP1Label.textContent = myUsername;
        
        if (activeProfile.avatar_url) {
            myAvatarUrl = activeProfile.avatar_url;
            elP1Avatar.src = myAvatarUrl;
            elProfilePreview.src = myAvatarUrl;
        } else {
            myAvatarUrl = 'images/player_default.png';
            await db.from('user_profiles').update({ avatar_url: myAvatarUrl }).eq('id', currentUser.id);
            elP1Avatar.src = myAvatarUrl;
            elProfilePreview.src = myAvatarUrl;
        }

        // Popular modal de perfil com os dados reais
        elProfileUser.value = myUsername.replace('@', '');
        elProfileUser.placeholder = myUsername.replace('@', '');
        elProfileEmail.value = currentUser.email; 
        
        // --- Atualiza visualização do Auth Modal para estado logado ---
        if (elAuthTabsGroup) elAuthTabsGroup.classList.add('hidden');
        if (elAuthFormContainer) elAuthFormContainer.classList.add('hidden');
        if (elAuthLoggedInContainer) elAuthLoggedInContainer.classList.remove('hidden');
        if (elAuthPText) elAuthPText.textContent = `Logado como ${currentUser.email}`;

        // Ativar Realtime Listener para o Ledger/Wallet Híbrido da Economia JK$
        if (window.walletChannel) window.walletChannel.unsubscribe();
        window.walletChannel = db.channel('joken_economy_sync')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'user_profiles', filter: `id=eq.${currentUser.id}` }, payload => {
                if (payload.new.balance !== undefined && payload.new.balance !== balance) {
                    updateBalance(payload.new.balance);
                }
            }).subscribe();

    } else {
        // Estado Deslogado - Hard Reset local sem recarregar se possível, mas garantindo limpeza
        sanitizeStateOnLogout();
        
        currentUser = null;
        myUsername = '@YOU'; 
        myAvatarUrl = 'images/player_default.png';
        
        if (elP1Label) elP1Label.textContent = myUsername;
        if (elP1Avatar) elP1Avatar.src = myAvatarUrl;
        if (elProfilePreview) elProfilePreview.src = myAvatarUrl;
        
        // --- Atualiza visualização do Auth Modal para estado deslogado ---
        if (elAuthTabsGroup) elAuthTabsGroup.classList.remove('hidden');
        if (elAuthFormContainer) elAuthFormContainer.classList.remove('hidden');
        if (elAuthLoggedInContainer) elAuthLoggedInContainer.classList.add('hidden');
        if (elAuthUpdatePasswordContainer) elAuthUpdatePasswordContainer.classList.add('hidden');
        if (elAuthPText) elAuthPText.textContent = 'Acesse sua conta para entrar na Arena';

        // Atualiza UI para Deslogado (Azul)
        elLoginTrigger.textContent = '👤 Login';
        elLoginTrigger.style.color = '#4285F4';
        elLoginTrigger.title = 'Fazer Login';

        if (elBtnAdmin) elBtnAdmin.classList.add('hidden');
    }
}

function sanitizeStateOnLogout() {
    // Purgar caches de estado global
    balance = 0;
    updateBalance(0);
    myMove = null;
    botMove = null;
    pvpMoveReceived = null;
    partnerId = null;
    if (pvpChannel) {
        pvpChannel.unsubscribe();
        pvpChannel = null;
    }
    if (window.walletChannel) {
        window.walletChannel.unsubscribe();
        window.walletChannel = null;
    }
    // Purgar localStorage sensível
    localStorage.removeItem('battlerps-score-wins');
    localStorage.removeItem('battlerps-score-draws');
    localStorage.removeItem('battlerps-score-losses');
    
    // Resetar UI Components
    if (elPvpStatus) elPvpStatus.classList.add('hidden');
    if (elScoreWin) elScoreWin.textContent = '0';
    if (elScoreDraw) elScoreDraw.textContent = '0';
    if (elScoreLoss) elScoreLoss.textContent = '0';
}

function generateRandomUsername() {
    const adj = ["Swift", "Brave", "Ancient", "Iron", "Silent", "Neon", "Cyber", "Dark"];
    const noun = ["Shape", "Warrior", "Shadow", "King", "Knight", "Master", "Blade"];
    const num = Math.floor(Math.random() * 9999);
    return "@" + adj[Math.floor(Math.random()*adj.length)] + noun[Math.floor(Math.random()*noun.length)] + num;
}

let storedVolMusic = localStorage.getItem('battlerps-volume-music');
let currentVolumeMusic = storedVolMusic !== null ? parseFloat(storedVolMusic) : 0.1;
if (isNaN(currentVolumeMusic)) currentVolumeMusic = 0.1;
let lastVolumeMusic = currentVolumeMusic > 0 ? currentVolumeMusic : 0.1;

let storedVolSfx = localStorage.getItem('battlerps-volume-sfx');
let currentVolumeSfx = storedVolSfx !== null ? parseFloat(storedVolSfx) : 0.6;
if (isNaN(currentVolumeSfx)) currentVolumeSfx = 0.6;
let lastVolumeSfx = currentVolumeSfx > 0 ? currentVolumeSfx : 0.6;
let scoreWins = parseInt(localStorage.getItem('battlerps-score-wins')) || 0;
let scoreDraws = parseInt(localStorage.getItem('battlerps-score-draws')) || 0;
let scoreLosses = parseInt(localStorage.getItem('battlerps-score-losses')) || 0;

if (!currentWallet) {
    currentWallet = 'USER-' + Math.floor(Math.random() * 999999);
    localStorage.setItem('battlerps-device-id', currentWallet);
}

// DOM Elements
const elBalance = document.getElementById('user-balance');
const elBalanceChip = document.getElementById('balance-chip');
const elShopBalanceChip = document.getElementById('shop-balance-chip');
const elShopBalance = document.getElementById('shop-current-balance');
const elShopGrid = document.getElementById('shop-cards-grid');
const elPhase = document.getElementById('phase-chip');
const elReconMsg = document.getElementById('recon-msg');
const elResultBanner = document.getElementById('result-banner');
const elWinnerText = document.getElementById('winner-text');
const elP1Status = document.getElementById('p1-status');
const elP2Status = document.getElementById('p2-status');
const overlay = document.getElementById('animation-overlay');
const h1 = document.getElementById('p1-anim-hand');
const h2 = document.getElementById('p2-anim-hand');
const elLangTrigger = document.getElementById('lang-current');
const elLangDropdown = document.getElementById('lang-dropdown');
const elAudioMenu = document.getElementById('audio-menu');
const elMenuBtn = document.getElementById('menu-btn');
const elMusic = document.getElementById('bg-music');
const elMusicBtn = document.getElementById('music-toggle');
const elSfxBounce = document.getElementById('sfx-bounce');
const elSfxReveal = document.getElementById('sfx-reveal');
const elPvpStatus = document.getElementById('pvp-status');
const elPvpText = document.getElementById('pvp-status-text');
const elP1Timer = document.getElementById('p1-timer');
const elP2Timer = document.getElementById('p2-timer');
const elPvpWalletP1 = document.getElementById('pvp-wallet-p1');
const elPvpWalletP2 = document.getElementById('pvp-wallet-p2');
const elUsernameOverlay = document.getElementById('username-overlay');
const elUsernameInput = document.getElementById('username-input');
const elSaveUsername = document.getElementById('btn-save-username');
const elUsernameError = document.getElementById('username-error');
const elP1Label = document.getElementById('p1-label');
const elP1Avatar = document.getElementById('p1-avatar');
const elP2Label = document.getElementById('p2-label');
const elP2Avatar = document.getElementById('p2-avatar');
const elScoreWin = document.getElementById('score-win-count');
const elScoreDraw = document.getElementById('score-draw-count');
const elScoreLoss = document.getElementById('score-loss-count');
const elSfxWin = document.getElementById('sfx-win');
const elSfxLoss = document.getElementById('sfx-loss');
const elSfxDraw = document.getElementById('sfx-draw');
const elSfxClick = document.getElementById('sfx-click');
const elMusicSlider = document.getElementById('volume-music-slider');
const elSfxSlider = document.getElementById('volume-sfx-slider');
const elSfxBtn = document.getElementById('sfx-toggle');
const elAuthView = document.getElementById('auth-view');
const elGameScreen = document.getElementById('game-screen');
const elLoginTrigger = document.getElementById('btn-login-trigger');
const elAuthGoogle = document.getElementById('btn-auth-google');
const elAuthSubmit = document.getElementById('btn-auth-submit'); // Updated from elAuthEmailBtn
const elEmailInput = document.getElementById('auth-email');
const elPassInput = document.getElementById('auth-password');
const elTabLogin = document.querySelector('[data-tab="login"]');
const elTabSignup = document.querySelector('[data-tab="signup"]');
const elProfileView = document.getElementById('profile-view');
const elProfileTrigger = document.getElementById('btn-profile-trigger');
const elProfileUser = document.getElementById('profile-username');
const elProfileEmail = document.getElementById('profile-email');
const elProfilePreview = document.getElementById('profile-avatar-preview');
const elAvatarUpload = document.getElementById('avatar-upload');
const elSaveProfile = document.getElementById('btn-save-profile');
const elProfileTimer = document.getElementById('profile-timer-msg');
const elEditUserBtn = document.getElementById('btn-edit-username');
const elEditEmailBtn = document.getElementById('btn-edit-email');
const elChangePassBtn = document.getElementById('btn-change-password-trigger');
const elConfirmOverlay = document.getElementById('confirm-overlay');
const elConfirmTitle = document.getElementById('confirm-title');
const elConfirmMsg = document.getElementById('confirm-msg');
const elConfirmYes = document.getElementById('btn-confirm-yes');
const elConfirmNo = document.getElementById('btn-confirm-no');
const elToastSuccess = document.getElementById('toast-success');
const elAuthPText = document.getElementById('auth-p-text');
const elAuthTabsGroup = document.getElementById('auth-tabs-group');
const elAuthFormContainer = document.getElementById('auth-form-container');
const elAuthLoggedInContainer = document.getElementById('auth-logged-in-container');
const elAuthLogoutBtn = document.getElementById('btn-auth-logout');
const elAuthUpdatePasswordContainer = document.getElementById('auth-update-password-container');
const elAuthOverlay = elAuthView; 
const elProfileOverlay = elProfileView;
const elAuthEmailBtn = document.getElementById('btn-auth-submit'); // Re-using the updated name



const elVsButton = document.getElementById('vs-button');
const elCountdownOverlay = document.getElementById('countdown-overlay');
const elCountdownText = document.getElementById('countdown-text');

// --- Central Routing System ---
const allViews = {
    'game-screen': document.getElementById('game-screen'),
    'manual-view': document.getElementById('manual-view'),
    'wallet-view': document.getElementById('wallet-view'),
    'admin-view': document.getElementById('admin-view'),
    'store-view': document.getElementById('store-view'),
    'auth-view': elAuthView,
    'profile-view': elProfileView
};

window.showView = function(viewId) {
    if (elAudioMenu) elAudioMenu.classList.remove('active'); 
    
    // Reset Profile inputs to readonly when leaving/entering views
    if (elProfileUser) { elProfileUser.readOnly = true; elProfileUser.classList.add('readonly-input'); elProfileUser.classList.remove('edit-active'); }
    if (elProfileEmail) { elProfileEmail.readOnly = true; elProfileEmail.classList.add('readonly-input'); elProfileEmail.classList.remove('edit-active'); }

    // Hide all main switches
    Object.values(allViews).forEach(view => {
        if (view) view.classList.add('hidden');
    });

    // Special Case: overlays that should reset the game screen
    const target = allViews[viewId];
    if (target) {
        target.classList.remove('hidden');
        if (viewId === 'wallet-view') loadShop();
        if (viewId === 'profile-view' && !currentUser) {
            // If not logged in, redirect profile request to auth
            showView('auth-view');
            return;
        }
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.hideAllViews = () => {
    Object.values(allViews).forEach(view => { if (view) view.classList.add('hidden'); });
};


let authMode = 'login'; // 'login' or 'signup'

function switchAuthMode(mode) {
    authMode = mode;
    elTabLogin.classList.toggle('active', mode === 'login');
    elTabSignup.classList.toggle('active', mode === 'signup');
    elAuthPText.textContent = mode === 'login' ? "Acesse sua conta para entrar na Arena" : "Crie sua conta para salvar suas vitórias";
    elAuthEmailBtn.textContent = mode === 'login' ? "ENTRAR" : "CADASTRAR";
}

async function signInWithGoogle() {
    await db.auth.signInWithOAuth({ 
        provider: 'google',
        options: {
            redirectTo: window.location.origin
        }
    });
}

async function signInWithEmail() {
    const email = elEmailInput.value.trim();
    const password = elPassInput.value.trim();
    if (!email || !password) return alert("Preencha email e senha");
    
    elAuthEmailBtn.disabled = true;
    
    if (authMode === 'signup') {
        // Fluxo de Cadastro
        const { data, error } = await db.auth.signUp({ 
            email, 
            password,
            options: { emailRedirectTo: window.location.origin }
        });
        if (error) alert(error.message);
        else alert("Conta criada! Verifique seu e-mail para confirmar a conta.");
    } else {
        // Fluxo de Login
        const { data, error } = await db.auth.signInWithPassword({ 
            email, 
            password,
            options: { emailRedirectTo: window.location.origin }
        });
        if (error) {
            if (error.status === 400) alert("Email ou senha incorretos. Verifique seus dados.");
            else alert(error.message);
        } else {
            showView('game-screen'); 
        }
    }
    
    elAuthEmailBtn.disabled = false;
}

async function signOut() {
    const ok = await showConfirm("LOGOUT", "Tem certeza que deseja sair da conta?");
    if (!ok) return;
    
    await db.auth.signOut();
    
    // LIMPEZA ANTIGRAVITY (Clean Slate Profundo)
    // Remove todos os dados do navegador antes de recarregar
    localStorage.clear();
    sessionStorage.clear();
    
    // Limpeza de cookies (opcional, mas recomendado)
    document.cookie.split(";").forEach((c) => {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // Em vez de location.reload(), usamos o redirecionamento para a raiz
    // Isso garante que o sistema de rotas do navegador comece do zero
    location.href = '/';
}

function showConfirm(title, msg) {
    return new Promise((resolve) => {
        elConfirmTitle.textContent = title;
        elConfirmMsg.textContent = msg;
        elConfirmOverlay.classList.remove('hidden');
        
        elConfirmYes.onclick = () => { elConfirmOverlay.classList.add('hidden'); resolve(true); };
        elConfirmNo.onclick = () => { elConfirmOverlay.classList.add('hidden'); resolve(false); };
    });
}

async function saveProfile() {
    if (!currentUser) return;
    elSaveProfile.disabled = true;
    const newUsername = "@" + elProfileUser.value.trim().replace('@', '');
    const newEmail = elProfileEmail.value.trim();
    
    // Check uniqueness (Removed 15 days restriction for testing as requested)
    const { data: profile } = await db.from('user_profiles').select('username').eq('id', currentUser.id).single();
    const currentUsername = profile ? profile.username : null;

    if (newUsername !== currentUsername) {
        // Uniquess test
        const { data: taken } = await db.from('user_profiles').select('id').eq('username', newUsername).single();
        if (taken) { alert("Este nome já está em uso!"); elSaveProfile.disabled = false; return; }
    }

    // Updates
    const updates = { id: currentUser.id, username: newUsername };
    const { error: saveError } = await db.from('user_profiles').upsert(updates);
    
    if (saveError) {
        alert("Erro ao salvar perfil no banco de dados: " + saveError.message);
        elSaveProfile.disabled = false;
        return;
    }
    
    // Update local UI immediately
    myUsername = newUsername;
    localStorage.setItem('battlerps-user-handle', newUsername);
    if(elP1Label) elP1Label.textContent = newUsername;
    
    if (newEmail !== currentUser.email) {
        const { error } = await db.auth.updateUser({ email: newEmail });
        if (error) alert("Erro ao atualizar e-mail: " + error.message);
    }

    elProfileUser.readOnly = true; elProfileUser.classList.add('readonly-input'); elProfileUser.classList.remove('edit-active');
    elProfileEmail.readOnly = true; elProfileEmail.classList.add('readonly-input'); elProfileEmail.classList.remove('edit-active');

    showView('game-screen'); // Changed from elProfileOverlay.classList.add('hidden');
    elSaveProfile.disabled = false;
    
    // Animating success toast for 1.5s
    elToastSuccess.classList.remove('hidden', 'hide-toast');
    setTimeout(() => {
        elToastSuccess.classList.add('hide-toast');
        setTimeout(() => elToastSuccess.classList.add('hidden'), 300);
    }, 1500);
}

function unlockField(el) {
    el.readOnly = false;
    el.classList.remove('readonly-input');
    el.classList.add('edit-active');
    el.style.color = 'var(--on-surface)';
    el.focus();
}

async function requestPasswordChange() {
    const ok = await showConfirm("SENHA", "Deseja receber um link de redefinição no seu e-mail?");
    if (ok) {
        const { error } = await db.auth.resetPasswordForEmail(currentUser.email);
        if (error) alert("Erro: " + error.message); // Custom alert can be next
        else alert("Link enviado! Verifique sua caixa de entrada.");
    }
}

async function uploadAvatar(file) {
    if (!currentUser) return;
    const fileExt = file.name.split('.').pop();
    const fileName = `${currentUser.id}-${Math.random()}.${fileExt}`;

    const { data, error: uploadError } = await db.storage.from('avatars').upload(fileName, file);
    if (uploadError) {
        if (uploadError.message === 'Bucket not found') {
            showConfirm("STORAGE", "Bucket 'avatars' não encontrado. Crie-o no Supabase como Público.");
        } else {
            alert("Erro no upload: " + uploadError.message);
        }
        return;
    }

    const { data: { publicUrl } } = db.storage.from('avatars').getPublicUrl(fileName);
    await db.from('user_profiles').update({ avatar_url: publicUrl }).eq('id', currentUser.id);
    myAvatarUrl = publicUrl;
    elP1Avatar.src = publicUrl;
    elProfilePreview.src = publicUrl;
}

async function init() {
    applyLanguage(currentLang);
    updateScoreUI();
    elMusicSlider.value = currentVolumeMusic;
    elSfxSlider.value = currentVolumeSfx;
    applyVolumeMusic(currentVolumeMusic);
    applyVolumeSfx(currentVolumeSfx);
    updateVolumeIconMusic(currentVolumeMusic);
    updateVolumeIconSfx(currentVolumeSfx);

    const unlockAudio = () => {
        if (elMusic.paused && currentVolumeMusic > 0) {
            elMusic.play().catch(e => console.log('Music unlock retry', e));
        }
        // Tenta dar play em todos os SFX (silenciados) para desbloquear context
        const audios = document.querySelectorAll('audio');
        audios.forEach(a => { if(a.paused && a.id !== 'bg-music') { a.play().then(()=>a.pause()).catch(()=>{}); } });
    };

    ['click', 'touchstart', 'pointerdown'].forEach(evt => {
        document.body.addEventListener(evt, unlockAudio, { once: true });
    });

    // Initial Auth Check
    await checkUser();

    // Listen for Auth changes
    db.auth.onAuthStateChange(async (event, session) => {
        console.log("Auth Event:", event);
        
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
            await handleAuthTransition(session);
        } else if (event === 'SIGNED_OUT') {
            await handleAuthTransition(null);
        } else if (event === 'PASSWORD_RECOVERY') {
            // Mostrar formulário de nova senha
            showView('auth-view');
            if (elAuthFormContainer) elAuthFormContainer.classList.add('hidden');
            if (elAuthTabsGroup) elAuthTabsGroup.classList.add('hidden');
            if (elAuthUpdatePasswordContainer) elAuthUpdatePasswordContainer.classList.remove('hidden');
        }
    });

    // Event Delegation for Forgot Password & Update Password
    const elBtnForgot = document.getElementById('btn-forgot-password');
    if (elBtnForgot) {
        elBtnForgot.onclick = async () => {
            const email = elEmailInput.value.trim();
            if (!email) return alert("Digite seu e-mail primeiro");
            
            const { error } = await db.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin
            });
            if (error) alert("Erro: " + error.message);
            else alert("Link de recuperação enviado para " + email);
        };
    }

    const elBtnUpdateSubmit = document.getElementById('btn-update-password-submit');
    const elUpdatePassInput = document.getElementById('update-password');
    if (elBtnUpdateSubmit) {
        elBtnUpdateSubmit.onclick = async () => {
            const newPassword = elUpdatePassInput.value.trim();
            if (newPassword.length < 6) return alert("A senha deve ter pelo menos 6 caracteres");
            
            const { error } = await db.auth.updateUser({ password: newPassword });
            if (error) alert("Erro ao atualizar senha: " + error.message);
            else {
                alert("Senha atualizada com sucesso!");
                if (elAuthUpdatePasswordContainer) elAuthUpdatePasswordContainer.classList.add('hidden');
                showView('game-screen');
                location.reload();
            }
        };
    }

    // Fallback/Guest Profile Logic
    if (!currentUser) {
        const { data } = await db.from('user_profiles').select('balance, username, avatar_url').eq('wallet_address', currentWallet).single();
        
        // FORÇAR PADRÃO PARA GUESTS (NÃO LOGADOS)
        myUsername = '@YOU';
        myAvatarUrl = 'images/player_default.png';
        
        if (data) {
            updateBalance(data.balance);
            // Ignoramos nome/avatar salvos no guest profile para manter o estado "bloqueado"
        } else {
            const initial = 1000.00;
            await db.from('user_profiles').upsert([{ wallet_address: currentWallet, balance: initial }], { onConflict: 'wallet_address' });
            updateBalance(initial);
        }

        if (elP1Label) elP1Label.textContent = myUsername;
        if (elP1Avatar) elP1Avatar.src = myAvatarUrl;
    }
    
    // EXTREMELY CRITICAL: Show the arena by default!
    hideAllViews();
    showView('game-screen');
    if (elAuthView) elAuthView.classList.add('hidden');
    if (elUsernameOverlay) elUsernameOverlay.classList.add('hidden');
}

async function saveUsername() {
    playSfx(elSfxClick);
    let raw = elUsernameInput.value.trim();
    const dic = translations[currentLang];

    if (raw.length < 3) {
        showError(dic['name-short']);
        return;
    }

    const finalHandle = raw.startsWith('@') ? raw : '@' + raw;
    elSaveUsername.disabled = true;
    elSaveUsername.textContent = dic['joining'];

    // Check if name is taken
    const { data: takenCheck } = await db.from('user_profiles').select('wallet_address').eq('username', finalHandle).single();
    if (takenCheck && takenCheck.wallet_address !== currentWallet) {
        showError(dic['name-taken']);
        elSaveUsername.disabled = false;
        elSaveUsername.textContent = 'JOIN ARENA';
        return;
    }

    const { error } = await db.from('user_profiles').update({ username: finalHandle }).eq('wallet_address', currentWallet);
    if (error) {
        showError(dic['name-error']);
        elSaveUsername.disabled = false;
        elSaveUsername.textContent = 'JOIN ARENA';
        return;
    }

    myUsername = finalHandle;
    localStorage.setItem('battlerps-user-handle', myUsername);
    elP1Label.textContent = myUsername;
    elUsernameOverlay.classList.add('hidden');

    if (gameMode === 'pvp') {
        startPvPDiscovery();
    }
}

function showError(txt) {
    elUsernameError.textContent = txt;
    elUsernameError.classList.remove('hidden');
}

function startPvPCutdown() {
    if (countdownInterval) clearInterval(countdownInterval);
    currentTime = 5;

    // Mostra o timer no lado de quem ainda NÃO jogou
    // firstPlayedSide indica quem jogou PRIMEIRO:
    //   'local'  = eu joguei primeiro  → oponente ainda não jogou → timer no P2
    //   'remote' = oponente jogou primeiro → eu ainda não joguei → timer no P1
    const showP1 = (firstPlayedSide === 'remote');
    const showP2 = (firstPlayedSide === 'local');

    elP1Timer.classList.toggle('hidden', !showP1);
    elP2Timer.classList.toggle('hidden', !showP2);
    elP1Timer.textContent = currentTime + 's';
    elP2Timer.textContent = currentTime + 's';

    if (firstPlayedSide === 'remote') elPvpText.textContent = translations[currentLang]['opponent-played'];
    countdownInterval = setInterval(() => {
        currentTime--;
        elP1Timer.textContent = currentTime + 's';
        elP2Timer.textContent = currentTime + 's';
        if (currentTime <= 0) {
            clearInterval(countdownInterval);
            handleTimeout();
        }
    }, 1000);
}

function handleTimeout() {
    elP1Timer.classList.add('hidden');
    elP2Timer.classList.add('hidden');
    if (myMove && !pvpMoveReceived) {
        botMove = 'rock'; processPayout(false, true);
    } else if (!myMove && pvpMoveReceived) {
        myMove = 'rock'; botMove = pvpMoveReceived; processPayout(true, false);
    }
}

function stopCountdown() {
    if (countdownInterval) clearInterval(countdownInterval);
    elP1Timer.classList.add('hidden');
    elP2Timer.classList.add('hidden');
}

function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('battlerps-lang', lang);
    elLangTrigger.textContent = langEmojis[lang];
    elLangDropdown.classList.remove('active');
    const dic = translations[lang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dic[key]) el.textContent = dic[key];
    });
    if (myUsername) elP1Label.textContent = myUsername;
    updatePhaseText();
}

function updatePhaseText() {
    const dic = translations[currentLang];
    if (phase === 'COMMIT') elPhase.textContent = dic['phase-committing'];
    else if (phase === 'REVEAL') elPhase.textContent = dic['phase-reveal'];
    else if (phase === 'BATTLE') elPhase.textContent = dic['phase-battle'];
    else if (phase === 'RESULT') elPhase.textContent = dic['phase-over'];
}

function updateBalance(val) {
    balance = parseFloat(val) || 0;
    if (elBalance) elBalance.textContent = formatJK(balance);
    if (elShopBalance) elShopBalance.textContent = formatJK(balance);
    
    // Sync header chip colors
    const applyChipClass = (chip) => {
        if (!chip) return;
        chip.classList.remove('positive', 'empty', 'fictitious');
        if (balance <= 0) chip.classList.add('empty');
        else if (currentUser) chip.classList.add('positive');
        else chip.classList.add('fictitious');
    };
    applyChipClass(elBalanceChip);
    applyChipClass(elShopBalanceChip);

    // Atualiza chip da carteira PvP (P1) com texto e cor
    if (elPvpWalletP1) {
        elPvpWalletP1.textContent = formatJK(balance);
        applyPvpWalletColor(elPvpWalletP1, balance, !!currentUser);
    }

    // Se estiver em PvP com oponente, avisa o oponente do novo saldo
    if (gameMode === 'pvp' && partnerId && pvpChannel) {
        pvpChannel.send({
            type: 'broadcast',
            event: 'balance-update',
            payload: { from: currentWallet, balance: balance, isUser: !!currentUser }
        });
    }
}

// Aplica a cor padronizada ao chip de carteira PvP
function applyPvpWalletColor(chip, bal, isUser) {
    chip.classList.remove('pvp-wallet-positive', 'pvp-wallet-fictitious', 'pvp-wallet-empty');
    if (bal <= 0) chip.classList.add('pvp-wallet-empty');
    else if (isUser) chip.classList.add('pvp-wallet-positive');
    else chip.classList.add('pvp-wallet-fictitious');
}

function updateScoreUI() {
    elScoreWin.textContent = scoreWins;
    elScoreDraw.textContent = scoreDraws;
    elScoreLoss.textContent = scoreLosses;
}

function triggerFloatingPayout(amount, type) {
    const float = document.createElement('div');
    float.className = 'floating-payout';
    float.textContent = (amount > 0 ? '+' : '-') + formatJK(Math.abs(amount));
    float.classList.add(type === 'win' ? 'text-win' : 'text-loss');
    float.style.left = '50%'; float.style.top = '45%';
    document.body.appendChild(float);
    setTimeout(() => float.remove(), 1200);
}

async function setMode(mode) {
    playSfx(elSfxClick);
    gameMode = mode;
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.mode === mode));
    if (mode === 'pvp') {
        /* 
        if (!currentUser) {
             // Redirecionar para login ou mostrar modal de auth (requisito 3 de entrega)
             alert("Acesse sua conta para jogar PVP Online!");
             document.getElementById('auth-overlay').classList.remove('hidden');
             return;
        }
        */
        /*
        if (!myUsername) {
            elUsernameOverlay.classList.remove('hidden');
            return;
        }
        */
        // Zerar placar ao iniciar modo PvP
        scoreWins = 0; scoreDraws = 0; scoreLosses = 0;
        elScoreWin.textContent = 0; elScoreDraw.textContent = 0; elScoreLoss.textContent = 0;
        localStorage.setItem('battlerps-score-wins', 0);
        localStorage.setItem('battlerps-score-draws', 0);
        localStorage.setItem('battlerps-score-losses', 0);

        elPvpStatus.classList.remove('hidden');
        startPvPDiscovery();
    } else {
        if (pvpDiscoveryInterval) clearInterval(pvpDiscoveryInterval);
        elPvpStatus.classList.add('hidden');
        elP2Label.textContent = translations[currentLang]['p2-label'];
        // Restaura avatar do bot e remove estado de busca
        elP2Avatar.closest('.avatar-box').classList.remove('searching');
        elP2Avatar.src = 'images/warrior_bot.png';
        if (pvpChannel) pvpChannel.unsubscribe();
        elUsernameOverlay.classList.add('hidden');
    }
}

// Volta ao estado de busca (antena) — usado quando oponente sai
function resetToSearching() {
    const dic = translations[currentLang];
    partnerId = null;
    partnerName = null;
    pvpMoveReceived = null;
    firstPlayedSide = null;
    botMove = null;
    myMove = null;
    phase = 'COMMIT'; updatePhaseText();

    // Reabilita controles de jogada
    document.getElementById('move-controls').style.pointerEvents = 'auto';
    document.getElementById('move-controls').style.opacity = '1';
    document.querySelectorAll('.rps-btn').forEach(b => b.classList.remove('selected'));
    elResultBanner.classList.add('hidden');

    // Mostra antena com delay mínimo de 5s
    elP2Avatar.src = 'images/satellite.png';
    elP2Avatar.closest('.avatar-box').classList.add('searching');
    elP2Label.textContent = dic['awaiting'];
    elP1Status.textContent = dic['awaiting'];
    elP1Status.style.color = 'var(--on-surface-variant)';
    elP2Status.textContent = dic['awaiting'];
    elP2Status.style.color = 'var(--on-surface-variant)';
    elPvpWalletP2.textContent = 'JK$ --'; // Reset P2 chip
    elPvpWalletP2.style.opacity = '0.4';

    // Define o momento mínimo em que poderemos aceitar um novo oponente (agora + 5s)
    pvpSearchReadyAt = Date.now() + 5000;

    // Reinicia o loop de discovery
    if (pvpDiscoveryInterval) clearInterval(pvpDiscoveryInterval);
    const sendDiscovery = () => {
        if (!partnerId) {
            pvpChannel.send({
                type: 'broadcast',
                event: 'discovery',
                payload: { wallet: currentWallet, username: myUsername, avatar: myAvatarUrl, balance: balance }
            });
        } else {
            clearInterval(pvpDiscoveryInterval);
        }
    };
    sendDiscovery();
    pvpDiscoveryInterval = setInterval(sendDiscovery, 2000);
}

function startPvPDiscovery() {
    if (pvpDiscoveryInterval) clearInterval(pvpDiscoveryInterval);
    if (pvpChannel) pvpChannel.unsubscribe();

    const dic = translations[currentLang];
    elPvpStatus.classList.remove('hidden');
    elPvpText.textContent = dic['searching'];
    elP2Label.textContent = dic['awaiting'];
    // Avatar da antena: sinaliza busca
    elP2Avatar.src = 'images/satellite.png';
    elP2Avatar.closest('.avatar-box').classList.add('searching');
    // Carteiras: mostra P1, oculta P2 até encontrar oponente
    elPvpWalletP1.textContent = formatJK(balance);
    applyPvpWalletColor(elPvpWalletP1, balance, !!currentUser);
    elPvpWalletP2.textContent = 'JK$ --';
    elPvpWalletP2.style.opacity = '0.4';
    elPvpWalletP2.classList.remove('pvp-wallet-positive', 'pvp-wallet-fictitious', 'pvp-wallet-empty');
    partnerId = null;
    partnerName = null;

    pvpChannel = db.channel('lobby', { config: { broadcast: { self: false } } });
    pvpChannel
        .on('broadcast', { event: 'discovery' }, ({ payload }) => {
            if (!partnerId && payload.wallet !== currentWallet && Date.now() >= pvpSearchReadyAt) {
                console.log("Opponent discovery received:", payload.username);
                partnerId = payload.wallet;
                partnerName = payload.username || dic['pvp-mode'];
                elP2Label.textContent = partnerName;
                // Atualiza avatar: remove antena, mostra avatar do oponente
                elP2Avatar.closest('.avatar-box').classList.remove('searching');
                if (payload.avatar) elP2Avatar.src = payload.avatar;
                elPvpText.textContent = dic['opponent-found'];
                if (payload.balance !== undefined) {
                    elPvpWalletP2.textContent = formatJK(payload.balance);
                    elPvpWalletP2.style.opacity = '1';
                    applyPvpWalletColor(elPvpWalletP2, payload.balance, payload.isUser);
                }
                
                // Responder com ACK para confirmar a conexão
                pvpChannel.send({ 
                    type: 'broadcast', 
                    event: 'ack', 
                    payload: { to: partnerId, from: currentWallet, username: myUsername, avatar: myAvatarUrl, balance: balance, isUser: !!currentUser } 
                });
                
                if (pvpDiscoveryInterval) clearInterval(pvpDiscoveryInterval);
            }
        })
        .on('broadcast', { event: 'ack' }, ({ payload }) => {
            if (!partnerId && payload.to === currentWallet && Date.now() >= pvpSearchReadyAt) {
                console.log("Opponent ack received:", payload.username);
                partnerId = payload.from;
                partnerName = payload.username || dic['pvp-mode'];
                elP2Label.textContent = partnerName;
                // Atualiza avatar: remove antena, mostra avatar do oponente
                elP2Avatar.closest('.avatar-box').classList.remove('searching');
                if (payload.avatar) elP2Avatar.src = payload.avatar;
                elPvpText.textContent = dic['opponent-found'];
                if (payload.balance !== undefined) {
                    elPvpWalletP2.textContent = formatJK(payload.balance);
                    elPvpWalletP2.style.opacity = '1';
                }
                
                if (pvpDiscoveryInterval) clearInterval(pvpDiscoveryInterval);
            }
        })
        .on('broadcast', { event: 'move' }, ({ payload }) => {
            if (payload.from === partnerId) {
                console.log("Opponent move received!");
                pvpMoveReceived = payload.move;
                elP2Status.textContent = dic['ready'];
                elP2Status.style.color = 'var(--secondary)';
                
                if (myMove) {
                    stopCountdown();
                    botMove = pvpMoveReceived;
                    phase = 'REVEAL'; updatePhaseText();
                    document.getElementById('move-controls').style.pointerEvents = 'none';
                    document.getElementById('move-controls').style.opacity = '0.5';
                    setTimeout(reveal, 500);
                } else if (!firstPlayedSide) {
                    firstPlayedSide = 'remote';
                    startPvPCutdown();
                }
            }
        })
        .on('broadcast', { event: 'disconnect' }, ({ payload }) => {
            // Oponente saiu — volta à busca com animação de antena
            if (payload.wallet === partnerId) {
                console.log('Oponente desconectado:', payload.wallet);
                resetToSearching();
            }
        })
        .on('broadcast', { event: 'balance-update' }, ({ payload }) => {
            // Atualiza carteira do oponente em tempo real
            if (payload.from === partnerId) {
                elPvpWalletP2.textContent = formatJK(payload.balance);
                elPvpWalletP2.style.opacity = '1';
                applyPvpWalletColor(elPvpWalletP2, payload.balance, payload.isUser);
            }
        })
        .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
                console.log("Subscribed to lobby, starting discovery loop...");
                // Loop de busca: envia discovery a cada 2 segundos até achar parceiro
                const sendDiscovery = () => {
                   if (!partnerId) {
                       pvpChannel.send({ 
                           type: 'broadcast', 
                           event: 'discovery', 
                           payload: { wallet: currentWallet, username: myUsername, avatar: myAvatarUrl, balance: balance, isUser: !!currentUser } 
                       });
                   } else {
                       if (pvpDiscoveryInterval) clearInterval(pvpDiscoveryInterval);
                   }
                };
                sendDiscovery();
                pvpDiscoveryInterval = setInterval(sendDiscovery, 2000);
            }
        });

    // Avisa o canal quando esta aba fechar / recarregar
    const sendDisconnect = () => {
        if (pvpChannel && partnerId) {
            pvpChannel.send({ type: 'broadcast', event: 'disconnect', payload: { wallet: currentWallet } });
        }
    };
    window.addEventListener('beforeunload', sendDisconnect);
    window.addEventListener('pagehide', sendDisconnect);
}

function selectMove(move, btn) {
    if (phase !== 'COMMIT' || (gameMode === 'pvp' && !myUsername)) return;
    if (gameMode === 'pvp' && !partnerId) return;
    playSfx(elSfxClick);
    myMove = move;
    const dic = translations[currentLang];
    document.querySelectorAll('.rps-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    elP1Status.textContent = dic['locked'];
    elP1Status.style.color = 'var(--primary)';

    if (gameMode === 'bot') {
        setTimeout(() => {
            botMove = ['rock', 'paper', 'scissors'][Math.floor(Math.random() * 3)];
            elP2Status.textContent = dic['ready'];
            elP2Status.style.color = 'var(--secondary)';
            phase = 'REVEAL'; updatePhaseText();
            document.getElementById('move-controls').style.pointerEvents = 'none';
            document.getElementById('move-controls').style.opacity = '0.5';
            setTimeout(reveal, 500);
        }, 400);
    } else {
        pvpChannel.send({ type: 'broadcast', event: 'move', payload: { from: currentWallet, move: myMove } });
        if (!pvpMoveReceived && !firstPlayedSide) {
            firstPlayedSide = 'local';
            startPvPCutdown();
        } else if (pvpMoveReceived) {
            stopCountdown();
            botMove = pvpMoveReceived;
            phase = 'REVEAL'; updatePhaseText();
            document.getElementById('move-controls').style.pointerEvents = 'none';
            document.getElementById('move-controls').style.opacity = '0.5';
            setTimeout(reveal, 500);
        }
    }
}

function reveal() {
    phase = 'BATTLE'; updatePhaseText();
    overlay.classList.remove('hidden');
    h1.innerHTML = `<img src="${moveUris.rock}" class="anim-emoji-img">`; h2.innerHTML = `<img src="${moveUris.rock}" class="anim-emoji-img">`;
    h1.style.animation = 'hand-bounce-p1 0.4s ease-in-out infinite';
    h2.style.animation = 'hand-bounce-p2 0.4s ease-in-out infinite';
    playSfx(elSfxBounce);
    setTimeout(() => playSfx(elSfxBounce), 400);
    setTimeout(() => playSfx(elSfxBounce), 800);
    setTimeout(() => {
        h1.style.animation = 'none'; h2.style.animation = 'none';
        h1.innerHTML = myMove ? `<img src="${moveUris[myMove]}" class="anim-emoji-img">` : `<img src="${moveUris.unknown}" class="anim-emoji-img">`;
        h2.innerHTML = botMove ? `<img src="${moveUris[botMove]}" class="anim-emoji-img">` : `<img src="${moveUris.unknown}" class="anim-emoji-img">`;
        playSfx(elSfxReveal);
        setTimeout(() => { overlay.classList.add('hidden'); processPayout(); }, 1500);
    }, 1200);
}

function processPayout(forcedLoss = false, forcedWin = false) {
    elReconMsg.classList.remove('hidden');
    setTimeout(async () => {
        let result;
        if (forcedLoss) result = { name: translations[currentLang]['timeout'], winner: 2, mult: 0 };
        else if (forcedWin) result = { name: translations[currentLang]['win'], winner: 1, mult: 1.95 };
        else result = determineWinner(myMove, botMove);
        elReconMsg.classList.add('hidden');
        let newBalance = balance;
        if (gameMode === 'pvp') {
            if (result.winner === 1) { newBalance += 10; triggerFloatingPayout(10, 'win'); }
            else if (result.winner === 2) { newBalance -= 10; triggerFloatingPayout(-10, 'loss'); }
            else if (result.winner === 0) { newBalance -= 5; triggerFloatingPayout(-5, 'loss'); }
            
            setTimeout(async () => {
                // Ledger: Sistema de rastreabilidade (Transações JK$)
                if (currentUser) {
                    if (result.winner === 1) {
                        await db.from('transactions').insert({ user_id: currentUser.id, amount: 10, type: 'game_win', description: 'Vitória no Joken PVP' });
                    } else if (result.winner === 2) {
                        await db.from('transactions').insert({ user_id: currentUser.id, amount: -10, type: 'game_bet', description: 'Derrota no Joken PVP' });
                    } else if (result.winner === 0) {
                        await db.from('transactions').insert({ user_id: currentUser.id, amount: -5, type: 'game_bet', description: 'Empate no Joken PVP' });
                    }
                }
                updateBalance(newBalance);
                await db.from('user_profiles').update({ balance: newBalance }).eq('wallet_address', currentWallet);
                await db.from('matches').insert([{ player_move: myMove, bot_move: botMove, outcome: result.name, stake: 10, payout: result.winner === 1 ? 10 : 0 }]);
            }, 800);
        } else {
            // Em modo BOT, apenas registramos a partida sem alterar saldos
            setTimeout(async () => {
                await db.from('matches').insert([{ player_move: myMove, bot_move: botMove, outcome: result.name, stake: 0, payout: 0 }]);
            }, 800);
        }
        showResult(result);
    }, 1200);
}

function determineWinner(p1, p2) {
    const dic = translations[currentLang];
    if (p1 === p2) return { name: dic['draw'], winner: 0, mult: 1 };
    if ((p1 === 'rock' && p2 === 'scissors') || (p1 === 'paper' && p2 === 'rock') || (p1 === 'scissors' && p2 === 'paper')) return { name: dic['win'], winner: 1, mult: 1.95 };
    return { name: dic['loss'], winner: 2, mult: 0 };
}

function showResult(result) {
    phase = 'RESULT'; updatePhaseText();
    elResultBanner.classList.remove('hidden');
    elWinnerText.textContent = result.name;
    elWinnerText.className = '';
    if (result.winner === 1) {
        elWinnerText.classList.add('text-win');
        playSfx(elSfxWin);
        scoreWins++;
    }
    else if (result.winner === 2) {
        elWinnerText.classList.add('text-loss');
        playSfx(elSfxLoss);
        scoreLosses++;
    }
    else {
        elWinnerText.classList.add('text-draw');
        playSfx(elSfxDraw);
        scoreDraws++;
    }
    updateScoreUI();
    localStorage.setItem('battlerps-score-wins', scoreWins);
    localStorage.setItem('battlerps-score-draws', scoreDraws);
    localStorage.setItem('battlerps-score-losses', scoreLosses);
    setTimeout(resetMatch, 3000);
}

function resetMatch() {
    const dic = translations[currentLang];
    elResultBanner.classList.add('hidden');
    document.getElementById('move-controls').style.pointerEvents = 'auto';
    document.getElementById('move-controls').style.opacity = '1';
    document.querySelectorAll('.rps-btn').forEach(b => b.classList.remove('selected'));
    phase = 'COMMIT'; updatePhaseText();
    elP1Status.textContent = dic['awaiting']; elP1Status.style.color = 'var(--on-surface-variant)';
    elP2Status.textContent = gameMode === 'bot' ? dic['thinking'] : dic['awaiting']; elP2Status.style.color = 'var(--on-surface-variant)';
    pvpMoveReceived = null; firstPlayedSide = null; botMove = null; myMove = null;
    elPvpText.textContent = translations[currentLang]['opponent-found'];
}

function playSfx(el) {
    if (!el) return;
    el.currentTime = 0;
    el.play().catch(e => console.log("SFX error:", e));
}

function toggleMusic() {
    playSfx(elSfxClick);
    if (elMusicSlider.value > 0) {
        lastVolumeMusic = elMusicSlider.value;
        elMusicSlider.value = 0;
    } else {
        elMusicSlider.value = lastVolumeMusic;
    }
    applyVolumeMusic(parseFloat(elMusicSlider.value));
    if (elMusicSlider.value > 0) {
        elMusic.play().catch(e => console.log("Music error:", e));
    } else {
        elMusic.pause();
    }
}

function toggleSfx() {
    playSfx(elSfxClick);
    if (elSfxSlider.value > 0) {
        lastVolumeSfx = elSfxSlider.value;
        elSfxSlider.value = 0;
    } else {
        elSfxSlider.value = lastVolumeSfx;
    }
    applyVolumeSfx(parseFloat(elSfxSlider.value));
}

function applyVolumeMusic(vol) {
    currentVolumeMusic = vol;
    elMusic.volume = vol;
    elMusic.muted = (vol <= 0);
    updateVolumeIconMusic(vol);
    localStorage.setItem('battlerps-volume-music', vol);
}

function applyVolumeSfx(vol) {
    currentVolumeSfx = vol;
    const audios = document.querySelectorAll('audio:not(#bg-music)');
    audios.forEach(a => {
        a.volume = vol;
        a.muted = (vol <= 0);
    });
    updateVolumeIconSfx(vol);
    localStorage.setItem('battlerps-volume-sfx', vol);
}

function updateVolumeIconMusic(vol) {
    if (vol == 0) elMusicBtn.textContent = '🔇';
    else if (vol < 0.5) elMusicBtn.textContent = '🔉';
    else elMusicBtn.textContent = '🎵';
}

function updateVolumeIconSfx(vol) {
    if (vol == 0) elSfxBtn.textContent = '🔇';
    else if (vol < 0.5) elSfxBtn.textContent = '🔉';
    else elSfxBtn.textContent = '🔊';
}

// Events
elVsButton.onclick = triggerMatchReset;

function triggerMatchReset() {
    playSfx(elSfxClick);

    if (gameMode === 'pvp') {
        // Modo PvP: avisa oponente atual, zera placar e inicia nova busca
        if (pvpChannel && partnerId) {
            pvpChannel.send({ type: 'broadcast', event: 'disconnect', payload: { wallet: currentWallet } });
        }

        // Zera placar
        scoreWins = 0; scoreDraws = 0; scoreLosses = 0;
        elScoreWin.textContent = 0; elScoreDraw.textContent = 0; elScoreLoss.textContent = 0;
        localStorage.setItem('battlerps-score-wins', 0);
        localStorage.setItem('battlerps-score-draws', 0);
        localStorage.setItem('battlerps-score-losses', 0);

        // Reabilita controles e reinicia busca com antena
        stopCountdown();
        resetMatch();
        startPvPDiscovery();
        return;
    }

    // Modo BOT: contagem regressiva 3-2-1-GO normal
    elCountdownOverlay.style.display = 'flex';
    elCountdownOverlay.classList.remove('hidden');
    
    let count = 3;
    elCountdownText.textContent = count;
    document.getElementById('move-controls').style.pointerEvents = 'none';

    const intv = setInterval(() => {
        count--;
        if (count > 0) {
            elCountdownText.textContent = count;
        } else if (count === 0) {
            elCountdownText.textContent = "GO!";
            scoreWins = 0; scoreDraws = 0; scoreLosses = 0;
            elScoreWin.textContent = 0; elScoreDraw.textContent = 0; elScoreLoss.textContent = 0;
            localStorage.setItem('battlerps-score-wins', 0);
            localStorage.setItem('battlerps-score-draws', 0);
            localStorage.setItem('battlerps-score-losses', 0);
            resetMatch();
        } else {
            clearInterval(intv);
            elCountdownOverlay.classList.add('hidden');
            elCountdownOverlay.style.display = 'none';
        }
    }, 900);
}

elSaveUsername.onclick = saveUsername;
document.querySelectorAll('.rps-btn').forEach(btn => btn.onclick = () => selectMove(btn.dataset.move, btn));
document.querySelectorAll('.lang-btn').forEach(btn => btn.onclick = (e) => { e.stopPropagation(); playSfx(elSfxClick); applyLanguage(btn.dataset.lang); });
elLangTrigger.onclick = (e) => { e.stopPropagation(); playSfx(elSfxClick); elLangDropdown.classList.toggle('active'); if(elAudioMenu) elAudioMenu.classList.remove('active'); };
if(elMenuBtn) elMenuBtn.onclick = (e) => { e.stopPropagation(); playSfx(elSfxClick); elAudioMenu.classList.toggle('active'); elLangDropdown.classList.remove('active'); };
elMusicBtn.onclick = (e) => { e.stopPropagation(); toggleMusic(); };
elSfxBtn.onclick = (e) => { e.stopPropagation(); toggleSfx(); };
elMusicSlider.oninput = (e) => applyVolumeMusic(parseFloat(e.target.value));
elSfxSlider.oninput = (e) => applyVolumeSfx(parseFloat(e.target.value));
if (elLoginTrigger) elLoginTrigger.onclick = async () => {
    if (currentUser) { 
        const ok = await showConfirm("LOGOUT", "Sair da conta?");
        if(ok) signOut(); 
    }
    else showView('auth-view');
};
if (elAuthGoogle) elAuthGoogle.onclick = signInWithGoogle;
if (elAuthEmailBtn) elAuthEmailBtn.onclick = signInWithEmail;
if (elTabLogin) elTabLogin.onclick = () => switchAuthMode('login');
if (elTabSignup) elTabSignup.onclick = () => switchAuthMode('signup');

if (elProfileTrigger) elProfileTrigger.onclick = () => {
    if (elAudioMenu) elAudioMenu.classList.remove('active');
    if (currentUser) showView('profile-view');
    else showView('auth-view');
};

if (elSaveProfile) elSaveProfile.onclick = saveProfile;
if (elAvatarUpload) elAvatarUpload.onchange = (e) => { if (e.target.files[0]) uploadAvatar(e.target.files[0]); };
if (elEditUserBtn) elEditUserBtn.onclick = () => unlockField(elProfileUser);
if (elEditEmailBtn) elEditEmailBtn.onclick = () => unlockField(elProfileEmail);
if (elChangePassBtn) elChangePassBtn.onclick = () => {
    if (elAudioMenu) elAudioMenu.classList.remove('active');
    if (!currentUser) showView('auth-view');
    else requestPasswordChange();
};

document.querySelectorAll('.mode-btn').forEach(btn => btn.onclick = () => setMode(btn.dataset.mode));
document.addEventListener('click', (e) => { 
    if (elLangDropdown && !elLangDropdown.contains(e.target)) elLangDropdown.classList.remove('active');
    if (elAudioMenu && !elAudioMenu.contains(e.target)) elAudioMenu.classList.remove('active');
});

// --- Navigation & View Switcher ---
const elBtnManual = document.getElementById('btn-manual-trigger');
const elBtnWallet = document.getElementById('btn-wallet-trigger');
const elBtnAdmin = document.getElementById('btn-admin-trigger');
const elManualView = document.getElementById('manual-view');
const elWalletView = document.getElementById('wallet-view');
const elAdminView = document.getElementById('admin-view');
const elBtnCloseManualX = document.getElementById('btn-close-manual-x');
const elBtnCloseManualBottom = document.getElementById('btn-close-manual-bottom');
const elBtnCloseShopX = document.getElementById('btn-close-shop-x');
const elBtnCloseShopBottom = document.getElementById('btn-close-shop-bottom');
const elBtnCloseAdminX = document.getElementById('btn-close-admin-x');
const elBtnCloseAdminBottom = document.getElementById('btn-close-admin-bottom');
const elBtnSaveNewCard = document.getElementById('btn-save-new-card');

// Listeners for triggers
if (elBtnManual) elBtnManual.onclick = () => showView('manual-view');
if (elBtnWallet) elBtnWallet.onclick = () => showView('wallet-view');
if (elBtnAdmin) elBtnAdmin.onclick = () => showView('admin-view');

if (elAuthLogoutBtn) elAuthLogoutBtn.onclick = () => { showView('game-screen'); signOut(); };

// Close Buttons (X and Bottom)
const elBtnCloseProfileX = document.getElementById('btn-close-profile-x');
const elBtnCloseProfileBottom = document.getElementById('btn-close-profile-bottom');
if (elBtnCloseProfileX) elBtnCloseProfileX.onclick = () => showView('game-screen');
if (elBtnCloseProfileBottom) elBtnCloseProfileBottom.onclick = () => showView('game-screen');

document.querySelectorAll('.close-x-btn, .secondary-btn').forEach(btn => {
    if (btn.id && btn.id.includes('close')) {
        btn.onclick = () => showView('game-screen');
    }
});

if (elBtnSaveNewCard) elBtnSaveNewCard.onclick = saveNewCard;

// --- Avatar Store ---
const elBtnStoreTrigger = document.getElementById('btn-store-trigger');
const elBtnOpenAvatarStore = document.getElementById('btn-open-avatar-store');
const elBtnCloseStoreX = document.getElementById('btn-close-store-x');
const elBtnCloseStoreBottom = document.getElementById('btn-close-store-bottom');
const elBtnCloseStoreGame = document.getElementById('btn-close-store-game');
const elBtnSaveNewAvatar = document.getElementById('btn-save-new-avatar');

if (elBtnStoreTrigger) elBtnStoreTrigger.onclick = () => { elAudioMenu.classList.remove('active'); showView('store-view'); loadAvatarStore(); };
if (elBtnOpenAvatarStore) elBtnOpenAvatarStore.onclick = () => { showView('store-view'); loadAvatarStore(); };
if (elBtnCloseStoreX) elBtnCloseStoreX.onclick = () => showView('profile-view');
if (elBtnCloseStoreBottom) elBtnCloseStoreBottom.onclick = () => showView('profile-view');
if (elBtnCloseStoreGame) elBtnCloseStoreGame.onclick = () => showView('game-screen');
if (elBtnSaveNewAvatar) elBtnSaveNewAvatar.onclick = saveNewAvatar;

// Admin tabs
window.switchAdminTab = function(tab) {
    document.getElementById('admin-panel-wallet').classList.toggle('hidden', tab !== 'wallet');
    document.getElementById('admin-panel-avatars').classList.toggle('hidden', tab !== 'avatars');
    document.getElementById('admin-tab-wallet').classList.toggle('active', tab === 'wallet');
    document.getElementById('admin-tab-avatars').classList.toggle('active', tab === 'avatars');
    if (tab === 'avatars') loadAdminAvatars();
};


async function saveNewCard() {
    if (!currentUser || currentUser.email !== 'marcosjscabral@gmail.com') return;
    
    const file = document.getElementById('admin-card-image').files[0];
    const amount = document.getElementById('admin-card-amount').value;
    const price = document.getElementById('admin-card-price').value;
    const msg = document.getElementById('admin-status-msg');

    if (!file || !amount || !price) {
        msg.style.color = 'red';
        msg.textContent = "Preencha todos os campos!";
        return;
    }

    msg.style.color = 'var(--primary)';
    msg.textContent = "🚀 Subindo imagem...";
    
    try {
        const fileName = `${Date.now()}_${file.name}`;
        const { data: uploadData, error: uploadError } = await db.storage
            .from('card-images')
            .upload(fileName, file);

        if (uploadError) throw uploadError;

        const publicUrl = db.storage.from('card-images').getPublicUrl(fileName).data.publicUrl;

        msg.textContent = "✍️ Salvando no banco...";
        const { error: dbError } = await db.from('shop_cards').insert({
            image_url: publicUrl,
            jokens_amount: parseInt(amount),
            price_brl: parseFloat(price),
            created_by: currentUser.id
        });

        if (dbError) throw dbError;

        msg.style.color = 'green';
        msg.textContent = "✨ Sucesso! Card criado.";
        setTimeout(() => { hideAdmin(); loadShop(); }, 1500);
    } catch (err) {
        msg.style.color = 'red';
        msg.textContent = "ERRO: " + err.message;
    }
}

async function loadShop() {
    if (!elShopGrid) return;
    elShopGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999; padding: 40px;">Carregando ofertas...</p>';
    
    try {
        const { data: cards, error } = await db
            .from('shop_cards')
            .select('*')
            .order('jokens_amount', { ascending: true });
        
        if (error) throw error;
        
        if (!cards || cards.length === 0) {
            elShopGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999; padding: 40px;">Nenhuma oferta disponível no momento.</p>';
            return;
        }

        elShopGrid.innerHTML = '';
        cards.forEach(card => {
            const cardEl = document.createElement('div');
            cardEl.className = 'shop-card';
            cardEl.style.backgroundImage = `url('${card.image_url}')`;
            cardEl.title = `Comprar ${card.jokens_amount} JK$`;
            cardEl.onclick = () => buyCard(card.id);
            elShopGrid.appendChild(cardEl);
        });
    } catch (err) {
        console.error("Erro ao carregar loja:", err);
        elShopGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #ef4444; padding: 40px;">Erro ao carregar catálogo. Tente novamente.</p>';
    }
}

async function buyCard(cardId) {
    if (!currentUser) {
        alert("Você precisa estar logado para comprar JK$!");
        return;
    }
    
    // Antigravity Way: Envia apenas ID, backend resolve preço e saldo.
    const { data, error } = await db.rpc('buy_shop_card', { target_card_id: cardId });
    
    if (error) {
        alert("Erro na transação: " + error.message);
    } else if (data.success) {
        alert(`Sucesso! Você adquiriu ${data.amount} JK$.`);
        // O Realtime já atualizará o saldo global, mas atualizamos o visor da loja também
        if (elShopBalance) elShopBalance.textContent = formatJK(balance + data.amount);
    } else {
        alert("Erro: " + data.error);
    }
}

// ===== AVATAR STORE FUNCTIONS =====
let myUnlockedAvatars = [];
let currentStoreTab = 'buy'; // 'buy' or 'owned'

async function switchStoreTab(tab) {
    currentStoreTab = tab;
    document.getElementById('store-tab-buy').classList.toggle('active', tab === 'buy');
    document.getElementById('store-tab-owned').classList.toggle('active', tab === 'owned');
    loadAvatarStore();
}

async function loadAvatarStore() {
    const grid = document.getElementById('avatar-store-grid');
    if (!grid) return;
    if (!currentUser) { grid.innerHTML = '<div class="store-loading">Faça login para ver a loja.</div>'; return; }
    
    grid.innerHTML = '<div class="store-loading">Carregando avatares...</div>';

    // Busca perfil para ver skins desbloqueadas
    const { data: profile } = await db.from('user_profiles').select('unlocked_skins').eq('id', currentUser.id).single();
    myUnlockedAvatars = profile?.unlocked_skins || [];

    const { data: avatars, error } = await db.from('store_avatars').select('*').eq('is_active', true).order('price', { ascending: true });
    if (error || !avatars || avatars.length === 0) {
        grid.innerHTML = '<div class="store-loading">Nenhum avatar disponível ainda.</div>';
        return;
    }

    grid.innerHTML = '';
    
    // Filtro por skins adquiridas se estiver na aba owned
    const filteredAvatars = currentStoreTab === 'owned' 
        ? avatars.filter(av => av.price === 0 || myUnlockedAvatars.includes(av.id))
        : avatars;

    if (filteredAvatars.length === 0) {
        grid.innerHTML = `<div class="store-loading">Você ainda não possui outras skins no momento.</div>`;
        return;
    }

    filteredAvatars.forEach(av => {
        const isSelected = myAvatarUrl === av.image_url;
        const isUnlocked = av.price === 0 || myUnlockedAvatars.includes(av.id);
        
        const card = document.createElement('div');
        card.className = 'avatar-store-card' + (isSelected ? ' selected' : '');
        card.dataset.id = av.id;
        card.dataset.price = av.price;
        
        let priceTag = '';
        if (isUnlocked) {
            priceTag = av.price === 0 ? '<span class="avatar-price-tag free">GRÁTIS</span>' : '<span class="avatar-price-tag unlocked">ADQUIRIDO</span>';
        } else {
            priceTag = `<span class="avatar-price-tag paid">JK$ ${av.price}</span>`;
        }

        card.innerHTML = `
            <span class="avatar-selected-badge">✓ USO</span>
            <img src="${av.image_url}" alt="${av.name}">
            <span class="avatar-store-name">${av.name}</span>
            ${priceTag}
            ${!isUnlocked ? `<button class="avatar-buy-btn" data-id="${av.id}">ADQUIRIR</button>` : ''}
        `;

        card.onclick = (e) => {
            if (e.target.classList.contains('avatar-buy-btn')) return; // handled by button
            if (isUnlocked) selectAvatar(av.image_url, card, av.id);
            else alert('Você precisa adquirir este avatar primeiro!');
        };

        const buyBtn = card.querySelector('.avatar-buy-btn');
        if (buyBtn) {
            buyBtn.onclick = (e) => {
                e.stopPropagation();
                purchaseAvatar(av);
            };
        }

        grid.appendChild(card);
    });
}

async function purchaseAvatar(av) {
    if (!currentUser) return;
    if (balance < av.price) { alert(`Saldo insuficiente! Você precisa de JK$ ${av.price}.`); return; }

    const ok = await showConfirm('ADQUIRIR AVATAR', `Deseja comprar "${av.name}" por JK$ ${av.price}?`);
    if (!ok) return;

    // Process Purchase via Atomic RPC
    const { data, error: rpcErr } = await db.rpc('acquire_avatar', { avatar_id: av.id });

    if (rpcErr) { 
        alert('Erro técnico na transação: ' + rpcErr.message); 
        return; 
    }

    if (!data.success) {
        alert('Falha na compra: ' + data.error);
        return;
    }

    // Update Local State based on server response
    balance = data.new_balance;
    myUnlockedAvatars = [...myUnlockedAvatars, av.id]; // we know it succeeded
    if (elBalance) elBalance.textContent = formatJK(balance);
    if (elBalanceChip) elBalanceChip.textContent = formatJK(balance);
    if (elShopBalance) elShopBalance.textContent = formatJK(balance);

    playSfx(elSfxWin); // reuse win sfx for happy purchase
    loadAvatarStore(); 
    alert(`Parabéns! "${av.name}" agora é seu.`);
}

async function selectAvatar(url, cardEl, avId) {
    if (!currentUser) { alert('Faça login para trocar seu avatar!'); return; }
    
    // Confirmação antes de mudar
    const ok = await showConfirm('NOVO AVATAR', 'Deseja usar este avatar no seu perfil?');
    if (!ok) return;

    playSfx(elSfxClick);

    // Visual feedback imediato
    document.querySelectorAll('.avatar-store-card').forEach(c => c.classList.remove('selected'));
    cardEl.classList.add('selected');

    // Atualiza no banco
    const { error } = await db.from('user_profiles').update({ avatar_url: url }).eq('id', currentUser.id);
    if (error) { alert('Erro ao salvar avatar: ' + error.message); return; }

    // Atualiza localmente
    myAvatarUrl = url;
    if (elP1Avatar) elP1Avatar.src = url;
    if (elProfilePreview) elProfilePreview.src = url;

    // Redireciona para o jogo
    showView('game-screen');

    // Toast de sucesso
    elToastSuccess.textContent = '✅ Avatar atualizado!';
    elToastSuccess.classList.remove('hidden', 'hide-toast');
    setTimeout(() => {
        elToastSuccess.classList.add('hide-toast');
        setTimeout(() => { elToastSuccess.classList.add('hidden'); elToastSuccess.textContent = 'Sucesso!'; }, 300);
    }, 1500);
}

// --- Global State for Admin ---
let editingAvatarId = null;

async function saveNewAvatar() {
    if (!currentUser || currentUser.email !== 'marcosjscabral@gmail.com') return;
    const nameInput = document.getElementById('admin-avatar-name');
    const priceInput = document.getElementById('admin-avatar-price');
    const fileInput = document.getElementById('admin-avatar-image');
    const btn = document.getElementById('btn-save-new-avatar');
    
    const name = nameInput.value.trim();
    const price = parseInt(priceInput.value) || 0;
    const file = fileInput.files[0];

    if (!name) { alert('Informe pelo menos o nome!'); return; }
    if (!editingAvatarId && !file) { alert('Selecione uma imagem para o novo avatar!'); return; }

    btn.disabled = true;
    btn.textContent = 'Processando...';

    try {
        let imageUrl = null;
        if (file) {
            const ext = file.name.split('.').pop();
            const fileName = `avatar_${Date.now()}.${ext}`;
            const { error: uploadErr } = await db.storage.from('avatars').upload(fileName, file);
            if (uploadErr) throw uploadErr;
            const { data: { publicUrl } } = db.storage.from('avatars').getPublicUrl(fileName);
            imageUrl = publicUrl;
        }

        if (editingAvatarId) {
            // UPDATING existing
            const updateData = { name, price };
            if (imageUrl) updateData.image_url = imageUrl;
            
            const { error: dbErr } = await db.from('store_avatars').update(updateData).eq('id', editingAvatarId);
            if (dbErr) throw dbErr;
        } else {
            // INSERTING new
            const { error: dbErr } = await db.from('store_avatars').insert({ name, image_url: imageUrl, price });
            if (dbErr) throw dbErr;
        }

        editingAvatarId = null;
        nameInput.value = '';
        priceInput.value = '0';
        fileInput.value = '';
        btn.textContent = '✅ Sucesso!';
        setTimeout(() => { btn.textContent = 'SALVAR'; btn.disabled = false; }, 1500);
        loadAdminAvatars();
    } catch (err) {
        alert('Erro: ' + err.message);
        btn.textContent = 'SALVAR';
        btn.disabled = false;
    }
}

async function loadAdminAvatars() {
    const list = document.getElementById('admin-avatar-list');
    if (!list) return;
    list.innerHTML = '<p style="color:#aaa;font-size:0.85rem;">Carregando...</p>';

    const { data, error } = await db.from('store_avatars').select('*').order('created_at', { ascending: false });
    if (error || !data || data.length === 0) {
        list.innerHTML = '<p style="color:#aaa;font-size:0.85rem;">Nenhum avatar cadastrado ainda.</p>';
        return;
    }

    list.innerHTML = '';
    data.forEach(av => {
        const item = document.createElement('div');
        item.className = 'avatar-admin-item';
        item.innerHTML = `
            <img src="${av.image_url}" alt="${av.name}">
            <div class="avatar-admin-info">
                <strong>${av.name}</strong>
                <span>JK$ ${av.price || 0} | ${av.is_active ? '✅ Ativo' : '🔴 Inativo'}</span>
            </div>
            <div class="admin-actions">
                <button class="admin-action-btn admin-edit-btn" onclick="editAvatar('${av.id}')" title="Editar">✏️</button>
                <button class="admin-action-btn admin-del-btn" onclick="deleteAvatar('${av.id}')" title="Excluir Permanente">❌</button>
            </div>
        `;
        list.appendChild(item);
    });
}

function editAvatar(id) {
    const items = document.querySelectorAll('.avatar-admin-item');
    const avNameElement = Array.from(items).find(el => el.querySelector('button[onclick*="'+id+'"]'));
    if (!avNameElement) return;

    // Prefill form
    editingAvatarId = id;
    const nameStr = avNameElement.querySelector('strong').innerText;
    const infoStr = avNameElement.querySelector('span').innerText;
    const priceVal = infoStr.split('JK$ ')[1].split(' | ')[0];

    document.getElementById('admin-avatar-name').value = nameStr;
    document.getElementById('admin-avatar-price').value = priceVal;
    
    const btn = document.getElementById('btn-save-new-avatar');
    btn.textContent = 'ATUALIZAR AVATAR';
    
    // Smooth scroll to top of admin panel
    document.querySelector('.admin-panel').scrollTo({ top: 0, behavior: 'smooth' });
}

async function deleteAvatar(id) {
    const ok = await showConfirm('EXCLUIR DEFINITIVO', 'Deseja apagar este avatar permanentemente da base? (Não poderá ser desfeito)');
    if (!ok) return;
    const { error } = await db.from('store_avatars').delete().eq('id', id);
    if (error) alert('Erro: ' + error.message);
    else loadAdminAvatars();
}

init();
