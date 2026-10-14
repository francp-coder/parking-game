/**
 * Handles mouse and touch input for vehicle movement.
 */
export class InputHandler {
  /**
   * Create an InputHandler.
   * @param {HTMLCanvasElement} canvas - The game canvas element.
   * @param {number} gridSize - The size of a single grid cell in pixels.
   * @param {Object} game - The game logic instance.
   * @param {Function} game.getVehicleAt - Function to get a vehicle at grid coordinates.
   * @param {Function} game.tryMoveVehicle - Function to attempt moving a vehicle.
   */
  constructor(canvas, gridSize, game) {
    this.canvas = canvas;
    this.gridSize = gridSize;
    this.game = game;

    this.draggingVehicle = null;
    this.dragStartX = 0;
    this.dragStartY = 0;

    this._setupListeners();
  }

  /**
   * Sets up mouse and touch event listeners.
   * @private
   */
  _setupListeners() {
    this.canvas.addEventListener('mousedown', this._onPointerDown.bind(this));
    window.addEventListener('mousemove', this._onPointerMove.bind(this));
    window.addEventListener('mouseup', this._onPointerUp.bind(this));

    this.canvas.addEventListener('touchstart', this._onPointerDown.bind(this), { passive: false });
    window.addEventListener('touchmove', this._onPointerMove.bind(this), { passive: false });
    window.addEventListener('touchend', this._onPointerUp.bind(this));
    window.addEventListener('touchcancel', this._onPointerUp.bind(this));
  }

  /**
   * Gets visual coordinates from event.
   * @param {MouseEvent|TouchEvent} e
   * @private
   */
  _getCanvasPoint(e) {
    const rect = this.canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  /**
   * Handles pointer down event.
   * @param {MouseEvent|TouchEvent} e
   * @private
   */
  _onPointerDown(e) {
    if (e.type === 'touchstart') e.preventDefault();

    const point = this._getCanvasPoint(e);
    const gridX = Math.floor(point.x / this.gridSize);
    const gridY = Math.floor(point.y / this.gridSize);

    this.draggingVehicle = this.game.getVehicleAt(gridX, gridY);

    if (this.draggingVehicle) {
      this.dragStartX = point.x;
      this.dragStartY = point.y;
    }
  }

  /**
   * Handles pointer move event.
   * @param {MouseEvent|TouchEvent} e
   * @private
   */
  _onPointerMove(e) {
    if (!this.draggingVehicle) return;
    if (e.type === 'touchmove') e.preventDefault();

    const point = this._getCanvasPoint(e);
    const deltaX = point.x - this.dragStartX;
    const deltaY = point.y - this.dragStartY;

    let gridDelta = 0;
    if (this.draggingVehicle.orientation === 'horizontal') {
      gridDelta = Math.round(deltaX / this.gridSize);
    } else {
      gridDelta = Math.round(deltaY / this.gridSize);
    }

    if (gridDelta !== 0) {
      const moved = this.game.tryMoveVehicle(this.draggingVehicle, gridDelta);
      if (moved) {
        this.dragStartX = point.x;
        this.dragStartY = point.y;
      }
    }
  }

  /**
   * Handles pointer up event.
   * @private
   */
  _onPointerUp() {
    this.draggingVehicle = null;
  }
}