// ============================================
// UI SYSTEM - Puzzles, Menus, HUD
// ============================================

const UI = {
    // Math Puzzle Generator
    generateMathPuzzle(game) {
        const a = Math.floor(Math.random() * (game.mathMax - game.mathMin + 1)) + game.mathMin;
        const b = Math.floor(Math.random() * (game.mathMax - game.mathMin + 1)) + game.mathMin;
        return {
            question: `${a} × ${b} = ?`,
            answer: a * b
        };
    },

    // Show Puzzle Modal
    showPuzzle(type, game) {
        game.paused = true;
        game.puzzleType = type;
        game.pendingPuzzle = this.generateMathPuzzle(game);
        
        const modal = document.getElementById('puzzle-modal');
        const title = document.getElementById('puzzle-title');
        const question = document.getElementById('puzzle-question');
        const answer = document.getElementById('puzzle-answer');
        const feedback = document.getElementById('puzzle-feedback');
        
        title.textContent = type === 'coin' ? '🪙 Coin Collected!' : '💥 Obstacle Hit!';
        question.textContent = game.pendingPuzzle.question;
        answer.value = '';
        feedback.textContent = '';
        feedback.className = '';
        
        modal.classList.add('active');
        answer.focus();
    },

    // Check Puzzle Answer
    checkPuzzleAnswer(game) {
        const answerInput = document.getElementById('puzzle-answer');
        const feedback = document.getElementById('puzzle-feedback');
        const userAnswer = parseInt(answerInput.value);
        
        if (isNaN(userAnswer)) {
            feedback.textContent = 'Please enter a number!';
            feedback.className = 'wrong';
            return;
        }
        
        const isCorrect = userAnswer === game.pendingPuzzle.answer;
        
        if (game.puzzleType === 'coin') {
            if (isCorrect) {
                game.score += 1;
                feedback.textContent = '✅ Correct! +1 point';
                feedback.className = 'correct';
                Audio.play('pointEarned');
            } else {
                feedback.textContent = `❌ Wrong! The answer was ${game.pendingPuzzle.answer}`;
                feedback.className = 'wrong';
                Audio.play('pointLost');
            }
        } else {
            if (isCorrect) {
                feedback.textContent = '✅ Correct! No penalty';
                feedback.className = 'correct';
                Audio.play('pointEarned');
            } else {
                game.score -= 1;
                feedback.textContent = `❌ Wrong! -1 point. Answer was ${game.pendingPuzzle.answer}`;
                feedback.className = 'wrong';
                Audio.play('pointLost');
            }
        }
        
        this.updateScoreDisplay(game);
        
        setTimeout(() => {
            document.getElementById('puzzle-modal').classList.remove('active');
            game.paused = false;
            game.pendingPuzzle = null;
            game.puzzleType = null;
            
            // Check for game over
            if (game.score < -5) {
                this.gameOver(game);
            }
        }, 1500);
    },

    // Update Score Display
    updateScoreDisplay(game) {
        document.getElementById('score').textContent = `Score: ${game.score}`;
    },

    // Show Menu
    showMenu(game) {
        game.running = false;
        document.getElementById('game-screen').classList.remove('active');
        document.getElementById('menu-screen').classList.add('active');
    },

    // Game Over
    gameOver(game) {
        game.running = false;
        document.getElementById('final-score').textContent = game.score;
        document.getElementById('gameover-modal').classList.add('active');
    },

    // Resize Canvas
    resizeCanvas(game) {
        game.canvas.width = window.innerWidth;
        game.canvas.height = window.innerHeight;
    }
};
