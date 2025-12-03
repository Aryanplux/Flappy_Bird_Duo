export class Bird {
    constructor(x, y, color, name, gravity = 0.25) {
        this.x = x;
        this.y = y;
        this.width = 34;
        this.height = 24;
        this.color = color;
        this.name = name;

        this.velocity = 0;
        this.gravity = gravity;
        this.jumpStrength = -4.6;

        this.rotation = 0;
        this.isDead = false;

        // Input handling state
        this.lastJumpState = false;
    }

    update(isJumpPressed, groundY) {
        // If dead, just fall to ground
        if (this.isDead) {
            if (this.y + this.height / 2 < groundY) {
                this.velocity += this.gravity;
                this.y += this.velocity;
                this.rotation += 5 * Math.PI / 180;
            } else {
                this.y = groundY - this.height / 2; // Clamp to ground
            }
            return;
        }

        // Jump logic (trigger on rising edge)
        if (isJumpPressed && !this.lastJumpState) {
            this.velocity = this.jumpStrength;
            this.rotation = -25 * Math.PI / 180;
        }
        this.lastJumpState = isJumpPressed;

        // Physics
        this.velocity += this.gravity;
        this.y += this.velocity;

        // Rotation logic
        if (this.velocity > this.jumpStrength + 2) {
            this.rotation += 2 * Math.PI / 180;
            if (this.rotation > 90 * Math.PI / 180) {
                this.rotation = 90 * Math.PI / 180;
            }
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // Draw Bird (Pixel Art Style - Simplified)
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

        // Eye
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.width / 2 - 10, -this.height / 2 + 2, 8, 8);
        ctx.fillStyle = '#000';
        ctx.fillRect(this.width / 2 - 6, -this.height / 2 + 4, 2, 2);

        // Wing
        ctx.fillStyle = '#fff';
        ctx.fillRect(-10, 0, 14, 8);

        // Beak
        ctx.fillStyle = '#f48c39'; // Orange
        ctx.fillRect(this.width / 2 - 2, 2, 8, 6);

        // Border (Stroke)
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);

        ctx.restore();
    }
}

export class Pipe {
    constructor(x, y, width, gap, speed) {
        this.x = x;
        this.y = y; // y is the top of the bottom pipe? No, let's say y is the center of the gap or top of gap
        // Let's define y as the top position of the bottom pipe.
        // Actually, standard flappy bird: pipes come in pairs (top and bottom).
        // Let's pass the height of the top pipe.
        this.topHeight = y;
        this.width = width;
        this.gap = gap;
        this.speed = speed;
        this.passed = false; // For scoring
    }

    update(speed) {
        this.x -= speed;
    }

    draw(ctx, canvasHeight) {
        ctx.fillStyle = '#73bf2e'; // Classic Green
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;

        // Top Pipe
        ctx.fillRect(this.x, 0, this.width, this.topHeight);
        ctx.strokeRect(this.x, 0, this.width, this.topHeight);

        // Cap for Top Pipe
        ctx.fillRect(this.x - 2, this.topHeight - 20, this.width + 4, 20);
        ctx.strokeRect(this.x - 2, this.topHeight - 20, this.width + 4, 20);

        // Bottom Pipe
        const bottomPipeY = this.topHeight + this.gap;
        const bottomPipeHeight = canvasHeight - bottomPipeY;

        ctx.fillRect(this.x, bottomPipeY, this.width, bottomPipeHeight);
        ctx.strokeRect(this.x, bottomPipeY, this.width, bottomPipeHeight);

        // Cap for Bottom Pipe
        ctx.fillRect(this.x - 2, bottomPipeY, this.width + 4, 20);
        ctx.strokeRect(this.x - 2, bottomPipeY, this.width + 4, 20);
    }
}

export class Background {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.groundHeight = 112;
        this.groundOffset = 0;
    }

    update(speed) {
        this.groundOffset = (this.groundOffset - speed) % 20; // 20 is pattern width
    }

    draw(ctx) {
        // Sky is handled by CSS or clearRect with color

        // Ground
        ctx.fillStyle = '#ded895';
        ctx.fillRect(0, this.height - this.groundHeight, this.width, this.groundHeight);

        // Grass Top
        ctx.fillStyle = '#73bf2e';
        ctx.fillRect(0, this.height - this.groundHeight, this.width, 12);
        ctx.strokeStyle = '#000';
        ctx.beginPath();
        ctx.moveTo(0, this.height - this.groundHeight);
        ctx.lineTo(this.width, this.height - this.groundHeight);
        ctx.stroke();

        // Ground Pattern (Diagonal Lines)
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, this.height - this.groundHeight + 12, this.width, this.groundHeight - 12);
        ctx.clip();

        ctx.strokeStyle = '#cbb968';
        ctx.lineWidth = 2;

        for (let i = this.groundOffset - 20; i < this.width; i += 20) {
            ctx.beginPath();
            ctx.moveTo(i, this.height - this.groundHeight + 12);
            ctx.lineTo(i - 10, this.height);
            ctx.stroke();
        }
        ctx.restore();

        // Border
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, this.height - this.groundHeight);
        ctx.lineTo(this.width, this.height - this.groundHeight);
        ctx.stroke();
    }
}

export class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 3 + 2;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.life = 1.0;
        this.decay = Math.random() * 0.03 + 0.02;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= this.decay;
    }

    draw(ctx) {
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.globalAlpha = 1.0;
    }
}
