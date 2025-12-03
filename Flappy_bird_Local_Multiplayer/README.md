# 🐦 Flappy Bird - Local Multiplayer

A retro-styled, local multiplayer Flappy Bird game built with vanilla JavaScript. Challenge your friends on the same device with customizable difficulty settings and dynamic gameplay!

![Game Preview](https://693034fb837d48be8892ad4b--flappy-bird-duo.netlify.app/)

## 🎮 Play Now

**Live Demo:** [https://flappy-bird-duo.netlify.app](https://693034fb837d48be8892ad4b--flappy-bird-duo.netlify.app/)

## ✨ Features

- **🎯 Local Multiplayer**: 2 players on the same screen
- **📱 Mobile Compatible**: Touch controls for mobile devices
- **🎚️ Difficulty Levels**: Easy, Medium, and Hard modes
- **⚡ Dynamic Speed**: Game speed increases over time (Temple Run style)
- **🔊 Sound Effects**: Calm, synthesized audio using Web Audio API
- **💥 Particle Effects**: Visual feedback on bird collisions
- **🎨 Retro Design**: Pixel-art style with classic Flappy Bird aesthetics
- **📊 Score Tracking**: Real-time scoring for both players

## 🕹️ Controls

### Desktop
- **Player 1**: `Space` key
- **Player 2**: `Up Arrow` key

### Mobile
- **Player 1**: Yellow button (bottom left)
- **Player 2**: Red button (bottom right)

## 🎯 Difficulty Settings

| Difficulty | Gravity | Pipe Gap | Pipe Spacing |
|-----------|---------|----------|--------------|
| **Easy** | Very Low (Floaty) | 190px | 220 frames |
| **Medium** | Standard | 165px | 170 frames |
| **Hard** | High (Heavy) | 140px | 130 frames |

## 🚀 How to Play

1. Enter player names on the home screen
2. (Optional) Adjust difficulty in settings
3. Click **START GAME**
4. Wait for the 3-second countdown
5. Avoid pipes and the ground!
6. The player with the highest score wins

## 📁 Project Structure

```
Flappy_bird_Local_Multiplayer/
├── index.html          # Main HTML file
├── style.css           # Styling and layout
├── js/
│   ├── main.js        # Entry point
│   ├── game.js        # Game logic and loop
│   ├── entities.js    # Bird, Pipe, Background, Particle classes
│   ├── input.js       # Keyboard and touch input handling
│   ├── ui.js          # UI management
│   └── sound.js       # Sound effects with Web Audio API
└── README.md          # This file
```

## 🛠️ Technologies Used

- **HTML5 Canvas** - Game rendering
- **Vanilla JavaScript** - Game logic (ES6 modules)
- **CSS3** - Styling and animations
- **Web Audio API** - Synthesized sound effects
- **Google Fonts** - "Press Start 2P" retro font

## 🎨 Design Philosophy

The game follows a retro pixel-art aesthetic inspired by the original Flappy Bird, with:
- Classic color palette (sky blue, green pipes, yellow/red birds)
- Pixel-perfect rendering
- Retro "Press Start 2P" font
- Smooth animations and particle effects

## 🔧 Local Development

1. Clone or download this repository
2. Open `index.html` in a modern web browser
3. No build process or dependencies required!

```bash
# Simply open the file
open index.html  # macOS
start index.html # Windows
```

## 🌐 Deployment

This game is deployed on **Netlify** and can be accessed at:
[https://jade-llama-6dd789.netlify.app](https://jade-llama-6dd789.netlify.app)

### Deploy Your Own

1. Fork or download this repository
2. Go to [Netlify Drop](https://app.netlify.com/drop)
3. Drag the project folder onto the page
4. Get your instant live URL!

## 📱 Mobile Compatibility

The game is fully responsive and works on:
- ✅ Desktop browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ✅ Tablets
- ✅ Touch-enabled devices

## 🎵 Sound Effects

All sound effects are procedurally generated using the Web Audio API:
- **Jump**: Soft rising tone (300-500 Hz)
- **Score**: Gentle two-note chime (C5 + E5)
- **Death**: Subtle descending tone (400-150 Hz)

Volume is set to 15% for a calm, non-intrusive experience.

## 🐛 Known Issues

None at the moment! If you find any bugs, please report them.

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Created with ❤️ by Aryan

## 🙏 Acknowledgments

- Inspired by the original Flappy Bird by Dong Nguyen
- Font: "Press Start 2P" by CodeMan38

---

**Enjoy the game!** 🎮🐦
