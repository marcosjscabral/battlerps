const SUPABASE_URL = 'https://fjjkqwmuycnuzalaeszs.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ox8ZqXVfzYWzjAmtz3KIMg_w3F7fas7';
const { createClient } = window.supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY);

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

    // UI Highlight
    document.querySelectorAll('.rps-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    
    elP1Status.textContent = 'LOCKED';
    elP1Status.style.color = 'var(--primary)';
    
    // Simulate immediate opponent response
    setTimeout(() => {
        botMove = ['rock', 'paper', 'scissors'][Math.floor(Math.random() * 3)];
        elP2Status.textContent = 'READY';
        elP2Status.style.color = 'var(--secondary)';
        
        phase = 'REVEAL';
        elPhase.textContent = 'REVEAL PHASE';
        
        // Hide selection grid
        document.getElementById('move-controls').classList.add('hidden');
        
        // AUTOMATIC REVEAL START
        setTimeout(reveal, 500); 
    }, 400);
}

function reveal() {
    elPhase.textContent = 'BATTLE START!';
    
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
    if (p1 === p2) return { name: 'DRAW MATCH', winner: 0, mult: 1 };
    if (
        (p1 === 'rock' && p2 === 'scissors') ||
        (p1 === 'paper' && p2 === 'rock') ||
        (p1 === 'scissors' && p2 === 'paper')
    ) {
        return { name: 'YOU WIN!', winner: 1, mult: 1.95 };
    }
    return { name: 'YOU LOST!', winner: 2, mult: 0 };
}

function showResult(result, payout) {
    phase = 'RESULT';
    elPhase.textContent = 'BATTLE OVER';
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
        elWinnerAmount.textContent = "STAKE REFUNDED";
    }
}

// Events
document.querySelectorAll('.rps-btn').forEach(btn => {
    btn.onclick = () => selectMove(btn.dataset.move, btn);
});

document.getElementById('new-match-btn').onclick = () => {
    document.getElementById('move-controls').classList.remove('hidden');
    elResultArea.classList.add('hidden');
    phase = 'COMMIT';
    elPhase.textContent = 'COMMITTING';
    elP1Status.textContent = 'Awaiting...';
    elP1Status.style.color = 'var(--on-surface-variant)';
    elP2Status.textContent = 'Thinking...';
    elP2Status.style.color = 'var(--on-surface-variant)';
    document.querySelectorAll('.rps-btn').forEach(b => b.classList.remove('selected'));
};

init();
