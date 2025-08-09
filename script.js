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
        this.maxLives = 6;
        this.secretPassword = [];
        this.revealedPositions = [];
        this.currentGuess = [];
        this.remainingLives = this.maxLives;
        this.guessHistory = [];
        this.gameEnded = false;
        this.audioEnabled = true;
        this.currentTheme = 'default';
        this.hangmanParts = ['head', 'body', 'left-arm', 'right-arm', 'left-leg', 'right-leg'];
        
        this.initializeElements();
        this.setupEventListeners();
        this.startNewGame();
    }
    
    initializeElements() {
        this.passwordSlotsEl = document.getElementById('password-slots');
        this.guessSlotsEl = document.getElementById('guess-slots');
        this.emojiGridEl = document.getElementById('emoji-grid');
        this.submitGuessBtn = document.getElementById('submit-guess');
        this.remainingLivesEl = document.getElementById('remaining-lives');
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
        this.remainingLives = this.maxLives;
        this.guessHistory = [];
        this.gameEnded = false;
        this.resetHangman();
        
        // Reset any container transformations
        anime.set('.game-container', {
            scale: 1,
            opacity: 1
        });
        
        this.renderPasswordSlots();
        this.renderGuessSlots();
        this.renderEmojiGrid();
        this.updateRemainingLives();
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
                    
                    // Animate the emoji appearing in the slot
                    anime.set(slot, { scale: 0, opacity: 0 });
                    anime({
                        targets: slot,
                        scale: [0, 1.2, 1],
                        opacity: [0, 1],
                        duration: 400,
                        easing: 'easeOutBack'
                    });
                    
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
        this.sessionEmojis.forEach((emoji, index) => {
            const btn = document.createElement('button');
            btn.className = 'emoji-btn';
            btn.textContent = emoji;
            btn.addEventListener('click', () => this.selectEmoji(emoji));
            
            // Initial animation when grid loads
            anime.set(btn, { scale: 0, opacity: 0 });
            anime({
                targets: btn,
                scale: [0, 1.1, 1],
                opacity: [0, 1],
                delay: index * 50,
                duration: 400,
                easing: 'easeOutBack'
            });
            
            this.emojiGridEl.appendChild(btn);
        });
    }
    
    selectEmoji(emoji) {
        const unrevealedCount = this.revealedPositions.filter(revealed => !revealed).length;
        if (this.gameEnded || this.currentGuess.length >= unrevealedCount) return;
        
        this.playClickSound();
        
        // Find the clicked emoji button and animate it
        const emojiButtons = document.querySelectorAll('.emoji-btn');
        const clickedButton = Array.from(emojiButtons).find(btn => btn.textContent === emoji);
        if (clickedButton) {
            anime({
                targets: clickedButton,
                scale: [1, 0.8, 1.1, 1],
                duration: 300,
                easing: 'easeOutQuad'
            });
        }
        
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
        
        // Check if any guessed emojis are correct before revealing
        const hadAnyCorrect = this.hasAnyCorrectEmojis(fullGuess);
        
        this.revealCorrectPositions(fullGuess);
        
        this.guessHistory.push({
            guess: [...fullGuess],
            feedback: feedback
        });
        
        this.addToGuessHistory(fullGuess, feedback);
        
        if (this.revealedPositions.every(revealed => revealed)) {
            this.playVictorySound();
            this.animateVictory();
            setTimeout(() => this.endGame(true), 1000);
        } else {
            // Only punish if ALL guessed emojis were wrong
            if (!hadAnyCorrect) {
                this.remainingLives--;
                this.updateHangman();
                this.updateRemainingLives();
                this.pulseWrongGuess();
                
                if (this.remainingLives === 0) {
                    this.playDefeatSound();
                    this.animateDefeat();
                    setTimeout(() => this.endGame(false), 1000);
                }
            } else {
                // At least one emoji was correct - show positive feedback
                this.pulseCorrectGuess();
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
        const newlyRevealed = [];
        
        // For each emoji that was guessed and exists in secret password
        guessedEmojis.forEach(emoji => {
            if (this.secretPassword.includes(emoji)) {
                // Reveal ALL positions where this emoji appears in the secret password
                for (let i = 0; i < this.passwordLength; i++) {
                    if (this.secretPassword[i] === emoji && !this.revealedPositions[i]) {
                        this.revealedPositions[i] = true;
                        newlyRevealed.push(i);
                    }
                }
            }
        });
        
        // Animate newly revealed positions
        if (newlyRevealed.length > 0) {
            setTimeout(() => {
                this.animateRevealedPositions(newlyRevealed);
            }, 100);
        }
    }
    
    animateRevealedPositions(positions) {
        positions.forEach((position, index) => {
            const slot = this.passwordSlotsEl.children[position];
            if (slot) {
                anime({
                    targets: slot,
                    scale: [1, 1.4, 1.1],
                    rotate: [0, 360, 0],
                    backgroundColor: ['var(--success-color)', '#4caf50', 'var(--success-color)'],
                    delay: index * 150,
                    duration: 800,
                    easing: 'easeOutElastic(1, .8)'
                });
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
        const hadAnyCorrect = this.hasAnyCorrectEmojis(guess);
        
        // Add different styling based on whether the guess had any correct emojis
        if (hadAnyCorrect) {
            historyItem.className = 'history-item partial-correct';
        } else {
            historyItem.className = 'history-item all-wrong';
        }
        
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
        
        // Add mercy indicator
        const mercySpan = document.createElement('span');
        mercySpan.className = 'mercy-indicator';
        if (hadAnyCorrect) {
            mercySpan.textContent = '💚 Mercy';
            mercySpan.style.color = '#4caf50';
        } else {
            mercySpan.textContent = '💀 Punished';
            mercySpan.style.color = '#f44336';
        }
        
        feedbackDiv.appendChild(exactSpan);
        feedbackDiv.appendChild(partialSpan);
        feedbackDiv.appendChild(mercySpan);
        
        historyItem.appendChild(guessDiv);
        historyItem.appendChild(feedbackDiv);
        
        this.historyContainerEl.insertBefore(historyItem, this.historyContainerEl.firstChild);
    }
    
    updateRemainingLives() {
        this.remainingLivesEl.textContent = this.remainingLives;
    }
    
    resetHangman() {
        this.hangmanParts.forEach(part => {
            const element = document.getElementById(part);
            if (element) {
                element.classList.add('hidden');
                // Reset transforms for animation
                anime.set(element, {
                    opacity: 0,
                    scale: 0,
                    rotate: 180
                });
            }
        });
    }
    
    updateHangman() {
        const partIndex = this.maxLives - this.remainingLives - 1;
        if (partIndex >= 0 && partIndex < this.hangmanParts.length) {
            const partToShow = document.getElementById(this.hangmanParts[partIndex]);
            if (partToShow) {
                partToShow.classList.remove('hidden');
                
                // Animate the hangman part appearing
                anime({
                    targets: partToShow,
                    opacity: 1,
                    scale: [0, 1.2, 1],
                    rotate: [180, -10, 0],
                    duration: 800,
                    easing: 'easeOutElastic(1, .8)',
                    complete: () => {
                        // Shake the entire hangman drawing
                        this.shakeHangman();
                    }
                });
            }
        }
    }
    
    shakeHangman() {
        const hangmanDrawing = document.getElementById('hangman-drawing');
        anime({
            targets: hangmanDrawing,
            translateX: [0, -5, 5, -3, 3, -1, 1, 0],
            translateY: [0, -2, 2, -1, 1, 0],
            duration: 600,
            easing: 'easeOutQuad'
        });
    }
    
    hasAnyCorrectEmojis(guess) {
        // Check if any of the newly guessed emojis exist in the secret password
        const newGuesses = guess.filter((emoji, index) => !this.revealedPositions[index]);
        return newGuesses.some(emoji => this.secretPassword.includes(emoji));
    }
    
    pulseWrongGuess() {
        // Pulse the guess slots to indicate completely wrong guess
        const filledSlots = document.querySelectorAll('.guess-slot.filled');
        anime({
            targets: filledSlots,
            scale: [1, 1.1, 1],
            backgroundColor: ['#ffebee', '#f44336', '#ffebee'],
            duration: 500,
            easing: 'easeInOutQuad'
        });
    }
    
    pulseCorrectGuess() {
        // Pulse the guess slots to indicate at least one correct emoji
        const filledSlots = document.querySelectorAll('.guess-slot.filled');
        anime({
            targets: filledSlots,
            scale: [1, 1.15, 1],
            backgroundColor: ['#e8f5e9', '#4caf50', '#e8f5e9'],
            duration: 600,
            easing: 'easeInOutQuad'
        });
        
        // Also pulse the lives counter positively
        anime({
            targets: this.remainingLivesEl,
            scale: [1, 1.2, 1],
            color: ['var(--text-primary)', '#4caf50', 'var(--text-primary)'],
            duration: 400,
            easing: 'easeOutBack'
        });
    }
    
    animateVictory() {
        // Celebrate with confetti-like animation
        const passwordSlots = document.querySelectorAll('.password-slot');
        
        anime({
            targets: passwordSlots,
            scale: [1, 1.3, 1.1],
            rotate: [0, 10, -5, 0],
            backgroundColor: ['var(--success-color)', '#4caf50', 'var(--success-color)'],
            delay: anime.stagger(100),
            duration: 1000,
            easing: 'easeOutElastic(1, .8)'
        });
        
        // Animate the game container
        anime({
            targets: '.game-container',
            scale: [1, 1.02, 1],
            duration: 1000,
            easing: 'easeInOutQuad'
        });
    }
    
    animateDefeat() {
        // Dramatic defeat animation
        const hangmanDrawing = document.getElementById('hangman-drawing');
        
        // Final dramatic shake
        anime({
            targets: hangmanDrawing,
            translateX: [0, -10, 10, -8, 8, -5, 5, 0],
            translateY: [0, -5, 5, -3, 3, 0],
            duration: 1000,
            easing: 'easeOutQuad'
        });
        
        // Fade out the game container slightly
        anime({
            targets: '.game-container',
            scale: [1, 0.98, 1],
            opacity: [1, 0.9, 1],
            duration: 1000,
            easing: 'easeInOutQuad'
        });
    }
    
    clearGuessHistory() {
        this.historyContainerEl.innerHTML = '';
    }
    
    endGame(won) {
        this.gameEnded = true;
        
        if (won) {
            this.resultTitleEl.textContent = '🎉 You Won!';
            this.resultTitleEl.className = 'win';
            this.resultMessageEl.textContent = `Congratulations! You cracked the password in ${this.maxLives - this.remainingLives} attempts!`;
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