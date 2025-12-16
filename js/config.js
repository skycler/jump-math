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
    },
    sky: {
        name: 'Sky',
        sky: ['#87CEEB', '#4A90D9'],
        ground: '#b8d4e8',
        groundTop: '#ffffff',
        player: '#FF6B35',
        coin: '#FFD700',
        platform: { top: '#ffffff', bottom: '#d0e8f5' },
        obstacles: {
            static: ['#ffb6c1', '#98d8c8'],
            dynamic: '#666666',
            staticType: 'cloudObstacle',
            dynamicTypes: ['airplane', 'co2']
        },
        decorations: ['sun', 'cloudDecoration']
    },
    underwater: {
        name: 'Underwater',
        sky: ['#006994', '#003d5c'],
        ground: '#1a2a3a',
        groundTop: '#3a5a7a',
        player: '#FF6B35',
        coin: '#FFD700',
        platform: { top: '#4a7a9a', bottom: '#2a4a6a' },
        obstacles: {
            static: ['#FF6B9D', '#FF8FB3'],
            dynamic: '#708090',
            staticType: 'coral',
            dynamicTypes: ['shark', 'jellyfish']
        },
        decorations: ['submarine', 'wreck']
    }
};
