export class InputHandler {
    constructor() {
        this.keys = {};
        this.touchActions = {};

        window.addEventListener('keydown', (e) => {
            if (['Space', 'ArrowUp'].includes(e.code)) {
                e.preventDefault();
            }
            this.keys[e.code] = true;
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        // Mobile controls
        const p1Btn = document.getElementById('p1-btn');
        const p2Btn = document.getElementById('p2-btn');

        if (p1Btn) {
            p1Btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.touchActions['p1'] = true;
            });
            p1Btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.touchActions['p1'] = false;
            });
            // Mouse fallback for testing on desktop
            p1Btn.addEventListener('mousedown', (e) => {
                this.touchActions['p1'] = true;
            });
            p1Btn.addEventListener('mouseup', (e) => {
                this.touchActions['p1'] = false;
            });
        }

        if (p2Btn) {
            p2Btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.touchActions['p2'] = true;
            });
            p2Btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.touchActions['p2'] = false;
            });
            // Mouse fallback for testing on desktop
            p2Btn.addEventListener('mousedown', (e) => {
                this.touchActions['p2'] = true;
            });
            p2Btn.addEventListener('mouseup', (e) => {
                this.touchActions['p2'] = false;
            });
        }
    }

    isP1Jump() {
        // Space or P1 Touch
        const jump = this.keys['Space'] || this.touchActions['p1'];
        if (jump) {
            // Simple debounce logic could be handled here or in the entity
            // For now, we return true if held, but the bird should only jump on press
            // We'll handle "just pressed" logic in the game loop or entity
            return true;
        }
        return false;
    }

    isP2Jump() {
        // ArrowUp or P2 Touch
        const jump = this.keys['ArrowUp'] || this.touchActions['p2'];
        if (jump) {
            return true;
        }
        return false;
    }
}
