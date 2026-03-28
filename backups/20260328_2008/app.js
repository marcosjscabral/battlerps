// Battle Shape | Rock Paper Scissors (v2.9.2)
// App.js - Core Logic & real-time sync
const SUPABASE_URL = 'https://fjjkqwmuycnuzalaeszs.supabase.co';
const SUPABASE_KEY = 'YOUR_KEY_HERE'; // O usuário já tem isso configurado no ambiente dele
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- Game Logic Constants ---
const MOVES = { rock: { beats: 'scissors' }, paper: { beats: 'rock' }, scissors: { beats: 'paper' } };
const STATUS_MSG = { 
    en: { win: 'YOU WON!', loss: 'YOU LOST!', draw: 'IT\'S A DRAW!', committing: 'COMMITTING...', revealed: 'REVEALED!', searching: 'SEARCHING...', found: 'MATCH FOUND!', placeholder: 'AWAITING...' },
    es: { win: '¡GANASTE!', loss: '¡PERDISTE!', draw: '¡EMPATE!', committing: 'ENVIANDO...', revealed: '¡REVELADO!', searching: 'BUSCANDO...', found: '¡PARTIDA!', placeholder: 'ESPERANDO...' },
    pt: { win: 'VOCÊ VENCEU!', loss: 'VOCÊ PERDEU!', draw: 'EMPATE!', committing: 'ENVIANDO...', revealed: 'REVELADO!', searching: 'BUSCANDO...', found: 'PARTIDA ENCONTRADA!', placeholder: 'AGUARDANDO...' }
};

const I18N = {
    en: { 
        'mode-bot': '👤 VS 🤖 BOT', 'mode-pvp': '👤 VS 👤 ONLINE', 'score-wins': 'WINS', 'score-draws': 'DRAWS', 'score-losses': 'LOSSES', 'phase-committing': 'COMMITTING', 'rock': 'ROCK', 'paper': 'PAPER', 'scissors': 'SCISSORS', 'awaiting': 'Awaiting...', 'thinking': 'Thinking...', 'menu-manual': 'Manual', 'menu-wallet': 'Wallet Shop', 'menu-admin': 'Admin Center', 'menu-profile': 'Profile', 'menu-password': 'Change Password', 'syncing': 'SYNCING PAYOUT...', 'music': 'MUSIC', 'sfx': 'SFX'
    },
    es: { 
        'mode-bot': '👤 VS 🤖 BOT', 'mode-pvp': '👤 VS 👤 EN LÍNEA', 'score-wins': 'VICTORIAS', 'score-draws': 'EMPATES', 'score-losses': 'DERROTAS', 'phase-committing': 'ENVIANDO', 'rock': 'PIEDRA', 'paper': 'PAPEL', 'scissors': 'TIJERAS', 'awaiting': 'Esperando...', 'thinking': 'Pensando...', 'menu-manual': 'Manual', 'menu-wallet': 'Tienda Wallet', 'menu-admin': 'Admin Center', 'menu-profile': 'Perfil', 'menu-password': 'Cambiar Contraseña', 'syncing': 'SINCRONIZANDO...', 'music': 'MÚSICA', 'sfx': 'SFX'
    },
    pt: { 
        'mode-bot': '👤 VS 🤖 BOT', 'mode-pvp': '👤 VS 👤 ONLINE', 'score-wins': 'VITÓRIAS', 'score-draws': 'EMPATES', 'score-losses': 'DERROTAS', 'phase-committing': 'ENVIANDO', 'rock': 'PEDRA', 'paper': 'PAPEL', 'scissors': 'TESOURA', 'awaiting': 'Aguardando...', 'thinking': 'Pensando...', 'menu-manual': 'Manual', 'menu-wallet': 'Wallet Shop', 'menu-admin': 'Admin Center', 'menu-profile': 'Perfil', 'menu-password': 'Trocar Senha', 'syncing': 'SINCRONIZANDO...', 'music': 'MÚSICA', 'sfx': 'SFX'
    }
};

// --- App State ---
let currentUser = null;
let currentMode = 'bot'; // 'bot' | 'pvp'
let currentLang = 'pt';
let myNickname = 'Player1';
let myAvatarUrl = 'https://fjjkqwmuycnuzalaeszs.supabase.co/storage/v1/object/public/avatars/avatar_p1.png';
let myUnlockedAvatars = [];
let balance = 0;
let lastBalanceUpdate = null;
let profileUpdatedByUsername = false;

// PvP Handlers
let pvpChannel = null;
let pvpRoomId = null;
let pvpState = 'idle'; // 'searching' | 'playing'
let pvpTimer = 0;
let pvpSearchId = null;
let opponent = { id: null, username: 'Opponent', avatar: 'images/warrior_bot.png', move: null, wallet: 0 };
let myMove = null;
let pvpScores = { win: 0, draw: 0, loss: 0 };

// Game State
let scores = { win: 0, draw: 0, loss: 0 };
let isLocked = false;

// Admin states
let currentAdminTab = 'wallet';
let currentStoreTab = 'buy';

// DOM Elements
const elBGM = document.getElementById('bg-music');
const elSfxBounce = document.getElementById('sfx-bounce');
const elSfxReveal = document.getElementById('sfx-reveal');
const elSfxWin = document.getElementById('sfx-win');
const elSfxLoss = document.getElementById('sfx-loss');
const elSfxDraw = document.getElementById('sfx-draw');
const elSfxClick = document.getElementById('sfx-click');

const elP1Avatar = document.getElementById('p1-avatar');
const elP2Avatar = document.getElementById('p2-avatar');
const elP1Label = document.getElementById('p1-label');
const elP2Label = document.getElementById('p2-label');
const elP1Status = document.getElementById('p1-status');
const elP2Status = document.getElementById('p2-status');
const elPhaseChip = document.getElementById('phase-chip');
const elResultBanner = document.getElementById('result-banner');
const elWinnerText = document.getElementById('winner-text');
const elScoreWin = document.getElementById('score-win-count');
const elScoreDraw = document.getElementById('score-draw-count');
const elScoreLoss = document.getElementById('score-loss-count');
const elMoveBtns = document.querySelectorAll('.rps-btn');
const elBalance = document.getElementById('user-balance');
const elBalanceChip = document.getElementById('balance-chip');
const elShopBalance = document.getElementById('shop-current-balance');

const elP1Hand = document.getElementById('p1-anim-hand');
const elP2Hand = document.getElementById('p2-anim-hand');
const elAnimOverlay = document.getElementById('animation-overlay');
const elCountdownOverlay = document.getElementById('countdown-overlay');
const elCountdownText = document.getElementById('countdown-text');

const elAuthOverlay = document.getElementById('auth-view');
const elUsernameOverlay = document.getElementById('username-overlay');
const elToastSuccess = document.getElementById('toast-success');
const elProfilePreview = document.getElementById('profile-avatar-preview');

// --- Initialization ---
async function init() {
    setupAuthListeners();
    setupEventListeners();
    applyI18n();
    
    // Check Current User
    const { data: { session } } = await db.auth.getSession();
    if (session) {
        currentUser = session.user;
        await handleAuthTransition(true);
    } else {
        await handleAuthTransition(false);
    }
}

// --- Auth logic ---
function setupAuthListeners() {
    db.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN') {
            currentUser = session.user;
            await handleAuthTransition(true);
            showView('game-screen');
        } else if (event === 'SIGNED_OUT') {
            currentUser = null;
            await handleAuthTransition(false);
            showView('auth-view');
        } else if (event === 'PASSWORD_RECOVERY') {
            showView('auth-view');
            document.getElementById('auth-tabs-group').classList.add('hidden');
            document.getElementById('auth-form-container').classList.add('hidden');
            document.getElementById('auth-update-password-container').classList.remove('hidden');
        }
    });
}

async function handleAuthTransition(loggedIn) {
    const btnTrigger = document.getElementById('btn-login-trigger');
    const loggedInCont = document.getElementById('auth-logged-in-container');
    const formCont = document.getElementById('auth-form-container');
    const profileBtn = document.getElementById('btn-profile-trigger');
    const adminBtn = document.getElementById('btn-admin-trigger');

    if (loggedIn) {
        btnTrigger.innerText = '👤 Wallet';
        loggedInCont.classList.remove('hidden');
        formCont.classList.add('hidden');
        profileBtn.classList.remove('hidden');
        
        // Load User Profile Data
        await loadUserProfile();
        
        // Show Admin if it is Marcos
        if (currentUser.email === 'marcosjscabral@gmail.com') adminBtn.classList.remove('hidden');
        else adminBtn.classList.add('hidden');

        // Check for missing nickname
        if (!myNickname || myNickname === 'Player1') {
            showView('username-overlay');
        }
    } else {
        btnTrigger.innerText = '👤 Login';
        loggedInCont.classList.add('hidden');
        formCont.classList.remove('hidden');
        profileBtn.classList.add('hidden');
        adminBtn.classList.add('hidden');
        
        balance = 0;
        updateBalanceUI();
        
        myNickname = 'Player1';
        myAvatarUrl = 'https://fjjkqwmuycnuzalaeszs.supabase.co/storage/v1/object/public/avatars/avatar_p1.png';
        elP1Avatar.src = myAvatarUrl;
        elP1Label.innerText = '@' + myNickname;
    }
}

async function loadUserProfile() {
    if (!currentUser) return;
    
    try {
        const { data, error } = await db.from('user_profiles').select('*').eq('id', currentUser.id).single();
        if (error && error.code !== 'PGRST116') throw error;

        if (data) {
            myNickname = data.username || 'Player1';
            myAvatarUrl = data.avatar_url || 'https://fjjkqwmuycnuzalaeszs.supabase.co/storage/v1/object/public/avatars/avatar_p1.png';
            balance = data.balance || 0;
            
            // Sync with profile UI
            document.getElementById('profile-username').value = myNickname;
            document.getElementById('profile-email').value = currentUser.email;
            elProfilePreview.src = myAvatarUrl;
            
            // Sync with game UI
            elP1Avatar.src = myAvatarUrl;
            elP1Label.innerText = '@' + myNickname;
            updateBalanceUI();
        } else {
            // Create profile if missing
            await db.from('user_profiles').insert({ id: currentUser.id, username: 'Newbie', balance: 0 });
        }
    } catch (e) {
        console.error('Error loading profile:', e);
    }
}

async function signOut() {
    // 1. Limpa os timers/intervalos do PvP se houver
    if (pvpSearchId) clearInterval(pvpSearchId);
    if (pvpChannel) pvpChannel.unsubscribe();
    
    // 2. Limpa dados de sessão e cache local
    localStorage.clear();
    sessionStorage.clear();
    
    // 3. Reseta o estado global do app
    currentUser = null;
    currentMode = 'bot';
    balance = 0;
    scores = { win: 0, draw: 0, loss: 0 };
    updateBalanceUI();
    updateScoreUI();
    
    // 4. Executa o logout no Supabase
    await db.auth.signOut();
    
    // 5. Hard Redirect (Opcional, mas garante limpeza total da memória do JS)
    window.location.reload(); 
}

// --- UI Management ---
function setupEventListeners() {
    // Dropdown Audio
    document.getElementById('menu-btn').onclick = (e) => {
        e.stopPropagation();
        document.getElementById('audio-menu').classList.toggle('active');
    };
    window.onclick = () => document.getElementById('audio-menu').classList.remove('active');

    // Tabs Auth
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.onclick = () => {
            document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const mode = tab.dataset.tab;
            document.getElementById('btn-auth-submit').innerText = mode === 'login' ? 'ENTRAR NA ARENA' : 'CRIAR CONTA DA ARENA';
            document.getElementById('auth-p-text').innerText = mode === 'login' ? 'Acesse sua conta para entrar na Arena' : 'Crie sua conta para salvar seu progresso';
            document.getElementById('btn-forgot-password').classList.toggle('hidden', mode !== 'login');
        };
    });

    // Auth Actions
    document.getElementById('btn-auth-submit').onclick = handleAuthSubmit;
    document.getElementById('btn-auth-logout').onclick = signOut;
    document.getElementById('btn-auth-close').onclick = () => showView('game-screen');
    document.getElementById('btn-login-trigger').onclick = () => showView('auth-view');
    document.getElementById('btn-auth-google').onclick = () => db.auth.signInWithOAuth({ provider: 'google' });
    document.getElementById('btn-update-password-submit').onclick = updatePassword;

    // View Triggers
    document.getElementById('btn-manual-trigger').onclick = () => showView('manual-view');
    document.getElementById('btn-wallet-trigger').onclick = () => { showView('wallet-view'); loadWalletCards(); };
    document.getElementById('btn-store-trigger').onclick = () => { showView('store-view'); loadAvatarStore(); };
    document.getElementById('btn-profile-trigger').onclick = () => showView('profile-view');
    document.getElementById('btn-admin-trigger').onclick = () => showView('admin-view');
    document.getElementById('btn-close-profile-x').onclick = () => showView('game-screen');
    document.getElementById('btn-close-profile-bottom').onclick = () => showView('game-screen');
    document.getElementById('btn-close-store-x').onclick = () => showView('game-screen');
    document.getElementById('btn-close-store-game').onclick = () => showView('game-screen');
    document.getElementById('btn-close-store-bottom').onclick = () => showView('profile-view');

    // Profile Actions
    document.getElementById('btn-edit-username').onclick = () => toggleEdit('profile-username');
    document.getElementById('btn-edit-email').onclick = () => toggleEdit('profile-email');
    document.getElementById('btn-save-profile').onclick = saveProfile;
    document.getElementById('btn-open-avatar-store').onclick = () => { showView('store-view'); loadAvatarStore(); };

    // Admin Actions
    document.getElementById('btn-save-new-card').onclick = saveNewWalletCard;
    document.getElementById('btn-save-new-avatar').onclick = saveNewAvatar;

    // Game Mode Toggle
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.onclick = () => setMode(btn.dataset.mode);
    });

    // Game Selection
    elMoveBtns.forEach(btn => {
        btn.onclick = () => handleMoveSelection(btn.dataset.move);
    });

    // Score Reset
    document.getElementById('vs-button').onclick = async () => {
        if (currentMode === 'pvp' && pvpState === 'playing') {
            const ok = await showConfirm('DISCONNECT', 'Deseja sair da partida atual e procurar outro oponente?');
            if (ok) startPvpSearch();
            return;
        }
        scores = { win: 0, draw: 0, loss: 0 };
        updateScoreUI();
    };

    // Username Join
    document.getElementById('btn-save-username').onclick = async () => {
        const input = document.getElementById('username-input');
        const nick = input.value.trim().replace('@', '');
        if (nick.length < 3) { alert('Mínimo 3 caracteres'); return; }
        
        const { error } = await db.from('user_profiles').update({ username: nick }).eq('id', currentUser.id);
        if (error) { document.getElementById('username-error').innerText = 'Erro ao salvar. Tente outro.'; return; }
        
        myNickname = nick;
        elP1Label.innerText = '@' + myNickname;
        document.getElementById('profile-username').value = myNickname;
        elUsernameOverlay.classList.add('hidden');
    };

    // Volume Sliders
    document.getElementById('volume-music-slider').oninput = (e) => elBGM.volume = e.target.value;
    document.getElementById('volume-sfx-slider').oninput = (e) => {
        const v = e.target.value;
        [elSfxBounce, elSfxReveal, elSfxWin, elSfxLoss, elSfxDraw, elSfxClick].forEach(a => a.volume = v);
    };
    document.getElementById('music-toggle').onclick = toggleMusic;
}

function showView(viewId) {
    const views = ['game-screen', 'auth-view', 'profile-view', 'manual-view', 'wallet-view', 'admin-view', 'store-view', 'username-overlay'];
    views.forEach(v => {
        const el = document.getElementById(v);
        if (el) el.classList.add('hidden');
    });
    const target = document.getElementById(viewId);
    if (target) target.classList.remove('hidden');
}

function setMode(mode) {
    if (mode === 'pvp' && !currentUser) {
        // Bloqueio rigoroso: se NÃO estiver logado, não pode entrar no modo online
        showView('auth-view');
        // Mantém o modo visual como 'bot'
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        document.getElementById('btn-mode-bot').classList.add('active');
        currentMode = 'bot';
        return;
    }

    currentMode = mode;
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`btn-mode-${mode}`).classList.add('active');

    if (mode === 'bot') {
        stopPvp();
        resetArenaUI();
        elP2Label.innerText = 'GRÃO-MESTRE';
        elP2Avatar.src = 'images/warrior_bot.png';
        updateScoreUI();
    } else {
        startPvpSearch();
    }
}

// --- Bot Mode Game Flow ---
function handleMoveSelection(move) {
    if (isLocked) return;
    myMove = move;
    playSfx(elSfxBounce);

    if (currentMode === 'bot') {
        runBotGame(move);
    } else {
        commitPvpMove(move);
    }
}

async function runBotGame(p1Move) {
    isLocked = true;
    elMoveBtns.forEach(b => b.disabled = true);
    document.querySelector(`[data-move="${p1Move}"]`).classList.add('selected');

    // Bot logic
    const moves = ['rock', 'paper', 'scissors'];
    const botMove = moves[Math.floor(Math.random() * 3)];
    
    elP2Status.innerText = 'Thinking...';
    await delay(800);
    
    // Animation
    await playRevealAnimation(p1Move, botMove);
    
    // Result
    const result = determineWinner(p1Move, botMove);
    applyResult(result, botMove);
    isLocked = false;
    elMoveBtns.forEach(b => b.disabled = false);
}

// --- PvP Real-time Logic ---
async function startPvpSearch() {
    stopPvp();
    pvpState = 'searching';
    resetArenaUI();
    
    const statusBox = document.getElementById('pvp-status');
    const statusText = document.getElementById('pvp-status-text');
    statusBox.classList.remove('hidden');
    statusText.innerText = STATUS_MSG[currentLang].searching;
    
    // UI update
    elP2Label.innerText = 'PROCURANDO...';
    elP2Avatar.style.filter = 'grayscale(1) opacity(0.5)';
    
    // Logic: Look for a room or create one
    // We use a simple matchmaking: try to join an open room for 5 seconds
    pvpSearchId = setInterval(async () => {
        const { data: rooms } = await db.from('pvp_rooms').select('*').eq('status', 'waiting').limit(5);
        
        let targetRoom = null;
        if (rooms && rooms.length > 0) {
            // Join first room that isn't mine
            targetRoom = rooms.find(r => r.p1_id !== currentUser.id);
        }

        if (targetRoom) {
            clearInterval(pvpSearchId);
            joinPvpRoom(targetRoom.id);
        } else {
            // No room found, create one if not existing
            const { data: myRoom } = await db.from('pvp_rooms').select('id').eq('p1_id', currentUser.id).eq('status', 'waiting').single();
            if (!myRoom) {
                await db.from('pvp_rooms').insert({ p1_id: currentUser.id, p1_user: myNickname, p1_avatar: myAvatarUrl, p1_wallet: balance });
            }
        }
    }, 2000);

    // Timeout (v2.8)
    setTimeout(() => { if (pvpState === 'searching' && !pvpRoomId) { statusText.innerText = 'Ninguém online agora...'; } }, 10000);
}

async function joinPvpRoom(id) {
    pvpRoomId = id;
    const { data: room, error } = await db.from('pvp_rooms').update({ 
        p2_id: currentUser.id, 
        p2_user: myNickname, 
        p2_avatar: myAvatarUrl,
        p2_wallet: balance,
        status: 'playing' 
    }).eq('id', id).select().single();

    if (error) { startPvpSearch(); return; }
    initPvpMatch(room, 'p2');
}

function initPvpMatch(room, myPos) {
    pvpState = 'playing';
    pvpRoomId = room.id;
    
    const isP1 = (myPos === 'p1');
    opponent = {
        id: isP1 ? room.p2_id : room.p1_id,
        username: isP1 ? room.p2_user : room.p1_user,
        avatar: isP1 ? room.p2_avatar : room.p1_avatar,
        wallet: isP1 ? room.p2_wallet : room.p1_wallet
    };

    // Update UI
    document.getElementById('pvp-status-text').innerText = STATUS_MSG[currentLang].found;
    elP2Label.innerText = opponent.username;
    elP2Avatar.src = opponent.avatar;
    elP2Avatar.style.filter = 'none';

    // Show Wallets in UI
    const elW1 = document.getElementById('pvp-wallet-p1');
    const elW2 = document.getElementById('pvp-wallet-p2');
    elW1.innerText = formatJK(isP1 ? balance : opponent.wallet);
    elW1.classList.add('is-p1');
    elW2.innerText = formatJK(isP1 ? opponent.wallet : balance);
    elW2.classList.add('is-p2');

    // Setup RT Channel
    pvpChannel = db.channel(`room_${pvpRoomId}`);
    
    pvpChannel
    .on('broadcast', { event: 'move' }, (payload) => {
        if (payload.sender !== currentUser.id) {
            opponent.move = payload.move;
            checkPvpResolution();
        }
    })
    .on('broadcast', { event: 'payout_sync' }, (payload) => {
        if (payload.sender !== currentUser.id) {
            balance = payload.p2_balance; // Sync balance from server logic surrogate
            updateBalanceUI();
        }
    })
    .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        // Opponent disconnected
        alert('Oponente desconectou.');
        startPvpSearch();
    })
    .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
            await pvpChannel.track({ user: currentUser.id });
            if (isP1) {
                // I was waiting, now I see P2 joined via DB update, RT confirms session
            }
        }
    });

    // Listen for DB changes to the room to see P2 joining (for P1)
    if (isP1) {
        db.channel('room_updates')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'pvp_rooms', filter: `id=eq.${pvpRoomId}` }, payload => {
            if (payload.new.status === 'playing' && !opponent.id) {
                initPvpMatch(payload.new, 'p1');
            }
        }).subscribe();
    }
}

function commitPvpMove(move) {
    if (isLocked || pvpState !== 'playing') return;
    myMove = move;
    isLocked = true;
    elMoveBtns.forEach(b => b.disabled = true);
    document.querySelector(`[data-move="${move}"]`).classList.add('selected');
    
    elP1Status.innerText = 'Ready';
    elPhaseChip.innerText = STATUS_MSG[currentLang].committing;
    elPhaseChip.classList.add('active');

    // Broadcast move
    pvpChannel.send({ type: 'broadcast', event: 'move', move: move, sender: currentUser.id });
    
    checkPvpResolution();
}

async function checkPvpResolution() {
    if (myMove && opponent.move) {
        // Both ready!
        elPhaseChip.innerText = STATUS_MSG[currentLang].revealed;
        elPhaseChip.classList.remove('active');
        
        await playRevealAnimation(myMove, opponent.move);
        const result = determineWinner(myMove, opponent.move);
        
        // Sync score locally
        if (result === 'win') pvpScores.win++;
        else if (result === 'draw') pvpScores.draw++;
        else pvpScores.loss++;
        
        applyResult(result, opponent.move, true);
        
        // Finalize: reset pvp moves
        myMove = null;
        opponent.move = null;
        isLocked = false;
        elMoveBtns.forEach(b => b.disabled = false);
    }
}

async function applyResult(result, oppMove, isPvp = false) {
    elResultBanner.classList.remove('hidden', 'won', 'lost', 'draw');
    elResultBanner.classList.add(result);
    elWinnerText.innerText = STATUS_MSG[currentLang][result];
    
    if (result === 'win') { playSfx(elSfxWin); scores.win++; }
    else if (result === 'draw') { playSfx(elSfxDraw); scores.draw++; }
    else { playSfx(elSfxLoss); scores.loss++; }

    updateScoreUI();

    // Payout Logic (v2.8) - Only if Logged In & In PvP
    if (isPvp && currentUser) {
        const diff = result === 'win' ? 10 : (result === 'draw' ? -5 : -10);
        await updateServerBalance(diff);
    }

    await delay(2000);
    elResultBanner.classList.add('hidden');
    resetArenaUI();
}

async function updateServerBalance(diff) {
    // We use a database RPC or direct update for simplicity here
    // In a real app, use a secure backend function (Edge Function)
    const newBalance = Math.max(0, balance + diff);
    const { error } = await db.from('user_profiles').update({ balance: newBalance }).eq('id', currentUser.id);
    
    if (!error) {
        balance = newBalance;
        updateBalanceUI();
        // Sync with opponent UI via broadcast
        if (pvpChannel) pvpChannel.send({ type: 'broadcast', event: 'payout_sync', p1_balance: balance, sender: currentUser.id });
    }
}

// --- Helper Functions ---
function determineWinner(p1, p2) {
    if (p1 === p2) return 'draw';
    return MOVES[p1].beats === p2 ? 'win' : 'loss';
}

function updateScoreUI() {
    elScoreWin.innerText = scores.win;
    elScoreDraw.innerText = scores.draw;
    elScoreLoss.innerText = scores.loss;
}

function updateBalanceUI() {
    const val = formatJK(balance);
    elBalance.innerText = val;
    if (elShopBalance) elShopBalance.innerText = val;
    
    // Color coding (v2.8)
    elBalanceChip.classList.remove('real', 'fictitious', 'zero');
    if (balance > 100) elBalanceChip.classList.add('real');
    else if (balance > 0) elBalanceChip.classList.add('fictitious');
    else elBalanceChip.classList.add('zero');
}

function formatJK(val) {
    return 'JK$ ' + parseFloat(val).toFixed(2);
}

function resetArenaUI() {
    elMoveBtns.forEach(b => { b.disabled = false; b.classList.remove('selected'); });
    elP1Status.innerText = STATUS_MSG[currentLang].placeholder;
    elP2Status.innerText = STATUS_MSG[currentLang].thinking;
    elPhaseChip.innerText = STATUS_MSG[currentLang].committing;
    elPhaseChip.classList.remove('active');
    elP1Hand.querySelector('img').src = 'images/rock.png';
    elP2Hand.querySelector('img').src = 'images/rock.png';
}

async function playRevealAnimation(m1, m2) {
    elAnimOverlay.classList.remove('hidden');
    elP1Hand.querySelector('img').src = 'images/rock.png';
    elP2Hand.querySelector('img').src = 'images/rock.png';
    
    playSfx(elSfxBounce);
    await delay(1500); // 3 shakes
    
    elP1Hand.querySelector('img').src = `images/${m1}.png`;
    elP2Hand.querySelector('img').src = `images/${m2}.png`;
    playSfx(elSfxReveal);
    
    await delay(1000);
    elAnimOverlay.classList.add('hidden');
}

function stopPvp() {
    if (pvpChannel) pvpChannel.unsubscribe();
    if (pvpSearchId) clearInterval(pvpSearchId);
    if (pvpRoomId) db.from('pvp_rooms').delete().eq('id', pvpRoomId).eq('p1_id', currentUser.id);
    
    pvpChannel = null;
    pvpRoomId = null;
    pvpState = 'idle';
    document.getElementById('pvp-status').classList.add('hidden');
}

// --- Auth Submission ---
async function handleAuthSubmit() {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    const isLogin = document.querySelector('.auth-tab.active').dataset.tab === 'login';
    const errEl = document.getElementById('auth-error-msg');
    const btn = document.getElementById('btn-auth-submit');

    if (!email || !password) { alert('Preencha os campos!'); return; }

    btn.disabled = true;
    btn.innerText = 'PROCESSANDO...';
    errEl.classList.add('hidden');

    const { data, error } = isLogin 
        ? await db.auth.signInWithPassword({ email, password })
        : await db.auth.signUp({ email, password });

    if (error) {
        errEl.innerText = error.message;
        errEl.classList.remove('hidden');
        btn.disabled = false;
        btn.innerText = isLogin ? 'ENTRAR NA ARENA' : 'CRIAR CONTA DA ARENA';
    } else {
        if (!isLogin) alert('Verifique seu e-mail para confirmar o cadastro!');
    }
}

async function updatePassword() {
    const password = document.getElementById('update-password').value;
    if (password.length < 6) { alert('Mínimo 6 caracteres'); return; }
    
    const { error } = await db.auth.updateUser({ password });
    if (error) { alert('Erro: ' + error.message); }
    else {
        alert('Senha atualizada!');
        document.getElementById('auth-update-password-container').classList.add('hidden');
        document.getElementById('auth-tabs-group').classList.remove('hidden');
        document.getElementById('auth-form-container').classList.remove('hidden');
        showView('game-screen');
    }
}

// --- Profile Edit Logic ---
function toggleEdit(fieldId) {
    const input = document.getElementById(fieldId);
    input.readOnly = !input.readOnly;
    input.classList.toggle('readonly-input');
    input.classList.toggle('edit-active');
    if (!input.readOnly) input.focus();
}

async function saveProfile() {
    const username = document.getElementById('profile-username').value.trim().replace('@', '');
    const email = document.getElementById('profile-email').value;
    
    if (username.length < 3) { alert('Nickname muito curto!'); return; }

    const btn = document.getElementById('btn-save-profile');
    btn.disabled = true;
    btn.innerText = 'SALVANDO...';

    // Update in DB
    const { error } = await db.from('user_profiles').update({ username: username }).eq('id', currentUser.id);
    
    if (error) {
        alert('Erro ao salvar perfil: ' + error.message);
    } else {
        myNickname = username;
        elP1Label.innerText = '@' + myNickname;
        elToastSuccess.classList.remove('hidden');
        setTimeout(() => elToastSuccess.classList.add('hidden'), 2000);
    }
    
    btn.disabled = false;
    btn.innerText = 'SALVAR ALTERAÇÕES';
    
    // Reset inputs
    document.querySelectorAll('.edit-active').forEach(el => {
        el.readOnly = true;
        el.classList.add('readonly-input');
        el.classList.remove('edit-active');
    });
}

// --- Wallet Shop Logic ---
async function loadWalletCards() {
    const grid = document.getElementById('shop-cards-grid');
    grid.innerHTML = '<div class="store-loading">Carregando ofertas...</div>';

    const { data: cards, error } = await db.from('wallet_cards').select('*').order('jk_amount', { ascending: true });
    if (error || !cards) { grid.innerHTML = 'Erro ao carregar loja.'; return; }

    grid.innerHTML = '';
    cards.forEach(card => {
        const div = document.createElement('div');
        div.className = 'wallet-card';
        div.innerHTML = `
            <div class="card-img-wrap"><img src="${card.image_url || 'images/card_gold.png'}" class="card-img"></div>
            <div class="card-jk-amount">JK$ ${card.jk_amount}</div>
            <button class="card-buy-btn" data-id="${card.id}">COMPRAR POR R$ ${card.price_brl}</button>
        `;
        div.querySelector('button').onclick = () => alert('Integração de pagamento em breve!');
        grid.appendChild(div);
    });
}

// Admin wallet creation
async function saveNewWalletCard() {
    const imgFile = document.getElementById('admin-card-image').files[0];
    const amount = parseInt(document.getElementById('admin-card-amount').value);
    const price = parseFloat(document.getElementById('admin-card-price').value);

    if (!imgFile || isNaN(amount) || isNaN(price)) { alert('Preencha tudo!'); return; }

    const ext = imgFile.name.split('.').pop();
    const fileName = `card_${Date.now()}.${ext}`;
    const { data: uploadData, error: uploadErr } = await db.storage.from('cards').upload(fileName, imgFile);
    if (uploadErr) { alert('Erro upload: ' + uploadErr.message); return; }

    const { data: { publicUrl } } = db.storage.from('cards').getPublicUrl(fileName);
    const { error: dbErr } = await db.from('wallet_cards').insert({ jk_amount: amount, price_brl: price, image_url: publicUrl });
    
    if (dbErr) alert('Erro banco: ' + dbErr.message);
    else { alert('Card criado!'); loadWalletCards(); }
}

// --- i18n ---
function applyI18n() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (I18N[currentLang][key]) el.innerText = I18N[currentLang][key];
    });
    document.getElementById('lang-current').innerText = currentLang === 'pt' ? '🇧🇷' : (currentLang === 'es' ? '🇪🇸' : '🇺🇸');
    
    // Language switchers
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.onclick = () => {
            currentLang = btn.dataset.lang;
            applyI18n();
        };
    });
}

// --- Audio ---
function toggleMusic() {
    if (elBGM.paused) {
        elBGM.play();
        document.getElementById('music-toggle').innerText = '🎵';
    } else {
        elBGM.pause();
        document.getElementById('music-toggle').innerText = '🔇';
    }
}

function playSfx(audio) {
    audio.currentTime = 0;
    audio.play();
}

const delay = ms => new Promise(res => setTimeout(res, ms));

async function showConfirm(title, msg) {
    return new Promise(resolve => {
        document.getElementById('confirm-title').innerText = title;
        document.getElementById('confirm-msg').innerText = msg;
        const overlay = document.getElementById('confirm-overlay');
        overlay.classList.remove('hidden');
        
        document.getElementById('btn-confirm-yes').onclick = () => {
            overlay.classList.add('hidden');
            resolve(true);
        };
        document.getElementById('btn-confirm-no').onclick = () => {
            overlay.classList.add('hidden');
            resolve(false);
        };
    });
}

// --- Admin Section Management ---
function switchAdminTab(tab) {
    currentAdminTab = tab;
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    document.getElementById(`admin-tab-${tab}`).classList.add('active');
    
    document.querySelectorAll('.admin-panel').forEach(p => p.classList.add('hidden'));
    document.getElementById(`admin-panel-${tab}`).classList.remove('hidden');
    
    if (tab === 'avatars') loadAdminAvatars();
}

function switchStoreTab(tab) {
    currentStoreTab = tab;
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    document.getElementById(`store-tab-${tab}`).classList.add('active');
    loadAvatarStore();
}

// --- Avatar Store Logic (New in v2.9) ---
async function loadAvatarStore() {
    const grid = document.getElementById('avatar-store-grid');
    grid.innerHTML = '<div class="store-loading">Carregando loja...</div>';

    if (!currentUser) return;

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
