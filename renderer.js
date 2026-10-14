/**
 * Handles drawing the grid, vehicles, and UI elements onto the HTML5 Canvas.
 */
export class Renderer {
  /**
   * Create a Renderer.
   * @param {HTMLCanvasElement} canvas - The canvas element to draw on.
   * @param {object} game - The game logic instance.
   */
  constructor(canvas, game) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.game = game;

    // Visual configurations
    this.vehicleColors = {
      player: '#e74c3c', // Red
      default: '#3498db', // Blue
    };
    this.gridColor = '#e0e0e0';
    this.exitIndicatorColor = '#2ecc71'; // Green
  }

  /**
   * Clears the canvas and draws the current game state.
   */
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawGrid();
    this.drawExitIndicator();
    this.drawVehicles();
  }

  /**
   * Draws the background grid.
   * @private
   */
  drawGrid() {
    const { gridWidth, gridHeight, cellSize } = this.game;

    this.ctx.strokeStyle = this.gridColor;
    this.ctx.lineWidth = 1;

    for (let x = 0; x <= gridWidth; x++) {
      this.ctx.beginPath();
      this.ctx.moveTo(x * cellSize, 0);
      this.ctx.lineTo(x * cellSize, gridHeight * cellSize);
      this.ctx.stroke();
    }

    for (let y = 0; y <= gridHeight; y++) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y * cellSize);
      this.ctx.lineTo(gridWidth * cellSize, y * cellSize);
      this.ctx.stroke();
    }
  }

  /**
   * Draws the indicator for the exit tile.
   * @private
   */
  drawExitIndicator() {
    const { exitRow, gridWidth, cellSize } = this.game;
    
    this.ctx.fillStyle = this.exitIndicatorColor;
    // Draw a small arrow or highlight at the exit
    this.ctx.beginPath();
    this.ctx.moveTo(gridWidth * cellSize, exitRow * cellSize + cellSize * 0.2);
    this.ctx.lineTo(gridWidth * cellSize + cellSize * 0.3, exitRow * cellSize + cellSize * 0.5);
    this.ctx.lineTo(gridWidth * cellSize, exitRow * cellSize + cellSize * 0.8);
    this.ctx.fill();
  }

  /**
   * Draws all vehicles currently in the game.
   * @private
   */
  drawVehicles() {
    const { vehicles, cellSize } = this.game;

    vehicles.forEach(vehicle => {
      this.ctx.fillStyle = vehicle.isPlayer ? this.vehicleColors.player : this.vehicleColors.default;
      
      const x = vehicle.x * cellSize;
      const y = vehicle.y * cellSize;
      
      let width, height;
      if (vehicle.orientation === 'horizontal') {
        width = vehicle.length * cellSize;
        height = cellSize;
      } else {
        width = cellSize;
        height = vehicle.length * cellSize;
      }

      // Draw main body
      this.drawRoundedRect(
        this.ctx, 
        x + cellSize * 0.05, 
        y + cellSize * 0.05, 
        width - cellSize * 0.1, 
        height - cellSize * 0.1, 
        cellSize * 0.1
      );
      
      // Draw details (e.g., windows) to look more like a car
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      if (vehicle.orientation === 'horizontal') {
         // Side windows
         this.ctx.fillRect(x + cellSize * 0.2, y + cellSize * 0.2, width - cellSize * 0.4, height - cellSize * 0.4);
      } else {
         // Front/rear windows
         this.ctx.fillRect(x + cellSize * 0.2, y + cellSize * 0.2, width - cellSize * 0.4, height - cellSize * 0.4);
      }
    });
  }

  /**
   * Helper function to draw a rounded rectangle.
   * @private
   */
  drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}