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
        const modalContent = modal.querySelector('.puzzle-content');
        const icon = document.getElementById('puzzle-icon');
        const question = document.getElementById('puzzle-question');
        const answer = document.getElementById('puzzle-answer');
        
        // Set icon and styling based on challenge type
        if (type === 'coin') {
            icon.textContent = '🪙';
            modalContent.classList.remove('obstacle-challenge');
            modalContent.classList.add('coin-challenge');
        } else {
            icon.textContent = '🛡️';
            modalContent.classList.remove('coin-challenge');
            modalContent.classList.add('obstacle-challenge');
        }
        
        question.textContent = game.pendingPuzzle.question;
        answer.value = '';
        
        modal.classList.add('active');
        answer.focus();
    },

    // Trigger screen effect
    triggerScreenEffect(isCorrect, theme) {
        const effect = document.getElementById('screen-effect');
        effect.className = 'screen-effect active';
        effect.classList.add(isCorrect ? 'correct' : 'wrong');
        effect.classList.add(theme);
        
        setTimeout(() => {
            effect.className = 'screen-effect';
        }, 800);
    },

    // Check Puzzle Answer
    checkPuzzleAnswer(game) {
        const answerInput = document.getElementById('puzzle-answer');
        const userAnswer = parseInt(answerInput.value);
        
        if (isNaN(userAnswer)) {
            // Shake the input to indicate error
            answerInput.style.animation = 'none';
            answerInput.offsetHeight; // Trigger reflow
            answerInput.style.animation = 'wrongShake 0.4s ease';
            return;
        }
        
        const isCorrect = userAnswer === game.pendingPuzzle.answer;
        
        // Trigger screen effect
        this.triggerScreenEffect(isCorrect, game.theme);
        
        if (game.puzzleType === 'coin') {
            if (isCorrect) {
                game.score += 1;
                Audio.play('pointEarned');
            } else {
                Audio.play('pointLost');
            }
        } else {
            if (isCorrect) {
                Audio.play('pointEarned');
            } else {
                game.score -= 1;
                Audio.play('pointLost');
            }
        }
        
        this.updateScoreDisplay(game);
        
        // Close modal immediately after effect starts
        setTimeout(() => {
            document.getElementById('puzzle-modal').classList.remove('active');
            game.paused = false;
            game.pendingPuzzle = null;
            game.puzzleType = null;
            
            // Check for game over (negative score) or victory (target mode)
            if (game.score < -5) {
                this.gameOver(game, false);
            } else if (game.gameMode === 'target' && game.score >= game.targetScore) {
                this.gameOver(game, true);
            }
        }, 300);
    },

    // Update Score Display
    updateScoreDisplay(game) {
        const scoreText = game.gameMode === 'target' 
            ? `Score: ${game.score} / ${game.targetScore}`
            : `Score: ${game.score}`;
        document.getElementById('score').textContent = scoreText;
    },
    
    // Update Timer Display
    updateTimerDisplay(game) {
        const timerEl = document.getElementById('timer');
        let seconds, prefix;
        
        if (game.gameMode === 'timed') {
            seconds = Math.max(0, Math.ceil(game.timeRemaining));
            prefix = '⏱️';
        } else {
            seconds = Math.floor(game.timeElapsed);
            prefix = '⏱️';
        }
        
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        timerEl.textContent = `${prefix} ${mins}:${secs.toString().padStart(2, '0')}`;
    },
    
    // Format time for display
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    },

    // Show Menu
    showMenu(game) {
        game.running = false;
        document.getElementById('game-screen').classList.remove('active');
        document.getElementById('menu-screen').classList.add('active');
    },

    // Game Over
    gameOver(game, isVictory = false) {
        game.running = false;
        
        const titleEl = document.getElementById('gameover-title');
        const messageEl = document.getElementById('gameover-message');
        const finalTimeEl = document.getElementById('final-time');
        const finalTimeValue = document.getElementById('final-time-value');
        
        document.getElementById('final-score').textContent = game.score;
        
        if (game.gameMode === 'timed') {
            titleEl.textContent = "⏱️ Time's Up!";
            messageEl.textContent = `You scored ${game.score} points in ${this.formatTime(game.timeLimit)}!`;
            finalTimeEl.style.display = 'none';
        } else if (game.gameMode === 'target') {
            if (isVictory) {
                titleEl.textContent = '🎉 Target Reached!';
                messageEl.textContent = 'Congratulations!';
                finalTimeEl.style.display = 'block';
                finalTimeValue.textContent = this.formatTime(game.timeElapsed);
            } else {
                titleEl.textContent = '💀 Game Over!';
                messageEl.textContent = `You didn't reach the target of ${game.targetScore} points.`;
                finalTimeEl.style.display = 'none';
            }
        } else {
            titleEl.textContent = 'Game Over!';
            messageEl.textContent = '';
            finalTimeEl.style.display = 'none';
        }
        
        document.getElementById('gameover-modal').classList.add('active');
    },

    // Resize Canvas
    resizeCanvas(game) {
        game.canvas.width = window.innerWidth;
        game.canvas.height = window.innerHeight;
    }
};
