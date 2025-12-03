export class UIManager {
    constructor() {
        this.screens = {
            home: document.getElementById('home-screen'),
            countdown: document.getElementById('countdown-screen'),
            gameOver: document.getElementById('game-over-screen')
        };

        this.elements = {
            countdownNumber: document.getElementById('countdown-number'),
            winnerDisplay: document.getElementById('winner-display'),
            p1Score: document.getElementById('p1-score'),
            p2Score: document.getElementById('p2-score'),
            p1FinalName: document.getElementById('p1-final-name'),
            p2FinalName: document.getElementById('p2-final-name'),
            settingsPanel: document.getElementById('settings-panel'),
            mobileControls: document.getElementById('mobile-controls')
        };

        this.settings = {
            showNames: true,
            difficulty: 'medium'
        };

        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('show-names').addEventListener('change', (e) => {
            this.settings.showNames = e.target.checked;
        });

        document.getElementById('difficulty-select').addEventListener('change', (e) => {
            this.settings.difficulty = e.target.value;
        });

        window.toggleSettings = () => {
            this.elements.settingsPanel.classList.toggle('hidden');
        };
    }

    showScreen(screenName) {
        Object.values(this.screens).forEach(s => s.classList.remove('active', 'hidden'));
        Object.values(this.screens).forEach(s => s.classList.add('hidden'));

        if (this.screens[screenName]) {
            this.screens[screenName].classList.remove('hidden');
            this.screens[screenName].classList.add('active');
        }
    }

    updateCountdown(number) {
        this.elements.countdownNumber.textContent = number;
    }

    showGameOver(winner, p1Score, p2Score, p1Name, p2Name) {
        this.showScreen('gameOver');
        if (winner === 'Draw') {
            this.elements.winnerDisplay.textContent = "IT'S A DRAW!";
            this.elements.winnerDisplay.style.color = '#fff';
        } else {
            this.elements.winnerDisplay.textContent = `${winner} WINS!`;
            // Set color based on winner name (simple check)
            if (winner === p1Name) this.elements.winnerDisplay.style.color = '#f4bd39';
            else this.elements.winnerDisplay.style.color = '#e04e38';
        }

        this.elements.p1FinalName.textContent = p1Name;
        this.elements.p2FinalName.textContent = p2Name;
        this.elements.p1Score.textContent = p1Score;
        this.elements.p2Score.textContent = p2Score;
    }

    getP1Name() {
        return document.getElementById('p1-name').value || 'Player 1';
    }

    getP2Name() {
        return document.getElementById('p2-name').value || 'Player 2';
    }

    toggleMobileControls(show) {
        if (show) {
            this.elements.mobileControls.classList.remove('hidden');
        } else {
            this.elements.mobileControls.classList.add('hidden');
        }
    }
}
