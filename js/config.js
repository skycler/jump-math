// ============================================
// CONFIGURATION & THEME DEFINITIONS
// ============================================

const CONFIG = {
    gravity: 0.6,
    jumpForce: -14,
    playerSpeed: 5,
    groundHeight: 80,
    coinSpawnRate: 120, // frames
    obstacleSpawnRate: 180, // frames
    platformSpawnRate: 250, // frames
    scrollSpeed: 3
};

const THEMES = {
    forest: {
        name: 'Forest',
        sky: ['#87CEEB', '#228B22'],
        ground: '#3d2817',
        groundTop: '#228B22',
        player: '#FF6B35',
        coin: '#FFD700',
        platform: { top: '#228B22', bottom: '#3d2817' },
        obstacles: {
            static: ['#654321', '#8B4513'],
            dynamic: '#FF4444',
            staticType: 'log',
            dynamicTypes: ['bee', 'wolf']
        },
        decorations: ['tree', 'bush']
    },
    snow: {
        name: 'Snowy Mountains',
        sky: ['#B0E0E6', '#E0F0FF'],
        ground: '#4a6fa5',
        groundTop: '#FFFAFA',
        player: '#FF6B35',
        coin: '#FFD700',
        platform: { top: '#FFFAFA', bottom: '#a8d5ff' },
        obstacles: {
            static: ['#708090', '#A9A9A9'],
            dynamic: '#4169E1',
            staticType: 'ice',
            dynamicTypes: ['snowball', 'polarBear']
        },
        decorations: ['pine', 'snowman']
    },
    beach: {
        name: 'Beach',
        sky: ['#87CEEB', '#FFE4B5'],
        ground: '#0077BE',
        groundTop: '#F4D03F',
        player: '#FF6B35',
        coin: '#FFD700',
        platform: { top: '#c2a66b', bottom: '#8B7355' },
        obstacles: {
            static: ['#8B4513', '#D2691E'],
            dynamic: '#FF6347',
            staticType: 'sandcastle',
            dynamicTypes: ['crab', 'jellyfish']
        },
        decorations: ['palm', 'umbrella']
    },
    city: {
        name: 'City',
        sky: ['#4a5568', '#1a202c'],
        ground: '#2d3748',
        groundTop: '#718096',
        player: '#FF6B35',
        coin: '#FFD700',
        platform: { top: '#4a5568', bottom: '#2d3748' },
        obstacles: {
            static: ['#718096', '#4a5568'],
            dynamic: '#f6e05e',
            staticType: 'trashcan',
            dynamicTypes: ['taxi', 'pigeon']
        },
        decorations: ['building', 'streetlamp']
    }
};
