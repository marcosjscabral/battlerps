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
        'refund': 'STAKE REFUNDED'
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
        'refund': 'APUESTA REEMBOLSADA'
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
        'play-again': 'JOGAR NOVAMENTE',
        'syncing': 'SINCRONIZANDO PAGAMENTO...',
        'win': 'VOCÊ VENCEU!',
        'loss': 'VOCÊ PERDEU!',
        'draw': 'EMPATE',
        'refund': 'APOSTA REEMBOLSADA'
    }
};

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
const currentWallet = 'USER-123';

// DOM Elements
const elBalance = document.getElementById('user-balance');
const elPhase = document.getElementById('phase-chip');
const elReconMsg = document.getElementById('recon-msg');
const elResultArea = document.getElementById('result-overlay');
const elWinnerText = document.getElementById('winner-text');
const elWinnerAmount = document.getElementById('winner-amount');
const elP1Status = document.getElementById('p1-status');
const elP2Status = document.getElementById('p2-status');
const overlay = document.getElementById('animation-overlay');
const h1 = document.getElementById('p1-anim-hand');
const h2 = document.getElementById('p2-anim-hand');

async function init() {
    applyLanguage(currentLang);
    
    // Fetch initial balance from Supabase
    const { data, error } = await db
        .from('user_profiles')
        .select('balance')
        .eq('wallet_address', currentWallet)
        .single();
    
    if (data) {
        updateBalance(data.balance);
    } else {
        console.error("Profile not found, creating one...", error);
        await db.from('user_profiles').insert([{ wallet_address: currentWallet, balance: 1500.00 }]);
        updateBalance(1500.00);
    }
}

function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('battlerps-lang', lang);
    
    const dic = translations[lang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dic[key]) {
            el.textContent = dic[key];
        }
    });

    // Handle dynamic parts
    if (phase === 'COMMIT') elPhase.textContent = dic['phase-committing'];
    if (phase === 'REVEAL') elPhase.textContent = dic['phase-reveal'];
    if (phase === 'BATTLE') elPhase.textContent = dic['phase-battle'];
    if (phase === 'RESULT') elPhase.textContent = dic['phase-over'];

    // Update active flag
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
}

function updateBalance(newBalance) {
    balance = newBalance;
    elBalance.textContent = balance.toFixed(2);
}

async function syncBalanceToSupabase(newBalance) {
    await db
        .from('user_profiles')
        .update({ balance: newBalance })
        .eq('wallet_address', currentWallet);
}

async function saveMatchToSupabase(matchData) {
    await db
        .from('matches')
        .insert([matchData]);
}

function selectMove(move, btn) {
    if (phase !== 'COMMIT') return;
    
    myMove = move;
    const dic = translations[currentLang];

    // UI Highlight
    document.querySelectorAll('.rps-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    
    elP1Status.textContent = dic['locked'];
    elP1Status.style.color = 'var(--primary)';
    
    // Simulate immediate opponent response
    setTimeout(() => {
        botMove = ['rock', 'paper', 'scissors'][Math.floor(Math.random() * 3)];
        elP2Status.textContent = dic['ready'];
        elP2Status.style.color = 'var(--secondary)';
        
        phase = 'REVEAL';
        elPhase.textContent = dic['phase-reveal'];
        
        // Hide selection grid
        document.getElementById('move-controls').classList.add('hidden');
        
        // AUTOMATIC REVEAL START
        setTimeout(reveal, 500); 
    }, 400);
}

function reveal() {
    const dic = translations[currentLang];
    phase = 'BATTLE';
    elPhase.textContent = dic['phase-battle'];
    
    // Start Animation Sequence
    overlay.classList.remove('hidden');
    h1.textContent = '✊';
    h2.textContent = '✊';
    h1.style.animation = 'hand-bounce-p1 0.4s ease-in-out infinite';
    h2.style.animation = 'hand-bounce-p2 0.4s ease-in-out infinite';
    
    // 3 Bounces (1.2s total)
    setTimeout(() => {
        // Stop bounce and show final hands
        h1.style.animation = 'none';
        h2.style.animation = 'none';
        h1.textContent = moveEmojis[myMove];
        h2.textContent = moveEmojis[botMove];
        
        // Show result after seeing the hands
        setTimeout(() => {
            overlay.classList.add('hidden');
            processPayout();
        }, 1500);
    }, 1200);
}

function processPayout() {
    elReconMsg.classList.remove('hidden');
    
    setTimeout(async () => {
        const result = determineWinner(myMove, botMove);
        elReconMsg.classList.add('hidden');
        
        // Persist to Supabase
        let newBalance = balance;
        let payout = 0;
        if (result.winner === 1) {
            payout = config.stake * result.mult;
            newBalance = balance + (payout - config.stake);
        } else if (result.winner === 2) {
            newBalance = balance - config.stake;
        }

        updateBalance(newBalance);
        await syncBalanceToSupabase(newBalance);
        await saveMatchToSupabase({
            player_move: myMove,
            bot_move: botMove,
            outcome: result.name,
            stake: config.stake,
            payout: payout
        });

        showResult(result, payout);
    }, 1200);
}

function determineWinner(p1, p2) {
    const dic = translations[currentLang];
    if (p1 === p2) return { name: dic['draw'], winner: 0, mult: 1 };
    if (
        (p1 === 'rock' && p2 === 'scissors') ||
        (p1 === 'paper' && p2 === 'rock') ||
        (p1 === 'scissors' && p2 === 'paper')
    ) {
        return { name: dic['win'], winner: 1, mult: 1.95 };
    }
    return { name: dic['loss'], winner: 2, mult: 0 };
}

function showResult(result, payout) {
    const dic = translations[currentLang];
    phase = 'RESULT';
    elPhase.textContent = dic['phase-over'];
    elResultArea.classList.remove('hidden');
    elWinnerText.textContent = result.name;
    
    if (result.winner === 1) {
        elWinnerText.style.color = 'var(--primary)';
        elWinnerAmount.textContent = `+${payout.toFixed(2)} USDC`;
    } else if (result.winner === 2) {
        elWinnerText.style.color = '#b31b25';
        elWinnerAmount.textContent = `-${config.stake.toFixed(2)} USDC`;
    } else {
        elWinnerText.style.color = 'var(--tertiary)';
        elWinnerAmount.textContent = dic['refund'];
    }
}

// Events
document.querySelectorAll('.rps-btn').forEach(btn => {
    btn.onclick = () => selectMove(btn.dataset.move, btn);
});

document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.onclick = () => applyLanguage(btn.dataset.lang);
});

document.getElementById('new-match-btn').onclick = () => {
    const dic = translations[currentLang];
    document.getElementById('move-controls').classList.remove('hidden');
    elResultArea.classList.add('hidden');
    phase = 'COMMIT';
    elPhase.textContent = dic['phase-committing'];
    elP1Status.textContent = dic['awaiting'];
    elP1Status.style.color = 'var(--on-surface-variant)';
    elP2Status.textContent = dic['thinking'];
    elP2Status.style.color = 'var(--on-surface-variant)';
    document.querySelectorAll('.rps-btn').forEach(b => b.classList.remove('selected'));
};

init();
