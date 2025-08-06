class EmojiPasswordBreaker {
    constructor() {
        this.allEmojis = [
            // Faces
            '😊', '😂', '🥰', '😎', '🤔', '😴', '🤗', '🙄', '😇', '🤓',
            '😋', '🤤', '🥳', '😍', '🤩', '😜', '🤪', '😏', '🥺', '😢',
            
            // Animals & Nature
            '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
            '🦁', '🐮', '🐷', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔',
            '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺',
            '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟',
            '🌸', '🌼', '🌻', '🌺', '🌷', '🌹', '🥀', '🌿', '🍀', '🌳',
            
            // Food & Drink
            '🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🥝', '🍑', '🍒',
            '🥭', '🍍', '🥥', '🥑', '🍆', '🥒', '🥬', '🌶️', '🌽', '🥕',
            '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🥞', '🧇', '🥓', '🍗',
            '🍖', '🌭', '🍔', '🍟', '🍕', '🥪', '🌮', '🌯', '🥙', '🧆',
            '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🍤', '🍙', '🍘',
            '🍰', '🧁', '🥧', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪',
            
            // Objects & Symbols
            '⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸',
            '🎯', '🎮', '🕹️', '🎲', '🧩', '🎨', '🎭', '🎪', '🎹', '🎸',
            '🥁', '🎺', '🎷', '🎻', '🎤', '🎧', '📱', '💻', '⌚', '📷',
            '💡', '🔋', '🕯️', '💎', '🏆', '🥇', '🥈', '🥉', '⭐', '🌟',
            '🔥', '⚡', '💧', '🌈', '☀️', '🌙', '⛅', '❄️', '☃️', '🎄'
        ];
        this.sessionEmojis = [];
        this.passwordLength = 4;
        this.maxAttempts = 6;
        this.secretPassword = [];
        this.revealedPositions = [];
        this.currentGuess = [];
        this.remainingAttempts = this.maxAttempts;
        this.guessHistory = [];
        this.gameEnded = false;
        this.audioEnabled = true;
        this.currentTheme = 'default';
        
        this.initializeElements();
        this.setupEventListeners();
        this.startNewGame();
    }
    
    initializeElements() {
        this.passwordSlotsEl = document.getElementById('password-slots');
        this.guessSlotsEl = document.getElementById('guess-slots');
        this.emojiGridEl = document.getElementById('emoji-grid');
        this.submitGuessBtn = document.getElementById('submit-guess');
        this.remainingAttemptsEl = document.getElementById('remaining-attempts');
        this.historyContainerEl = document.getElementById('history-container');
        this.gameResultEl = document.getElementById('game-result');
        this.resultTitleEl = document.getElementById('result-title');
        this.resultMessageEl = document.getElementById('result-message');
        this.secretPasswordEl = document.getElementById('secret-password');
        this.newGameBtn = document.getElementById('new-game-btn');
        this.playAgainBtn = document.getElementById('play-again');
        this.themeSelect = document.getElementById('theme-select');
        this.audioToggleBtn = document.getElementById('audio-toggle');
        
        this.initializeAudio();
    }
    
    setupEventListeners() {
        this.submitGuessBtn.addEventListener('click', () => this.submitGuess());
        this.newGameBtn.addEventListener('click', () => this.startNewGame());
        this.playAgainBtn.addEventListener('click', () => this.startNewGame());
        this.themeSelect.addEventListener('change', (e) => this.changeTheme(e.target.value));
        this.audioToggleBtn.addEventListener('click', () => this.toggleAudio());
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !this.submitGuessBtn.disabled && !this.gameEnded) {
                this.submitGuess();
            }
        });
    }
    
    initializeAudio() {
        // Create audio context for web audio API
        this.audioContext = null;
        this.clickSound = null;
        this.victorySound = null;
        this.defeatSound = null;
        
        // Initialize audio on first user interaction
        document.addEventListener('click', () => this.initAudioContext(), { once: true });
    }
    
    initAudioContext() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.createSounds();
        }
    }
    
    createSounds() {
        // Create click sound (short beep)
        this.clickSound = this.createBeepSound(800, 0.1, 0.1);
        
        // Create victory sound (ascending notes)
        this.victorySound = this.createMelody([
            {freq: 523, duration: 0.2},
            {freq: 659, duration: 0.2},
            {freq: 784, duration: 0.4}
        ]);
        
        // Create defeat sound (descending notes)
        this.defeatSound = this.createMelody([
            {freq: 392, duration: 0.3},
            {freq: 330, duration: 0.3},
            {freq: 262, duration: 0.5}
        ]);
    }
    
    createBeepSound(frequency, duration, volume) {
        return () => {
            if (!this.audioEnabled || !this.audioContext) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
            gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }
    
    createMelody(notes) {
        return () => {
            if (!this.audioEnabled || !this.audioContext) return;
            
            let currentTime = this.audioContext.currentTime;
            
            notes.forEach(note => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.value = note.freq;
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0, currentTime);
                gainNode.gain.linearRampToValueAtTime(0.1, currentTime + 0.01);
                gainNode.gain.linearRampToValueAtTime(0, currentTime + note.duration);
                
                oscillator.start(currentTime);
                oscillator.stop(currentTime + note.duration);
                
                currentTime += note.duration;
            });
        };
    }
    
    playClickSound() {
        if (this.clickSound) {
            this.clickSound();
        }
    }
    
    playVictorySound() {
        if (this.victorySound) {
            this.victorySound();
        }
    }
    
    playDefeatSound() {
        if (this.defeatSound) {
            this.defeatSound();
        }
    }
    
    toggleAudio() {
        this.audioEnabled = !this.audioEnabled;
        this.audioToggleBtn.textContent = this.audioEnabled ? '🔊' : '🔇';
        this.audioToggleBtn.classList.toggle('muted', !this.audioEnabled);
    }
    
    changeTheme(theme) {
        this.currentTheme = theme;
        document.body.setAttribute('data-theme', theme === 'default' ? '' : theme);
    }

    startNewGame() {
        this.selectSessionEmojis();
        this.secretPassword = this.generateSecretPassword();
        this.revealedPositions = new Array(this.passwordLength).fill(false);
        this.currentGuess = [];
        this.remainingAttempts = this.maxAttempts;
        this.guessHistory = [];
        this.gameEnded = false;
        
        this.renderPasswordSlots();
        this.renderGuessSlots();
        this.renderEmojiGrid();
        this.updateRemainingAttempts();
        this.clearGuessHistory();
        this.hideGameResult();
        this.updateSubmitButton();
    }
    
    selectSessionEmojis() {
        const shuffled = [...this.allEmojis].sort(() => 0.5 - Math.random());
        this.sessionEmojis = shuffled.slice(0, 20);
    }
    
    generateSecretPassword() {
        const password = [];
        for (let i = 0; i < this.passwordLength; i++) {
            const randomEmoji = this.sessionEmojis[Math.floor(Math.random() * this.sessionEmojis.length)];
            password.push(randomEmoji);
        }
        return password;
    }
    
    renderPasswordSlots() {
        this.passwordSlotsEl.innerHTML = '';
        for (let i = 0; i < this.passwordLength; i++) {
            const slot = document.createElement('div');
            slot.className = 'password-slot';
            if (this.revealedPositions[i]) {
                slot.textContent = this.secretPassword[i];
                slot.classList.add('revealed');
            } else {
                slot.textContent = '❓';
            }
            this.passwordSlotsEl.appendChild(slot);
        }
    }
    
    renderGuessSlots() {
        this.guessSlotsEl.innerHTML = '';
        let guessIndex = 0;
        for (let i = 0; i < this.passwordLength; i++) {
            const slot = document.createElement('div');
            slot.className = 'guess-slot';
            
            if (this.revealedPositions[i]) {
                slot.textContent = this.secretPassword[i];
                slot.classList.add('locked');
            } else {
                if (guessIndex < this.currentGuess.length) {
                    slot.textContent = this.currentGuess[guessIndex];
                    slot.classList.add('filled');
                    guessIndex++;
                } else if (guessIndex === this.currentGuess.length) {
                    slot.classList.add('active');
                    guessIndex++;
                }
            }
            this.guessSlotsEl.appendChild(slot);
        }
    }
    
    renderEmojiGrid() {
        this.emojiGridEl.innerHTML = '';
        this.sessionEmojis.forEach(emoji => {
            const btn = document.createElement('button');
            btn.className = 'emoji-btn';
            btn.textContent = emoji;
            btn.addEventListener('click', () => this.selectEmoji(emoji));
            this.emojiGridEl.appendChild(btn);
        });
    }
    
    selectEmoji(emoji) {
        const unrevealedCount = this.revealedPositions.filter(revealed => !revealed).length;
        if (this.gameEnded || this.currentGuess.length >= unrevealedCount) return;
        
        this.playClickSound();
        this.currentGuess.push(emoji);
        this.renderGuessSlots();
        this.updateSubmitButton();
    }
    
    removeLastEmoji() {
        if (this.gameEnded || this.currentGuess.length === 0) return;
        
        this.currentGuess.pop();
        this.renderGuessSlots();
        this.updateSubmitButton();
    }
    
    updateSubmitButton() {
        const unrevealedCount = this.revealedPositions.filter(revealed => !revealed).length;
        this.submitGuessBtn.disabled = this.currentGuess.length !== unrevealedCount || this.gameEnded;
    }
    
    submitGuess() {
        const unrevealedCount = this.revealedPositions.filter(revealed => !revealed).length;
        if (this.gameEnded || this.currentGuess.length !== unrevealedCount) return;
        
        const fullGuess = this.buildFullGuess();
        const feedback = this.calculateFeedback(fullGuess, this.secretPassword);
        
        this.revealCorrectPositions(fullGuess);
        
        this.guessHistory.push({
            guess: [...fullGuess],
            feedback: feedback
        });
        
        this.addToGuessHistory(fullGuess, feedback);
        
        if (this.revealedPositions.every(revealed => revealed)) {
            this.playVictorySound();
            this.endGame(true);
        } else {
            this.remainingAttempts--;
            this.updateRemainingAttempts();
            
            if (this.remainingAttempts === 0) {
                this.playDefeatSound();
                this.endGame(false);
            }
        }
        
        this.currentGuess = [];
        this.renderPasswordSlots();
        this.renderGuessSlots();
        this.updateSubmitButton();
    }
    
    buildFullGuess() {
        const fullGuess = [];
        let guessIndex = 0;
        
        for (let i = 0; i < this.passwordLength; i++) {
            if (this.revealedPositions[i]) {
                fullGuess.push(this.secretPassword[i]);
            } else {
                fullGuess.push(this.currentGuess[guessIndex]);
                guessIndex++;
            }
        }
        
        return fullGuess;
    }
    
    revealCorrectPositions(guess) {
        // Find all emojis that appear in both guess and secret password
        const guessedEmojis = new Set(guess.filter((emoji, index) => !this.revealedPositions[index]));
        
        // For each emoji that was guessed and exists in secret password
        guessedEmojis.forEach(emoji => {
            if (this.secretPassword.includes(emoji)) {
                // Reveal ALL positions where this emoji appears in the secret password
                for (let i = 0; i < this.passwordLength; i++) {
                    if (this.secretPassword[i] === emoji) {
                        this.revealedPositions[i] = true;
                    }
                }
            }
        });
    }

    calculateFeedback(guess, secret) {
        let exact = 0;
        let partial = 0;
        
        const secretCopy = [...secret];
        const guessCopy = [...guess];
        
        for (let i = 0; i < guess.length; i++) {
            if (guess[i] === secret[i]) {
                exact++;
                secretCopy[i] = null;
                guessCopy[i] = null;
            }
        }
        
        for (let i = 0; i < guessCopy.length; i++) {
            if (guessCopy[i] !== null) {
                const secretIndex = secretCopy.indexOf(guessCopy[i]);
                if (secretIndex !== -1) {
                    partial++;
                    secretCopy[secretIndex] = null;
                }
            }
        }
        
        return { exact, partial };
    }
    
    addToGuessHistory(guess, feedback) {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const guessDiv = document.createElement('div');
        guessDiv.className = 'history-guess';
        guess.forEach(emoji => {
            const emojiSpan = document.createElement('span');
            emojiSpan.className = 'history-emoji';
            emojiSpan.textContent = emoji;
            guessDiv.appendChild(emojiSpan);
        });
        
        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = 'history-feedback';
        
        const exactSpan = document.createElement('span');
        exactSpan.className = 'exact-matches';
        exactSpan.textContent = `✅ ${feedback.exact}`;
        
        const partialSpan = document.createElement('span');
        partialSpan.className = 'partial-matches';
        partialSpan.textContent = `⚠️ ${feedback.partial}`;
        
        feedbackDiv.appendChild(exactSpan);
        feedbackDiv.appendChild(partialSpan);
        
        historyItem.appendChild(guessDiv);
        historyItem.appendChild(feedbackDiv);
        
        this.historyContainerEl.insertBefore(historyItem, this.historyContainerEl.firstChild);
    }
    
    updateRemainingAttempts() {
        this.remainingAttemptsEl.textContent = this.remainingAttempts;
    }
    
    clearGuessHistory() {
        this.historyContainerEl.innerHTML = '';
    }
    
    endGame(won) {
        this.gameEnded = true;
        
        if (won) {
            this.resultTitleEl.textContent = '🎉 You Won!';
            this.resultTitleEl.className = 'win';
            this.resultMessageEl.textContent = `Congratulations! You cracked the password in ${this.maxAttempts - this.remainingAttempts} attempts!`;
        } else {
            this.resultTitleEl.textContent = '💀 Game Over';
            this.resultTitleEl.className = 'lose';
            this.resultMessageEl.textContent = 'You ran out of attempts! Better luck next time!';
        }
        
        this.showSecretPassword();
        this.showGameResult();
        this.revealPasswordSlots();
    }
    
    showSecretPassword() {
        this.secretPasswordEl.innerHTML = `
            <h4>The secret password was:</h4>
            <div class="secret-password-display">
                ${this.secretPassword.map(emoji => `<span class="secret-emoji">${emoji}</span>`).join('')}
            </div>
        `;
    }
    
    revealPasswordSlots() {
        const slots = this.passwordSlotsEl.querySelectorAll('.password-slot');
        this.secretPassword.forEach((emoji, index) => {
            if (slots[index]) {
                slots[index].textContent = emoji;
                slots[index].classList.add('revealed');
            }
        });
    }
    
    showGameResult() {
        this.gameResultEl.classList.remove('hidden');
    }
    
    hideGameResult() {
        this.gameResultEl.classList.add('hidden');
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && game) {
        e.preventDefault();
        game.removeLastEmoji();
    }
});

let game;
document.addEventListener('DOMContentLoaded', () => {
    game = new EmojiPasswordBreaker();
});