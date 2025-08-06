# Emoji Password Breaker

## Game Description

### Overview
Emoji Password Breaker is a web-based logic puzzle game that borrows mechanics from classic games like Mastermind, but puts a colorful, modern twist on it by using emoji symbols as the hidden "password." The player's goal is to deduce a secret sequence of emojis within a limited number of attempts, using hints provided after each guess.

### Game Setup & Objective

- **Objective:**  
  Crack the secret emoji password before running out of guesses.

- **Setup:**  
  At the start of each round, the game randomly selects a sequence (such as three, four, or five emojis) from a larger pool of familiar emojis (e.g., 😊 🍕 🚗 🦄 🎲 ⚽ 💡 🍎).  
  - The chosen password is kept hidden, with only empty slots or "locks" visible on screen.

### Gameplay Steps

1. **Making a Guess:**  
   The player uses an intuitive emoji picker to create a sequence—matching the number of slots—that might fit the secret password.

2. **Submitting & Feedback:**  
   On submitting a guess, the game compares the player's attempt against the secret emoji password.  
   - For each guess, the game gives two types of hints:
     - **Exact Match:** How many emojis are correct *and* in the correct position (e.g., the third emoji is 🍕 in both secret and guess).
     - **Partial Match:** How many emojis are correct, but in the *wrong* position (e.g., secret is 😊🍕🚗 and guess is 🍕😊🚗; 🚗 is an exact match, 😊 and 🍕 are partials).
   - Hints are displayed visually or as counts, helping the player deduce the correct sequence.

3. **Progress Tracking:**  
   - The number of remaining guesses is always visible.
   - Previous guesses and the feedback for each are shown in a list or table.

4. **Game End Conditions:**
   - **Win:** Guess the exact emoji password within the allotted attempts.
   - **Lose:** Run out of attempts—game reveals the correct password for learning; option to restart.

### User Interface

- **Emoji Selector/Grid:**  
  Allows the player to choose from the emoji pool and assemble their guess.
- **Password Slots:**  
  Empty icons representing how many emojis are in the password ("????" at the start).
- **Guess History:**  
  Shows all previous guesses and hints, helping with logical deduction.
- **Feedback/Hint Area:**  
  Clearly displays the number of exact and partial matches for every guess.
- **Controls:**  
  Submit guess button, restart/new game button, and (optionally) difficulty selection.
- **Visual/Sound Effects:**  
  Animations or sound cues when a guess is correct, incorrect, or when the game ends.

### Example Round

- **Secret Password (hidden):** 😊🍕🚗
- **Player's First Guess:** 🎲🍕🚗 → Feedback: 2 exact (🍕, 🚗), 0 partial.
- **Second Guess:** 😊🚗🍕 → Feedback: 1 exact (😊), 2 partial (🚗, 🍕).
- **Third Guess:** 😊🍕🚗 → Feedback: 3 exact! Player wins.

### Why It's Fun

- **Accessible:** Anyone can play—no language barrier or previous gaming experience needed.
- **Mental Challenge:** Players must use deduction, memory, and pattern recognition.
- **Casual, Replayable:** Quick games, with ever-changing emoji combinations and difficulty options.
- **Visual Appeal:** Friendly, colorful, and light-hearted thanks to emoji usage.

### Variations & Enhancements

- Adjust sequence length, emoji pool size, and guesses for difficulty.
- Add timers, scoring, leaderboards, or challenge friends.
- Thematic emoji pools (animals, foods, holidays) for variety.

Emoji Password Breaker is a fast, fresh, and visually engaging logic game that's easy to learn but endlessly replayable thanks to its emoji twist and deduction-based gameplay.