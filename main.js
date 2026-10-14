import { Game } from './game.js';
import { Renderer } from './renderer.js';
import { InputHandler } from './input.js';

/**
 * Main application entry point that initializes the game, renderer, and input,
 * and manages the main game loop.
 */
class Main {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        if (!this.canvas) {
            console.error('Canvas element not found.');
            return;
        }

        const ctx = this.canvas.getContext('2d');
        if (!ctx) {
            console.error('Failed to get 2D rendering context.');
            return;
        }

        // Define grid dimensions (e.g., 6x6)
        const gridRows = 6;
        const gridCols = 6;
        const cellSize = this.canvas.width / gridCols;

        this.game = new Game(gridRows, gridCols);
        this.renderer = new Renderer(ctx, cellSize);
        this.inputHandler = new InputHandler(this.canvas, cellSize, this.game);

        this.lastTime = 0;

        // Start the loop
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    /**
     * The core game dynamic update and render loop.
     * @param {number} timestamp - The current time provided by requestAnimationFrame.
     */
    gameLoop(timestamp) {
        // Calculate delta time (optional, useful for time-based animation)
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        // Perform game logic updates
        this.game.update(deltaTime);

        // Draw everything
        this.renderer.render(this.game.grid, this.game.vehicles, this.game.isWon);

        // Request next frame
        requestAnimationFrame(this.gameLoop.bind(this));
    }
}

// Initalize on window load
window.addEventListener('load', () => {
    new Main();
});