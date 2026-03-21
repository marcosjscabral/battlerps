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
        'joining': 'JOINING ARENA...'
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
        'joining': 'ENTRANDO...'
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
        'joining': 'ENTRANDO...'
    }
};

const langEmojis = { en: '🇺🇸', es: '🇪🇸', pt: '🇵🇹' };
let currentLang = localStorage.getItem('battlerps-lang') || 'en';

const config = {
    stake: 100.00,
    platformFee: 0.05
};

const moveEmojis = { rock: '✊', paper: '🖐️', scissors: '✌️' };

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

if (!currentWallet) {
    currentWallet = 'USER-' + Math.floor(Math.random() * 999999);
    localStorage.setItem('battlerps-device-id', currentWallet);
}

// DOM Elements
const elBalance = document.getElementById('user-balance');
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

async function init() {
    applyLanguage(currentLang);
    const isMuted = localStorage.getItem('battlerps-muted') === 'true';
    if (isMuted) {
        elMusic.muted = true;
        elMusicBtn.textContent = '🔇';
    }

    // Use Upsert logic to ensure profile exists
    const { data, error } = await db.from('user_profiles').select('balance, username').eq('wallet_address', currentWallet).single();
    if (data) {
        updateBalance(data.balance);
        if (data.username) {
            myUsername = data.username;
            elP1Label.textContent = myUsername;
        } else { elUsernameOverlay.classList.remove('hidden'); }
    } else {
        const initial = 1000.00;
        await db.from('user_profiles').upsert([{ wallet_address: currentWallet, balance: initial }], { onConflict: 'wallet_address' });
        updateBalance(initial);
        elUsernameOverlay.classList.remove('hidden');
    }
}

async function saveUsername() {
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
    elBalance.textContent = balance.toFixed(2);
}

function triggerFloatingPayout(amount, type) {
    const float = document.createElement('div');
    float.className = 'floating-payout';
    float.textContent = (amount > 0 ? '+' : '') + amount.toFixed(2) + ' USDC';
    float.classList.add(type === 'win' ? 'text-win' : 'text-loss');
    float.style.left = '50%'; float.style.top = '45%';
    document.body.appendChild(float);
    setTimeout(() => float.remove(), 1200);
}

async function setMode(mode) {
    gameMode = mode;
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.mode === mode));
    if (mode === 'pvp') {
        elPvpStatus.classList.remove('hidden');
        startPvPDiscovery();
    } else {
        elPvpStatus.classList.add('hidden');
        elP2Label.textContent = translations[currentLang]['p2-label'];
        if (pvpChannel) pvpChannel.unsubscribe();
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
    if (phase !== 'COMMIT' || !myUsername) return;
    if (gameMode === 'pvp' && !partnerId) return;
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
    h1.textContent = '✊'; h2.textContent = '✊';
    h1.style.animation = 'hand-bounce-p1 0.4s ease-in-out infinite';
    h2.style.animation = 'hand-bounce-p2 0.4s ease-in-out infinite';
    playSfx(elSfxBounce);
    setTimeout(() => playSfx(elSfxBounce), 400);
    setTimeout(() => playSfx(elSfxBounce), 800);
    setTimeout(() => {
        h1.style.animation = 'none'; h2.style.animation = 'none';
        h1.textContent = moveEmojis[myMove] || '❓'; h2.textContent = moveEmojis[botMove] || '❓';
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
        if (result.winner === 1) { newBalance += (config.stake * result.mult - config.stake); triggerFloatingPayout(config.stake * result.mult, 'win'); }
        else if (result.winner === 2) { newBalance -= config.stake; triggerFloatingPayout(-config.stake, 'loss'); }
        setTimeout(async () => {
            updateBalance(newBalance);
            await db.from('user_profiles').update({ balance: newBalance }).eq('wallet_address', currentWallet);
            await db.from('matches').insert([{ player_move: myMove, bot_move: botMove, outcome: result.name, stake: config.stake, payout: result.winner === 1 ? config.stake * result.mult : 0, user_id: currentWallet }]);
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
    if (result.winner === 1) elWinnerText.classList.add('text-win');
    else if (result.winner === 2) elWinnerText.classList.add('text-loss');
    else elWinnerText.classList.add('text-draw');
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

// Events
elSaveUsername.onclick = saveUsername;
document.querySelectorAll('.rps-btn').forEach(btn => btn.onclick = () => selectMove(btn.dataset.move, btn));
document.querySelectorAll('.lang-btn').forEach(btn => btn.onclick = (e) => { e.stopPropagation(); applyLanguage(btn.dataset.lang); });
elLangTrigger.onclick = (e) => { e.stopPropagation(); elLangDropdown.classList.toggle('active'); };
elMusicBtn.onclick = (e) => { e.stopPropagation(); toggleMusic(); };
document.querySelectorAll('.mode-btn').forEach(btn => btn.onclick = () => setMode(btn.dataset.mode));
document.addEventListener('click', () => elLangDropdown.classList.remove('active'));

init();
