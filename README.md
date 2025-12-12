# Jump Math 🎮

A fun 2D jump and run platformer game with math puzzles! Collect coins and avoid obstacles while solving multiplication problems.

## Features

- **Three Themes**: Forest 🌲, Snowy Mountains 🏔️, Beach 🏖️
- **Controls**: 
  - ⬆️ / Space - Jump
  - ⬅️ ➡️ - Move left/right
- **Obstacles**: 
  - Static obstacles (rocks, boxes)
  - Dynamic obstacles (moving spiky balls)
- **Scoring System**:
  - Collect coins → Solve math puzzle → Correct answer = +1 point
  - Touch obstacle → Solve math puzzle → Wrong answer = -1 point
- **Configurable Math**: Set multiplication range (1-12)
- **PWA Support**: Installable as an app, works offline
- **Mobile Friendly**: Touch controls for mobile devices

## How to Play

1. Select a theme (Forest, Snow, or Beach)
2. Configure the multiplication range (default: 1-12)
3. Click "Start Game"
4. Use arrow keys or on-screen buttons to move and jump
5. Collect coins to earn points (solve the math puzzle correctly)
6. Avoid obstacles - if you hit one, you must solve the puzzle correctly to avoid losing a point
7. Game ends if your score drops below -5

## Deployment

### GitHub Pages

1. Create a new GitHub repository
2. Push all files to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/jump-math.git
   git push -u origin main
   ```
3. Go to repository Settings → Pages
4. Select "Deploy from a branch" and choose `main` branch
5. Your game will be available at `https://YOUR_USERNAME.github.io/jump-math/`

### Any Static Hosting

The game is a pure static web app. Just upload these files to any web server:
- `index.html`
- `styles.css`
- `game.js`
- `manifest.json`
- `sw.js`
- `icons/` folder

### Local Development

Simply open `index.html` in a web browser, or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## PWA Installation

On supported browsers, you can install the game as an app:
1. Open the game in Chrome, Edge, or Safari
2. Look for the "Install" option in the browser menu
3. The game will be installed as a standalone app

## Generating Icons

The `icons/icon.svg` file is included as the source. To generate PNG icons for the PWA manifest:

1. Use an online SVG to PNG converter, or
2. Use ImageMagick:
   ```bash
   for size in 72 96 128 144 152 192 384 512; do
     convert -background none icons/icon.svg -resize ${size}x${size} icons/icon-${size}.png
   done
   ```

## File Structure

```
jump-math/
├── index.html      # Main HTML file
├── styles.css      # Styling
├── game.js         # Game logic
├── manifest.json   # PWA manifest
├── sw.js           # Service worker for offline support
├── icons/          # App icons
│   └── icon.svg    # Source icon
└── README.md       # This file
```

## Customization

### Math Operations

Currently the game uses multiplication. To add other operations, modify the `generateMathPuzzle()` function in `game.js`.

### Difficulty

Adjust these constants in `game.js`:
- `CONFIG.gravity` - How fast player falls
- `CONFIG.jumpForce` - How high player jumps
- `CONFIG.coinSpawnRate` - How often coins appear
- `CONFIG.obstacleSpawnRate` - How often obstacles appear
- `CONFIG.scrollSpeed` - How fast the world scrolls

## License

MIT License - Feel free to use and modify!
