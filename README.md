# 🔓 Emoji Password Breaker

> A fun, colorful twist on the classic Mastermind game using emojis! Crack the secret emoji password using deduction and logic with an animated hangman twist.

## ✨ Features

- 🎯 **Progressive Revelation**: Correct emojis are revealed and locked as you guess
- 🎲 **120+ Emojis**: Huge variety across faces, animals, food, and objects  
- 🔀 **Random Selection**: 20 random emojis picked for each game session
- 🎭 **Animated Hangman**: Visual hangman with smooth Anime.js animations
- 💚 **Mercy Rule**: Only lose life when ALL guesses are wrong
- 📱 **Mobile Responsive**: Perfect gameplay on any device
- 🎨 **Beautiful UI**: Modern gradient design with engaging animations
- 🎵 **Sound Effects**: Audio feedback with theme support
- 🌈 **Multiple Themes**: Ocean, Forest, Sunset color schemes
- ⌨️ **Keyboard Support**: Use Enter to submit, Backspace to remove
- 📊 **Smart Feedback**: Visual hints show exact and partial matches
- 🏆 **Challenge Mode**: 4-emoji passwords with 6 lives

## 🎯 How to Play

1. **Objective**: Crack the secret 4-emoji password before the hangman is complete
2. **Make a Guess**: Click emojis from the 20 available to build your guess sequence
3. **Get Feedback**: 
   - ✅ **Exact matches**: Correct emoji in correct position
   - ⚠️ **Partial matches**: Correct emoji in wrong position
   - 💚 **Mercy**: At least one emoji was correct - no hangman progress
   - 💀 **Punished**: All emojis wrong - hangman gets a new body part
4. **Progressive Unlock**: Any matching emojis get revealed and locked permanently
5. **Win Condition**: Reveal all positions before the hangman drawing is complete!

## 🚀 Quick Start

### Run Locally
```bash
# Clone the repository
git clone https://github.com/your-username/emoji_game.git

# Navigate to the project
cd emoji_game

# Open in browser
open index.html
# or use a local server
python -m http.server 8000
```

## 🛠️ Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+)
- **Animations**: Anime.js library
- **Styling**: CSS3 with Flexbox/Grid and custom themes
- **Design**: Responsive mobile-first approach
- **Audio**: Web Audio API for sound effects
- **Icons**: Native emoji support

## 🎮 Game Mechanics

### Hangman Integration
Visual hangman system replaces traditional attempt counting:
- 6 body parts: head, body, left arm, right arm, left leg, right leg
- Smooth animations when parts appear with shake effects
- Only progresses when ALL guesses are completely wrong

### Mercy Rule System
- If any guessed emoji is correct → No hangman progress (mercy)
- If all guessed emojis are wrong → Hangman gets new body part (punished)
- Visual feedback shows mercy vs punished states in history

### Smart Revelation System
Unlike traditional Mastermind, this game reveals **all positions** of correctly guessed emojis:
- Guess 🍕 and it appears in positions 1 & 3? Both get revealed!
- Continue with only unrevealed positions
- Duplicate emojis are handled intelligently

### Dynamic Emoji Pool
- 120+ carefully selected emojis
- 20 random emojis per game session
- Categories: Faces, Animals, Food, Objects
- No language barriers - universal fun!

## 🎬 Animation Features

- **Hangman Progression**: Elastic bounce animations when body parts appear
- **Emoji Selection**: Scale and pulse effects on button clicks
- **Guess Slots**: Smooth entrance animations with bounce effects
- **Victory Celebration**: Password slots dance with staggered animations
- **Defeat Drama**: Intense shake effects and container fading
- **Mercy Feedback**: Green pulse for correct guesses, red for wrong
- **Theme Transitions**: Smooth color scheme changes

## 🤝 Contributing

We love contributions! Here are ways you can help:

- 🐛 Report bugs or issues
- 💡 Suggest new features
- 🎨 Improve UI/UX design
- 📝 Enhance documentation
- 🧪 Add tests

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🗺️ Roadmap

- [x] 🎭 Animated hangman system with Anime.js
- [x] 💚 Mercy rule for fair gameplay
- [x] 🎵 Sound effects and theme support
- [ ] 🏆 Scoring system and leaderboards
- [ ] ⏱️ Timed challenges
- [ ] 👥 Multiplayer mode
- [ ] 🎯 Difficulty levels (3, 5, 6 emoji passwords)
- [ ] 🌍 Internationalization
- [ ] 📊 Game statistics and analytics

## 🎉 Why You'll Love It

- **No Registration**: Jump right in and play
- **Forgiving Gameplay**: Mercy rule makes it less frustrating
- **Satisfying Animations**: Every interaction feels responsive and fun
- **Brain Training**: Improves logic and deduction skills
- **Stress Relief**: Colorful, calming emoji interface with smooth animations
- **Universal Appeal**: No language barriers
- **Quick Sessions**: Perfect for short breaks

## 📄 License

This project is licensed under the MIT License.

## 🌟 Show Your Support

If you enjoyed this game, please consider:
- ⭐ Starring this repository
- 🍴 Forking to create your own version
- 📢 Sharing with friends and colleagues
- 💬 Providing feedback and suggestions

---

<div align="center">

**🎮 Emoji Password Breaker with Hangman** 

Made with ❤️ and lots of emojis

</div>