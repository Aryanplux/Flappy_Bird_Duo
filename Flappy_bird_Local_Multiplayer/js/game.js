import { Bird, Pipe, Background, Particle } from './entities.js';
import { InputHandler } from './input.js';
import { UIManager } from './ui.js';
import { SoundManager } from './sound.js';

export class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        this.resize();
        window.addEventListener('resize', () => this.resize());

        this.input = new InputHandler();
        this.ui = new UIManager();
        this.sound = new SoundManager();

        this.state = 'MENU'; // MENU, COUNTDOWN, PLAYING, GAMEOVER
        this.frames = 0;
        this.speed = 2; // Pipe speed

        this.birds = [];
        this.pipes = [];
        this.particles = [];
        this.background = new Background(this.canvas.width, this.canvas.height);

        this.scoreP1 = 0;
        this.scoreP2 = 0;

        // Bind buttons
        document.getElementById('start-btn').addEventListener('click', () => this.startCountdown());
        document.getElementById('restart-btn').addEventListener('click', () => this.startCountdown());
        document.getElementById('home-btn').addEventListener('click', () => this.goHome());
    }

    resize() {
        const container = document.getElementById('game-container');
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        if (this.background) {
            this.background.width = this.canvas.width;
            this.background.height = this.canvas.height;
        }
    }

    goHome() {
        this.state = 'MENU';
        this.ui.showScreen('home');
        this.ui.toggleMobileControls(false);
    }

    startCountdown() {
        this.state = 'COUNTDOWN';
        this.ui.showScreen('countdown');
        this.ui.toggleMobileControls(true); // Show controls during countdown so players get ready

        // Reset Game Data
        this.resetGame();

        let count = 3;
        this.ui.updateCountdown(count);

        const timer = setInterval(() => {
            count--;
            if (count > 0) {
                this.ui.updateCountdown(count);
            } else {
                clearInterval(timer);
                this.ui.updateCountdown('GO!');
                setTimeout(() => {
                    this.startGame();
                }, 500);
            }
        }, 1000);
    }

    resetGame() {
        const p1Name = this.ui.getP1Name();
        const p2Name = this.ui.getP2Name();
        const difficulty = this.ui.settings.difficulty;

        // Difficulty Settings
        let gravity = 0.25;
        this.pipeInterval = 120; // Frames
        this.pipeGap = 130; // Vertical gap

        if (difficulty === 'easy') {
            gravity = 0.10; // Extremely floaty
            this.pipeInterval = 220; // Massive space between pipes (horizontal)
            this.pipeGap = 190; // Massive gap (vertical)
        } else if (difficulty === 'medium') {
            gravity = 0.15; // Easier than standard
            this.pipeInterval = 170;
            this.pipeGap = 165;
        } else if (difficulty === 'hard') {
            gravity = 0.22; // Challenging but fair
            this.pipeInterval = 130;
            this.pipeGap = 140;
        }

        this.birds = [
            new Bird(50, this.canvas.height / 2, '#f4bd39', p1Name, gravity), // P1 Yellow
            new Bird(50, this.canvas.height / 2, '#e04e38', p2Name, gravity)  // P2 Red
        ];

        this.pipes = [];
        this.particles = [];
        this.frames = 0;
        this.speed = 2; // Reset speed
        this.scoreP1 = 0;
        this.scoreP2 = 0;
    }

    startGame() {
        this.state = 'PLAYING';
        this.ui.showScreen('none'); // Hide all screens
        this.sound.init(); // Initialize audio context on user interaction
    }


    update() {
        if (this.state === 'PLAYING' || this.state === 'GAMEOVER') {
            // Update Birds (Physics continues even in Game Over)
            const groundY = this.canvas.height - 112;

            // Check for jump and play sound
            const p1Jump = this.input.isP1Jump();
            const p2Jump = this.input.isP2Jump();

            if (p1Jump && !this.birds[0].lastJumpState && !this.birds[0].isDead) {
                this.sound.playJump();
            }
            if (p2Jump && !this.birds[1].lastJumpState && !this.birds[1].isDead) {
                this.sound.playJump();
            }

            this.birds[0].update(p1Jump, groundY);
            this.birds[1].update(p2Jump, groundY);

            // Update Particles
            for (let i = 0; i < this.particles.length; i++) {
                this.particles[i].update();
                if (this.particles[i].life <= 0) {
                    this.particles.splice(i, 1);
                    i--;
                }
            }

            if (this.state === 'PLAYING') {
                // Dynamic Speed Increase (Temple Run style)
                if (this.frames % 600 === 0) { // Every ~10 seconds
                    this.speed += 0.2;
                }

                this.background.update(this.speed);

                // Pipe Generation
                if (this.frames % this.pipeInterval === 0) { // Based on difficulty
                    const gap = this.pipeGap;
                    const minHeight = 50;
                    const maxHeight = this.canvas.height - 112 - gap - minHeight; // 112 is ground height
                    const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);

                    this.pipes.push(new Pipe(this.canvas.width, topHeight, 52, gap, this.speed));
                }

                // Update Pipes
                for (let i = 0; i < this.pipes.length; i++) {
                    this.pipes[i].update(this.speed);

                    // Remove off-screen pipes
                    if (this.pipes[i].x + this.pipes[i].width < 0) {
                        this.pipes.shift();
                        i--;
                        continue;
                    }

                    // Collision Detection
                    this.birds.forEach((bird, index) => {
                        if (bird.isDead) return;

                        // Pipe Collision
                        if (
                            bird.x + bird.width / 2 > this.pipes[i].x &&
                            bird.x - bird.width / 2 < this.pipes[i].x + this.pipes[i].width &&
                            (bird.y - bird.height / 2 < this.pipes[i].topHeight ||
                                bird.y + bird.height / 2 > this.pipes[i].topHeight + this.pipes[i].gap)
                        ) {
                            this.killBird(index);
                        }
                    });

                    // Score Logic (Simplified)
                    if (this.pipes[i].x + this.pipes[i].width < 50 && !this.pipes[i].passed) {
                        this.pipes[i].passed = true;
                        if (!this.birds[0].isDead) this.scoreP1++;
                        if (!this.birds[1].isDead) this.scoreP2++;
                        this.sound.playScore();
                    }
                }

                // Ground Collision
                this.birds.forEach((bird, index) => {
                    if (bird.isDead) return;

                    if (bird.y + bird.height / 2 >= this.canvas.height - 112) {
                        this.killBird(index);
                    }
                });

                // Check Game Over
                if (this.birds[0].isDead && this.birds[1].isDead) {
                    this.gameOver();
                }

                this.frames++;
            }
        }
    }

    spawnParticles(x, y, color, count = 10) {
        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle(x, y, color));
        }
    }

    killBird(index) {
        if (!this.birds[index].isDead) {
            this.birds[index].isDead = true;
            this.spawnParticles(this.birds[index].x, this.birds[index].y, '#fff', 20);
            this.spawnParticles(this.birds[index].x, this.birds[index].y, this.birds[index].color, 10);
            this.sound.playDeath();
        }
    }

    gameOver() {
        this.state = 'GAMEOVER';

        let winner;
        if (this.scoreP1 > this.scoreP2) winner = this.birds[0].name;
        else if (this.scoreP2 > this.scoreP1) winner = this.birds[1].name;
        else winner = 'Draw';

        this.ui.showGameOver(winner, this.scoreP1, this.scoreP2, this.birds[0].name, this.birds[1].name);
    }

    draw() {
        // Clear
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw Background
        this.background.draw(this.ctx);

        // Draw Pipes
        this.pipes.forEach(pipe => pipe.draw(this.ctx, this.canvas.height));

        // Draw Particles
        this.particles.forEach(p => p.draw(this.ctx));

        // Draw Birds
        this.birds.forEach(bird => {
            bird.draw(this.ctx);
        });

        // Draw Scores (In-game)
        if (this.state === 'PLAYING') {
            this.ctx.fillStyle = '#fff';
            this.ctx.strokeStyle = '#000';
            this.ctx.lineWidth = 2;
            this.ctx.font = '20px "Press Start 2P"';
            this.ctx.textAlign = 'center';

            // P1 Score
            this.ctx.fillStyle = '#f4bd39';
            this.ctx.fillText(this.scoreP1, this.canvas.width / 4, 50);
            this.ctx.strokeText(this.scoreP1, this.canvas.width / 4, 50);

            // P2 Score
            this.ctx.fillStyle = '#e04e38';
            this.ctx.fillText(this.scoreP2, this.canvas.width * 3 / 4, 50);
            this.ctx.strokeText(this.scoreP2, this.canvas.width * 3 / 4, 50);

            // Names (if enabled)
            if (this.ui.settings.showNames) {
                this.ctx.font = '10px "Press Start 2P"';
                this.ctx.fillStyle = '#fff';

                this.birds.forEach(bird => {
                    if (!bird.isDead) {
                        this.ctx.fillText(bird.name, bird.x, bird.y - 20);
                    }
                });
            }
        }
    }

    loop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    }
}
