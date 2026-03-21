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
        'pvp-mode': 'ONLINE PVP'
    },
    es: {
        'game-title': '¡Batalla!',
        'game-subtitle': 'Haz tu movimento para empezar la batalla',
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
        'pvp-mode': 'PVP EN LÍNEA'
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
        'pvp-mode': 'PVP ONLINE'
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
let gameMode = 'bot'; // 'bot' or 'pvp'
let pvpChannel = null;
let partnerId = null;
let pvpMoveReceived = null;
const currentWallet = 'USER-' + Math.floor(Math.random() * 100000); // Dynamic for testing

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

async function init() {
    applyLanguage(currentLang);
    const isMuted = localStorage.getItem('battlerps-muted') === 'true';
    if (isMuted) {
        elMusic.muted = true;
        elMusicBtn.textContent = '🔇';
    }

    const { data } = await db.from('user_profiles').select('balance').eq('wallet_address', currentWallet).single();
    if (data) updateBalance(data.balance);
    else {
        await db.from('user_profiles').insert([{ wallet_address: currentWallet, balance: 1000.00 }]);
        updateBalance(1000.00);
    }
}

function playSfx(audio) {
    if (!elMusic.muted) {
        audio.currentTime = 0;
        audio.play().catch(console.warn);
    }
}

function toggleMusic() {
    const isMuted = !elMusic.muted;
    elMusic.muted = isMuted;
    localStorage.setItem('battlerps-muted', isMuted);
    elMusicBtn.textContent = isMuted ? '🔇' : '🔊';
    if (!isMuted && elMusic.paused) elMusic.play().catch(console.warn);
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
    float.style.left = '50%';
    float.style.top = '45%';
    document.body.appendChild(float);
    setTimeout(() => float.remove(), 1200);
}

async function setMode(mode) {
    gameMode = mode;
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.mode === mode));
    
    if (mode === 'pvp') {
        elPvpStatus.classList.remove('hidden');
        document.getElementById('p2-label').textContent = translations[currentLang]['pvp-mode'];
        startPvPDiscovery();
    } else {
        elPvpStatus.classList.add('hidden');
        document.getElementById('p2-label').textContent = translations[currentLang]['p2-label'];
        if (pvpChannel) pvpChannel.unsubscribe();
    }
}

function startPvPDiscovery() {
    pvpChannel = db.channel('lobby', { config: { broadcast: { self: false } } });
    
    pvpChannel
        .on('broadcast', { event: 'discovery' }, ({ payload }) => {
            if (!partnerId && payload.wallet !== currentWallet) {
                partnerId = payload.wallet;
                elPvpText.textContent = translations[currentLang]['opponent-found'];
                pvpChannel.send({ type: 'broadcast', event: 'ack', payload: { to: partnerId, from: currentWallet } });
            }
        })
        .on('broadcast', { event: 'ack' }, ({ payload }) => {
            if (!partnerId && payload.to === currentWallet) {
                partnerId = payload.from;
                elPvpText.textContent = translations[currentLang]['opponent-found'];
            }
        })
        .on('broadcast', { event: 'move' }, ({ payload }) => {
            if (payload.from === partnerId) {
                pvpMoveReceived = payload.move;
                elP2Status.textContent = translations[currentLang]['ready'];
                elP2Status.style.color = 'var(--secondary)';
                if (myMove) setTimeout(reveal, 500);
            }
        })
        .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
                pvpChannel.send({ type: 'broadcast', event: 'discovery', payload: { wallet: currentWallet } });
            }
        });
}

function selectMove(move, btn) {
    if (phase !== 'COMMIT') return;
    if (gameMode === 'pvp' && !partnerId) return; // Wait for opponent

    if (!elMusic.muted && elMusic.paused) elMusic.play().catch(console.warn);
    
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
            phase = 'REVEAL';
            updatePhaseText();
            document.getElementById('move-controls').style.pointerEvents = 'none';
            document.getElementById('move-controls').style.opacity = '0.5';
            setTimeout(reveal, 500); 
        }, 400);
    } else {
        // PvP Mode: Send Move
        pvpChannel.send({ type: 'broadcast', event: 'move', payload: { from: currentWallet, move: myMove } });
        if (pvpMoveReceived) {
            botMove = pvpMoveReceived;
            phase = 'REVEAL';
            updatePhaseText();
            document.getElementById('move-controls').style.pointerEvents = 'none';
            document.getElementById('move-controls').style.opacity = '0.5';
            setTimeout(reveal, 500);
        }
    }
}

function reveal() {
    phase = 'BATTLE';
    updatePhaseText();
    overlay.classList.remove('hidden');
    h1.textContent = '✊';
    h2.textContent = '✊';
    h1.style.animation = 'hand-bounce-p1 0.4s ease-in-out infinite';
    h2.style.animation = 'hand-bounce-p2 0.4s ease-in-out infinite';
    playSfx(elSfxBounce);
    setTimeout(() => playSfx(elSfxBounce), 400);
    setTimeout(() => playSfx(elSfxBounce), 800);
    
    setTimeout(() => {
        h1.style.animation = 'none';
        h2.style.animation = 'none';
        h1.textContent = moveEmojis[myMove];
        h2.textContent = moveEmojis[botMove];
        playSfx(elSfxReveal);
        setTimeout(() => {
            overlay.classList.add('hidden');
            processPayout();
        }, 1500);
    }, 1200);
}

async function processPayout() {
    elReconMsg.classList.remove('hidden');
    setTimeout(async () => {
        const result = determineWinner(myMove, botMove);
        elReconMsg.classList.add('hidden');
        
        let newBalance = balance;
        let diff = 0;
        if (result.winner === 1) {
            const payout = config.stake * result.mult;
            diff = payout - config.stake;
            newBalance = balance + diff;
            triggerFloatingPayout(payout, 'win');
        } else if (result.winner === 2) {
            diff = -config.stake;
            newBalance = balance + diff;
            triggerFloatingPayout(diff, 'loss');
        }

        setTimeout(async () => {
            updateBalance(newBalance);
            await db.from('user_profiles').update({ balance: newBalance }).eq('wallet_address', currentWallet);
            await db.from('matches').insert([{
                player_move: myMove, bot_move: botMove, outcome: result.name,
                stake: config.stake, payout: result.winner === 1 ? config.stake * result.mult : 0
            }]);
        }, 800);

        showResult(result);
    }, 1200);
}

function determineWinner(p1, p2) {
    const dic = translations[currentLang];
    if (p1 === p2) return { name: dic['draw'], winner: 0, mult: 1 };
    if ((p1 === 'rock' && p2 === 'scissors') || (p1 === 'paper' && p2 === 'rock') || (p1 === 'scissors' && p2 === 'paper'))
        return { name: dic['win'], winner: 1, mult: 1.95 };
    return { name: dic['loss'], winner: 2, mult: 0 };
}

function showResult(result) {
    phase = 'RESULT';
    updatePhaseText();
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
    phase = 'COMMIT';
    updatePhaseText();
    elP1Status.textContent = dic['awaiting'];
    elP1Status.style.color = 'var(--on-surface-variant)';
    elP2Status.textContent = gameMode === 'bot' ? dic['thinking'] : dic['awaiting'];
    elP2Status.style.color = 'var(--on-surface-variant)';
    pvpMoveReceived = null;
}

// Events
document.querySelectorAll('.rps-btn').forEach(btn => btn.onclick = () => selectMove(btn.dataset.move, btn));
document.querySelectorAll('.lang-btn').forEach(btn => btn.onclick = (e) => { e.stopPropagation(); applyLanguage(btn.dataset.lang); });
elLangTrigger.onclick = (e) => { e.stopPropagation(); elLangDropdown.classList.toggle('active'); };
elMusicBtn.onclick = (e) => { e.stopPropagation(); toggleMusic(); };
document.querySelectorAll('.mode-btn').forEach(btn => btn.onclick = () => setMode(btn.dataset.mode));
document.addEventListener('click', () => elLangDropdown.classList.remove('active'));

init();
