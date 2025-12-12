# Jump Math 🎮

A fun 2D jump and run platformer game with math puzzles! Collect coins and avoid obstacles while solving multiplication problems.

🎮 **[Play Now](https://skycler.github.io/jump-math/)**

## Features

- **Three Themes**: Forest 🌲, Snowy Mountains 🏔️, Beach 🏖️
- **Theme-Specific Obstacles**:
  - 🌲 Forest: Fallen logs, angry bees
  - 🏔️ Snow: Ice blocks, rolling snowballs  
  - 🏖️ Beach: Sandcastles, scuttling crabs
- **Platforms**: Jump on platforms to reach coins higher up
- **Sound Effects**: Audio feedback for jumps, correct/wrong answers
- **Controls**: 
  - ⬆️ / Space - Jump
  - ⬅️ ➡️ - Move left/right
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
- `js/` folder (all JavaScript modules)
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
├── index.html          # Main HTML file
├── styles.css          # Styling with glassmorphism UI
├── manifest.json       # PWA manifest
├── sw.js               # Service worker for offline support
├── js/
│   ├── config.js       # Game settings & theme definitions
│   ├── audio.js        # Web Audio API sound system
│   ├── entities/       # Game entity classes
│   │   ├── renderers/  # Rendering abstraction layer
│   │   │   ├── obstacle-renderers.js   # Obstacle renderer interface & factories
│   │   │   └── decoration-renderers.js # Decoration renderer interface & factories
│   │   ├── player.js   # Player movement, jumping, collision
│   │   ├── coin.js     # Collectible coins with bobbing animation
│   │   ├── obstacle.js # Obstacle entity (uses renderer factory)
│   │   ├── platform.js # Jumpable platforms with theme decorations
│   │   └── decoration.js # Decoration entity (uses renderer factory)
│   ├── engine.js       # Game loop, spawning, collision, rendering
│   ├── ui.js           # Puzzle modal, menus, HUD
│   └── main.js         # Entry point & initialization
├── icons/              # App icons
│   └── icon.svg        # Source icon
├── .github/
│   └── workflows/
│       └── deploy.yml  # GitHub Actions deployment
└── README.md           # This file
```

## Architecture

### Renderer Pattern

The game uses an **Interface + Factory** pattern for theme-specific rendering:

```
ObstacleRenderer (abstract)     DecorationRenderer (abstract)
       │                               │
       ├── BeeRenderer                 ├── TreeRenderer
       ├── WolfRenderer                ├── PineRenderer
       ├── CrabRenderer                ├── PalmRenderer
       ├── SnowballRenderer            ├── SnowmanRenderer
       ├── LogRenderer                 ├── BushRenderer
       └── ...                         └── UmbrellaRenderer

ObstacleRendererFactory         DecorationRendererFactory
  └── getRenderer(type)           └── getRenderer(type)
```

**Benefits:**
- Each renderer is self-contained and focused
- Adding new obstacles/decorations = adding new renderer class
- Renderers are cached for performance
- Entity classes stay simple, delegating drawing to renderers

## Customization

### Math Operations

Currently the game uses multiplication. To add other operations, modify the `generateMathPuzzle()` function in `js/ui.js`.

### Difficulty

Adjust these constants in `js/config.js`:
- `CONFIG.gravity` - How fast player falls
- `CONFIG.jumpForce` - How high player jumps
- `CONFIG.coinSpawnRate` - How often coins appear (in frames)
- `CONFIG.obstacleSpawnRate` - How often obstacles appear
- `CONFIG.platformSpawnRate` - How often platforms appear
- `CONFIG.scrollSpeed` - How fast the world scrolls

### Adding Themes

Add new themes in `js/config.js` by extending the `THEMES` object with:
- Sky gradient colors
- Ground colors
- Platform colors
- Obstacle types and colors
- Decoration types

### Adding New Obstacles

1. Create a new renderer class in `js/entities/renderers/obstacle-renderers.js`:
   ```javascript
   class MyObstacleRenderer extends ObstacleRenderer {
       draw(ctx, x, y, width, height, frameCount) {
           // Your drawing code here
       }
   }
   ```
2. Register it in `ObstacleRendererFactory.getRenderer()` switch statement
3. Reference the type in your theme's `obstacles.dynamicType` or `obstacles.staticType`

### Adding New Decorations

1. Create a new renderer class in `js/entities/renderers/decoration-renderers.js`:
   ```javascript
   class MyDecorationRenderer extends DecorationRenderer {
       draw(ctx, x, groundY, animOffset) {
           // Your drawing code here
       }
   }
   ```
2. Register it in `DecorationRendererFactory.getRenderer()` switch statement
3. Add the type to your theme's `decorations` array in `js/config.js`

### Adding Sounds

Modify `js/audio.js` to add new sound effects using the Web Audio API oscillator.

## License

MIT License - Feel free to use and modify!
