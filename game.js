/**
 * Represents a vehicle in the game.
 */
class Vehicle {
  /**
   * Create a vehicle.
   * @param {string} id - Unique identifier.
   * @param {number} x - Target grid x coordinate.
   * @param {number} y - Target grid y coordinate.
   * @param {number} width - Length in grid cells along local x-axis.
   * @param {number} height - Length in grid cells along local y-axis.
   * @param {string} color - CSS color string.
   * @param {boolean} isPlayer - True if this is the goal vehicle.
   */
  constructor(id, x, y, width, height, color, isPlayer = false) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.isPlayer = isPlayer;
  }

  /**
   * Defines if vehicle moves horizontally or vertically.
   * @returns {'horizontal'|'vertical'} Movement direction.
   */
  get direction() {
    return this.width > this.height ? 'horizontal' : 'vertical';
  }
}

/**
 * Manages game state, logic, and movement constraints.
 */
export class Game {
  /**
   * Create the game logic instance.
   * @param {number} gridSize - Dimension of square grid (e.g., 6 for 6x6).
   * @param {Array<Object>} levelData - Initial vehicle configurations.
   */
  constructor(gridSize = 6, levelData = []) {
    this.gridSize = gridSize;
    this.vehicles = levelData.map(v => new Vehicle(v.id, v.x, v.y, v.width, v.height, v.color, v.isPlayer));
    this.won = false;
  }

  /**
   * Gets a specific vehicle by ID.
   * @param {string} id
   * @returns {Vehicle|null}
   */
  getVehicleById(id) {
    return this.vehicles.find(v => v.id === id) || null;
  }

  /**
   * Gets vehicle at specific grid coordinates.
   * @param {number} x
   * @param {number} y
   * @returns {Vehicle|null}
   */
  getVehicleAt(x, y) {
    for (const vehicle of this.vehicles) {
      if (
        x >= vehicle.x &&
        x < vehicle.x + vehicle.width &&
        y >= vehicle.y &&
        y < vehicle.y + vehicle.height
      ) {
        return vehicle;
      }
    }
    return null;
  }

  /**
   * Attempts to move a vehicle to a new position.
   * @param {string} vehicleId - ID of vehicle to move.
   * @param {number} newX - Target grid x.
   * @param {number} newY - Target grid y.
   * @returns {boolean} True if move was successful.
   */
  tryMove(vehicleId, newX, newY) {
    const vehicle = this.getVehicleById(vehicleId);
    if (!vehicle || this.won) return false;

    // Movement must align with orientation
    if (vehicle.direction === 'horizontal' && newY !== vehicle.y) return false;
    if (vehicle.direction === 'vertical' && newX !== vehicle.x) return false;

    // Boundary checks
    if (newX < 0 || newX + vehicle.width > this.gridSize) return false;
    if (newY < 0 || newY + vehicle.height > this.gridSize) return false;

    // Collision checks across cells spanned during move
    const startX = Math.min(vehicle.x, newX);
    const endX = Math.max(vehicle.x + vehicle.width, newX + vehicle.width);
    const startY = Math.min(vehicle.y, newY);
    const endY = Math.max(vehicle.y + vehicle.height, newY + vehicle.height);

    for (let x = startX; x < endX; x++) {
      for (let y = startY; y < endY; y++) {
        const other = this.getVehicleAt(x, y);
        if (other && other.id !== vehicle.id) {
          return false; // Path blocked
        }
      }
    }

    // Apply move
    vehicle.x = newX;
    vehicle.y = newY;

    this.checkWinCondition();
    return true;
  }

  /**
   * Checks if player vehicle reached exit.
   */
  checkWinCondition() {
    const player = this.vehicles.find(v => v.isPlayer);
    if (player && player.x + player.width === this.gridSize) {
      this.won = true;
    }
  }
}