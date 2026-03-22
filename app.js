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
        'score-losses': 'LOSSES'
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
        'score-losses': 'DERROTAS'
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
        'score-losses': 'DERROTAS'
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
        elLoginTrigger.title = 'Sair da conta';
        
        let activeProfile = profile;
        if (!activeProfile) {
            // Se for o primeiro login do usuário, nós criamos o perfil dele
            myUsername = generateRandomUsername();
            const defaultAvatar = 'images/player_default.png';
            const novoPerfil = { 
                id: currentUser.id, 
                wallet_address: currentWallet, 
                username: myUsername, 
                balance: 1000.00,
                avatar_url: defaultAvatar
            };
            const { error: upsertError } = await db.from('user_profiles').upsert(novoPerfil);
            if (upsertError) alert("Erro ao criar perfil: " + upsertError.message);
            activeProfile = novoPerfil;
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
            document.querySelector('.avatar-img').src = activeProfile.avatar_url;
            elProfilePreview.src = activeProfile.avatar_url;
        } else {
            const defaultAvatar = 'images/player_default.png';
            await db.from('user_profiles').update({ avatar_url: defaultAvatar }).eq('id', currentUser.id);
            document.querySelector('.avatar-img').src = defaultAvatar;
            elProfilePreview.src = defaultAvatar;
        }

        // Popular modal de perfil com os dados reais
        elProfileUser.value = myUsername.replace('@', '');
        elProfileUser.placeholder = myUsername.replace('@', '');
        elProfileEmail.value = currentUser.email; 
        
        // Ativar Realtime Listener para o Ledger/Wallet Híbrido da Economia JK$
        if (window.walletChannel) window.walletChannel.unsubscribe();
        window.walletChannel = db.channel('joken_economy_sync')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'user_profiles', filter: `id=eq.${currentUser.id}` }, payload => {
                if (payload.new.balance !== undefined && payload.new.balance !== balance) {
                    updateBalance(payload.new.balance);
                }
            }).subscribe();

    } else {
        if (window.walletChannel) {
            window.walletChannel.unsubscribe();
            window.walletChannel = null;
        }
        currentUser = null;
        myUsername = localStorage.getItem('battlerps-user-handle') || 'Player 1';
        elP1Label.textContent = myUsername;
        document.querySelector('.avatar-box .avatar-img').src = 'images/player_default.png';
        
        // Atualiza UI para Deslogado (Azul)
        elLoginTrigger.textContent = '👤 Login';
        elLoginTrigger.style.color = '#4285F4';
        elLoginTrigger.title = 'Fazer Login';

        if (elBtnAdmin) elBtnAdmin.classList.add('hidden'); // Hide admin button if not logged in
    }
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
const elPvpTimer = document.getElementById('pvp-timer');
const elUsernameOverlay = document.getElementById('username-overlay');
const elUsernameInput = document.getElementById('username-input');
const elSaveUsername = document.getElementById('btn-save-username');
const elUsernameError = document.getElementById('username-error');
const elP1Label = document.getElementById('p1-label');
const elP2Label = document.getElementById('p2-label');
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
const elAuthOverlay = document.getElementById('auth-view'); // Assuming this is the main auth overlay
const elAuthEmailBtn = document.getElementById('btn-auth-submit'); // Re-using the updated name
const elLogoutBtn = document.getElementById('btn-logout');


const elVsButton = document.getElementById('vs-button');
const elCountdownOverlay = document.getElementById('countdown-overlay');
const elCountdownText = document.getElementById('countdown-text');

// --- Central Routing System ---
const allViews = {
    'game-screen': document.getElementById('game-screen'),
    'manual-view': document.getElementById('manual-view'),
    'wallet-view': document.getElementById('wallet-view'),
    'admin-view': document.getElementById('admin-view'),
    'auth-view': elAuthView,
    'profile-view': elProfileView
};

window.showView = function(viewId) {
    if (elAudioMenu) elAudioMenu.classList.remove('active'); // Close menu dropdown
    
    // Hide all main switches
    Object.values(allViews).forEach(view => {
        if (view) view.classList.add('hidden');
    });

    // Show target
    const target = allViews[viewId];
    if (target) {
        target.classList.remove('hidden');
        if (viewId === 'wallet-view') loadShop();
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
    await db.auth.signInWithOAuth({ provider: 'google' });
}

async function signInWithEmail() {
    const email = elEmailInput.value.trim();
    const password = elPassInput.value.trim();
    if (!email || !password) return alert("Preencha email e senha");
    
    elAuthEmailBtn.disabled = true;
    
    if (authMode === 'signup') {
        // Fluxo de Cadastro
        const { data, error } = await db.auth.signUp({ email, password });
        if (error) alert(error.message);
        else alert("Conta criada! Verifique seu e-mail para confirmar a conta.");
    } else {
        // Fluxo de Login
        const { data, error } = await db.auth.signInWithPassword({ email, password });
        if (error) {
            if (error.status === 400) alert("Email ou senha incorretos. Verifique seus dados.");
            else alert(error.message);
        } else {
            showView('game-screen'); // Changed from elAuthOverlay.classList.add('hidden');
        }
    }
    
    elAuthEmailBtn.disabled = false;
}

async function signOut() {
    const ok = await showConfirm("LOGOUT", "Tem certeza que deseja sair da conta?");
    if (!ok) return;
    
    // Zerar Placar no LocalStorage
    localStorage.removeItem('battlerps-score-wins');
    localStorage.removeItem('battlerps-score-draws');
    localStorage.removeItem('battlerps-score-losses');
    
    await db.auth.signOut();
    location.reload();
}

function showConfirm(title, msg) {
    return new Promise((resolve) => {
        elConfirmTitle.textContent = title;
        elConfirmMsg.textContent = msg;
        showView('confirm-overlay'); // Changed from elConfirmOverlay.classList.remove('hidden');
        
        elConfirmYes.onclick = () => { showView('game-screen'); resolve(true); }; // Changed
        elConfirmNo.onclick = () => { showView('game-screen'); resolve(false); }; // Changed
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
        await handleAuthTransition(session);
    });

    // Fallback/Guest Profile Logic
    if (!currentUser) {
        const { data, error } = await db.from('user_profiles').select('balance, username').eq('wallet_address', currentWallet).single();
        if (data) {
            updateBalance(data.balance);
            if (data.username) {
                myUsername = data.username;
                elP1Label.textContent = myUsername;
            }
        } else {
            const initial = 1000.00;
            // Only upsert guest if no user is logged in
            await db.from('user_profiles').upsert([{ wallet_address: currentWallet, balance: initial }], { onConflict: 'wallet_address' });
            updateBalance(initial);
        }
    }
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
        elPvpStatus.classList.remove('hidden');
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
    elPvpTimer.classList.remove('hidden');
    elPvpTimer.textContent = currentTime + 's';
    if (firstPlayedSide === 'remote') elPvpText.textContent = translations[currentLang]['opponent-played'];
    countdownInterval = setInterval(() => {
        currentTime--;
        elPvpTimer.textContent = currentTime + 's';
        if (currentTime <= 0) {
            clearInterval(countdownInterval);
            handleTimeout();
        }
    }, 1000);
}

function handleTimeout() {
    elPvpTimer.classList.add('hidden');
    if (myMove && !pvpMoveReceived) {
        botMove = 'rock'; processPayout(false, true);
    } else if (!myMove && pvpMoveReceived) {
        myMove = 'rock'; botMove = pvpMoveReceived; processPayout(true, false);
    }
}

function stopCountdown() {
    if (countdownInterval) clearInterval(countdownInterval);
    elPvpTimer.classList.add('hidden');
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

function updateBalance(newBalance) {
    balance = newBalance;
    elBalance.textContent = formatJK(balance);
    if (elBalanceChip) {
        elBalanceChip.classList.remove('positive', 'empty', 'fictitious');
        if (balance == 0) {
            elBalanceChip.classList.add('empty');
        } else if (currentUser) {
            elBalanceChip.classList.add('positive');
        } else {
            elBalanceChip.classList.add('fictitious');
        }
    }
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
        if (!currentUser) {
             // Redirecionar para login ou mostrar modal de auth (requisito 3 de entrega)
             alert("Acesse sua conta para jogar PVP Online!");
             document.getElementById('auth-overlay').classList.remove('hidden');
             return;
        }
        if (!myUsername) {
            elUsernameOverlay.classList.remove('hidden');
            return;
        }
        elPvpStatus.classList.remove('hidden');
        startPvPDiscovery();
    } else {
        elPvpStatus.classList.add('hidden');
        elP2Label.textContent = translations[currentLang]['p2-label'];
        if (pvpChannel) pvpChannel.unsubscribe();
        elUsernameOverlay.classList.add('hidden');
    }
}

function startPvPDiscovery() {
    pvpChannel = db.channel('lobby', { config: { broadcast: { self: false } } });
    pvpChannel
        .on('broadcast', { event: 'discovery' }, ({ payload }) => {
            if (!partnerId && payload.wallet !== currentWallet) {
                partnerId = payload.wallet;
                partnerName = payload.username || translations[currentLang]['pvp-mode'];
                elP2Label.textContent = partnerName;
                elPvpText.textContent = translations[currentLang]['opponent-found'];
                pvpChannel.send({ type: 'broadcast', event: 'ack', payload: { to: partnerId, from: currentWallet, username: myUsername } });
            }
        })
        .on('broadcast', { event: 'ack' }, ({ payload }) => {
            if (!partnerId && payload.to === currentWallet) {
                partnerId = payload.from;
                partnerName = payload.username || translations[currentLang]['pvp-mode'];
                elP2Label.textContent = partnerName;
                elPvpText.textContent = translations[currentLang]['opponent-found'];
            }
        })
        .on('broadcast', { event: 'move' }, ({ payload }) => {
            if (payload.from === partnerId) {
                pvpMoveReceived = payload.move;
                elP2Status.textContent = translations[currentLang]['ready'];
                elP2Status.style.color = 'var(--secondary)';
                if (!myMove && !firstPlayedSide) {
                    firstPlayedSide = 'remote';
                    startPvPCutdown();
                } else if (myMove) {
                    stopCountdown();
                    botMove = pvpMoveReceived;
                    setTimeout(reveal, 500);
                }
            }
        })
        .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
                pvpChannel.send({ type: 'broadcast', event: 'discovery', payload: { wallet: currentWallet, username: myUsername } });
            }
        });
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
        if (result.winner === 1) { newBalance += 10; triggerFloatingPayout(10, 'win'); }
        else if (result.winner === 2) { newBalance -= 10; triggerFloatingPayout(-10, 'loss'); }
        else if (result.winner === 0) { newBalance -= 5; triggerFloatingPayout(-5, 'loss'); }
        
        setTimeout(async () => {
            // Ledger: Sistema de rastreabilidade (Transações JK$)
            if (currentUser) {
                if (result.winner === 1) {
                    await db.from('transactions').insert({ user_id: currentUser.id, amount: 10, type: 'game_win', description: 'Vitória no Joken' });
                } else if (result.winner === 2) {
                    await db.from('transactions').insert({ user_id: currentUser.id, amount: -10, type: 'game_bet', description: 'Derrota no Joken' });
                } else if (result.winner === 0) {
                    await db.from('transactions').insert({ user_id: currentUser.id, amount: -5, type: 'game_bet', description: 'Empate no Joken' });
                }
            }
            updateBalance(newBalance);
            await db.from('user_profiles').update({ balance: newBalance }).eq('wallet_address', currentWallet);
            await db.from('user_profiles').update({ balance: newBalance }).eq('wallet_address', currentWallet);
            await db.from('matches').insert([{ player_move: myMove, bot_move: botMove, outcome: result.name, stake: 10, payout: result.winner === 1 ? 10 : 0, user_id: currentWallet }]);
        }, 800);
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
    elCountdownOverlay.style.display = 'flex';
    elCountdownOverlay.classList.remove('hidden');
    
    let count = 3;
    elCountdownText.textContent = count;
    
    // Bloquear os botões de jogada durante a contagem
    document.getElementById('move-controls').style.pointerEvents = 'none';

    const intv = setInterval(() => {
        count--;
        if (count > 0) {
            elCountdownText.textContent = count;
        } else if (count === 0) {
            elCountdownText.textContent = "GO!";
            // Reset do placar e do jogo aqui ("aí zera e o jogo pode ser iniciado")
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
    else elAuthOverlay.classList.remove('hidden');
};
if (elAuthGoogle) elAuthGoogle.onclick = signInWithGoogle;
if (elAuthEmailBtn) elAuthEmailBtn.onclick = signInWithEmail;
if (elTabLogin) elTabLogin.onclick = () => switchAuthMode('login');
if (elTabSignup) elTabSignup.onclick = () => switchAuthMode('signup');
if (elProfileTrigger) elProfileTrigger.onclick = () => {
    elAudioMenu.classList.remove('active');
    if (!currentUser) {
        elAuthOverlay.classList.remove('hidden');
    } else {
        elProfileOverlay.classList.remove('hidden');
    }
};
if (elSaveProfile) elSaveProfile.onclick = saveProfile;
if (elAvatarUpload) elAvatarUpload.onchange = (e) => { if (e.target.files[0]) uploadAvatar(e.target.files[0]); };
if (elEditUserBtn) elEditUserBtn.onclick = () => unlockField(elProfileUser);
if (elEditEmailBtn) elEditEmailBtn.onclick = () => unlockField(elProfileEmail);
if (elChangePassBtn) elChangePassBtn.onclick = () => {
    elAudioMenu.classList.remove('active');
    requestPasswordChange();
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
const elGameScreen = document.getElementById('game-screen');
const elManualView = document.getElementById('manual-view');
const elWalletView = document.getElementById('wallet-view');
const elAdminView = document.getElementById('admin-view');
const elShopGrid = document.getElementById('shop-cards-grid');
const elShopBalance = document.getElementById('shop-current-balance');

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
if (elProfileTrigger) elProfileTrigger.onclick = () => showView('profile-view');
if (elLoginTrigger) elLoginTrigger.onclick = () => {
    if (currentUser) showView('profile-view');
    else showView('auth-view');
};

if (elBtnCloseManualX) elBtnCloseManualX.onclick = () => showView('game-screen');
if (elBtnCloseManualBottom) elBtnCloseManualBottom.onclick = () => showView('game-screen');
if (elBtnCloseShopX) elBtnCloseShopX.onclick = () => showView('game-screen');
if (elBtnCloseShopBottom) elBtnCloseShopBottom.onclick = () => showView('game-screen');
if (elBtnCloseAdminX) elBtnCloseAdminX.onclick = () => showView('game-screen');
if (elBtnCloseAdminBottom) elBtnCloseAdminBottom.onclick = () => showView('game-screen');

if (elBtnSaveNewCard) elBtnSaveNewCard.onclick = saveNewCard;


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

init();
