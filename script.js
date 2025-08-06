class EmojiPasswordBreaker {
    constructor() {
        this.emojis = ['😊', '🍕', '🚗', '🦄', '🎲', '⚽', '💡', '🍎', '🌟', '🎵', '🔥', '💎', '🍰', '🌈', '🐱', '🏆'];
        this.passwordLength = 4;
        this.maxAttempts = 6;
        this.secretPassword = [];
        this.revealedPositions = [];
        this.currentGuess = [];
        this.remainingAttempts = this.maxAttempts;
        this.guessHistory = [];
        this.gameEnded = false;
        
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
    }
    
    setupEventListeners() {
        this.submitGuessBtn.addEventListener('click', () => this.submitGuess());
        this.newGameBtn.addEventListener('click', () => this.startNewGame());
        this.playAgainBtn.addEventListener('click', () => this.startNewGame());
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !this.submitGuessBtn.disabled && !this.gameEnded) {
                this.submitGuess();
            }
        });
    }
    
    startNewGame() {
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
    
    generateSecretPassword() {
        const shuffled = [...this.emojis].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, this.passwordLength);
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
        this.emojis.forEach(emoji => {
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
            this.endGame(true);
        } else {
            this.remainingAttempts--;
            this.updateRemainingAttempts();
            
            if (this.remainingAttempts === 0) {
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
        for (let i = 0; i < this.passwordLength; i++) {
            if (!this.revealedPositions[i] && guess[i] === this.secretPassword[i]) {
                this.revealedPositions[i] = true;
            }
        }
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