import SpriteSheet from './SpriteSheet';
import ParticleSystem from './ParticleSystem';
import Grid from './Grid';
import Util from './Util';

/** Renders a Grid to a canvas element */
export default class GridRenderer extends ParticleSystem {
  private spriteSheet: SpriteSheet;

  private grid: Grid;

  private ctx: CanvasRenderingContext2D;

  private canvas: HTMLCanvasElement;

  private lastPlayheadX: number = -1;

  private heatmap: number[];

  /**
   * @param grid - The grid
   * @param canvas - The canvas DOM element to render to
   */
  constructor(grid: Grid, canvas: HTMLCanvasElement) {
    super(canvas.width, canvas.height);
    this.grid = grid;
    this.spriteSheet = new SpriteSheet(
      grid.width,
      grid.height,
      canvas.width,
      canvas.height,
    );
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Unable to get canvas context');
    this.ctx = ctx;
    this.heatmap = Array.from<number>({
      length: this.grid.width * this.grid.height,
    }).fill(0);
  }

  /**
   * Update, then draw the current state of the app to the canvas element.
   * @param grid - The grid to be rendered
   * @param mouseX - The x position of the mouse on the canvas
   * @param mouseY - The y position of the mouse on the canvas
   */
  update(mouseX?: number, mouseY?: number) {
    super.update();
    this.updateHeatmap();
    this.draw(mouseX, mouseY);
  }

  /**
   * Draw the current state of the app to the canvas element.
   * @private
   * @param grid - The grid to be rendered
   * @param mouseX - The x position of the mouse on the canvas
   * @param mouseY - The y position of the mouse on the canvas
   */
  draw(mouseX?: number, mouseY?: number) {
    const playheadX = this.grid.instruments[
      this.grid.currentInstrument
    ].getPlayheadX();
    const dpr = Util.getDevicePixelRatio();

    // Defaults
    this.ctx.globalAlpha = 1;
    this.ctx.filter = 'none';

    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = 'black';
    this.ctx.fill();

    const mousedOverTile =
      mouseX != null &&
      mouseY != null &&
      Util.pixelCoordsToTileCoords(
        mouseX,
        mouseY,
        this.grid.width,
        this.grid.height,
        this.canvas.width,
        this.canvas.height,
      );

    // Draw each tile
    for (let i = 0; i < this.grid.data.length; i += 1) {
      const dx = this.canvas.width / this.grid.width;
      const dy = this.canvas.height / this.grid.height;
      const { x: gridx, y: gridy } = Util.indexToCoord(i, this.grid.height);
      const x = dx * gridx;
      const y = dy * gridy;

      const on = !this.grid.data[i].isEmpty();

      if (this.grid.data[i].hasNote(1)) {
        this.ctx.filter =
          'brightness(50%) sepia(100) saturate(100) hue-rotate(25deg)';
      } else {
        this.ctx.filter = 'none';
      }
      if (on) {
        if (gridx === playheadX) {
          this.ctx.globalAlpha = 1;
          this.spriteSheet.drawSprite(2, this.ctx, x, y);
          if (playheadX !== this.lastPlayheadX) {
            // Create particles
            this.createParticleBurst(
              dx * (gridx + 0.5),
              dy * (gridy + 0.5),
              8 * dpr,
              20,
            );
          }
        } else {
          this.ctx.globalAlpha = 0.85;
          this.spriteSheet.drawSprite(1, this.ctx, x, y);
        }
      } else {
        if (
          mousedOverTile &&
          gridx === mousedOverTile.x &&
          gridy === mousedOverTile.y
        ) {
          // Highlight moused over tile
          this.ctx.globalAlpha = 0.3;
        } else {
          const BRIGHTNESS = 0.05; // max particle brightness between 0 and 1
          this.ctx.globalAlpha =
            (this.heatmap[i] * BRIGHTNESS * (204 / 255)) /
              this.PARTICLE_LIFETIME +
            51 / 255;
        }
        this.spriteSheet.drawSprite(0, this.ctx, x, y);
      }
    }

    // Draw particles

    if (Util.DEBUG) {
      for (let i = 0; i < this.PARTICLE_POOL_SIZE; i += 1) {
        const p = this.particles[i];
        this.ctx.globalAlpha = 1;
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(p.x, p.y, 2, 2);
      }
    }

    this.lastPlayheadX = playheadX;
  }

  /**
   * Gets the "heat" of every tile by calculating how many particles are on top of the tile
   * @returns {number[]} An array of numbers from 0 to 1, representing the "heat" of each tile
   */
  updateHeatmap() {
    for (let i = 0; i < this.PARTICLE_POOL_SIZE; i += 1) {
      const p = this.particles[i];
      if (p.life > 0) {
        const tile = Util.pixelCoordsToTileCoords(
          p.x,
          p.y,
          this.grid.width,
          this.grid.height,
          this.canvas.width,
          this.canvas.height,
        );
        if (tile)
          this.heatmap[Util.coordToIndex(tile.x, tile.y, this.grid.height)] +=
            p.life;
      }
    }
  }
}
