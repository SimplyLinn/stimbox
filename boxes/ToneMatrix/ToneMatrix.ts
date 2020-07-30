import * as Tone from 'tone';
import Grid from './Grid';
import Util from './Util';

interface Listener {
  readonly trgt: {
    readonly addEventListener: (
      evt: keyof HTMLElementEventMap,
      cb: unknown,
    ) => void;
    readonly removeEventListener: (
      evt: keyof HTMLElementEventMap,
      cb: unknown,
    ) => void;
  };
  readonly evt: keyof HTMLElementEventMap;
  readonly cb: unknown;
}

/** Main class of ToneMatrix Redux, a pentatonic step sequencer */
export default class ToneMatrix {
  /**
   * The main canvas element that ToneMatrix draws to
   */
  private c: HTMLCanvasElement;

  /**
   * The main canvas element's 2d drawing context
   */
  private ctx: CanvasRenderingContext2D;

  /**
   * The width of the grid, measured in grid tiles
   */
  private WIDTH: number;

  /**
   * The height of the grid, measured in grid tiles
   */
  private HEIGHT: number;

  private grid: Grid;

  private mouseX = NaN;

  private mouseY = NaN;

  private listeners: Listener[] = [];

  private destroyed = false;

  /**
   * Creates a new ToneMatrix Redux instance, and attach it to existing DOM elements
   * @param canvasWrapperEl - The wrapper element that ToneMatrix should inject its
   *    canvas into
   * @param clearNotesButtonEl - A DOM element that should clear all notes when clicked
   * @param muteButtonEl - Button to mute audio output
   */
  constructor(
    canvasWrapperEl: HTMLElement,
    clearNotesButtonEl: HTMLElement,
    muteButtonEl: HTMLElement,
  ) {
    this.c = document.createElement('canvas');
    canvasWrapperEl.appendChild(this.c);
    const rect = this.c.getBoundingClientRect();

    const ctx = this.c.getContext('2d');
    if (ctx == null) throw new Error('Could not create context');
    this.ctx = ctx;

    this.WIDTH = 16;
    this.HEIGHT = 16;

    // Get the size of the canvas in CSS pixels.
    // Give the canvas pixel dimensions of their CSS
    // size * the device pixel ratio.
    const dpr = devicePixelRatio || 1;
    this.c.height = rect.height * dpr;
    this.c.width = rect.height * (this.WIDTH / this.HEIGHT) * dpr;

    this.grid = new Grid(this.WIDTH, this.HEIGHT, this.c);

    this.mouseX = -1;
    this.mouseY = -1;

    this.listen(clearNotesButtonEl, 'click', () => {
      this.clear();
    });

    // Integrate the clipboard button with the ClipboardJS library

    // Mute button element
    this.listen(muteButtonEl, 'click', () => {
      if (muteButtonEl.classList.contains('muted')) {
        muteButtonEl.classList.remove('muted');
        this.setMuted(false);
      } else {
        muteButtonEl.classList.add('muted');
        this.setMuted(true);
      }
    });

    // Listen for clicks on the canvas

    let arming: boolean | null = null; // Whether our cursor is currently turning on or turning off tiles

    const boundCanvasClick = function canvasClick(
      this: ToneMatrix,
      x: number,
      y: number,
    ) {
      const tile = Util.pixelCoordsToTileCoords(
        x,
        y,
        this.WIDTH,
        this.HEIGHT,
        this.c.width,
        this.c.height,
      );
      if (!tile) return;
      if (arming === null) arming = !this.grid.getTileValue(tile.x, tile.y);
      this.grid.setTileValue(tile.x, tile.y, arming);
      // Make sure audio context is running
      Tone.context.resume();
    }.bind(this);
    this.listen(this.c, 'mousemove', (e) => {
      this.updateCanvasMousePosition(e);
      if (e.buttons !== 1) return; // Only if left button is held
      boundCanvasClick(this.mouseX, this.mouseY);
    });
    this.listen(this.c, 'mouseleave', () => {
      this.resetCanvasMousePosition();
    });
    this.listen(this.c, 'mousedown', (e) => {
      this.updateCanvasMousePosition(e);
      if (e.buttons !== 1) return; // Only if left button is held
      arming = null;
      boundCanvasClick(this.mouseX, this.mouseY);
    });
    this.listen(this.c, 'touchstart', (e) => {
      e.preventDefault(); // Prevent emulated click
      if (e.touches.length === 1) {
        arming = null;
      }
      Array.from(e.touches).forEach((touch) => {
        this.updateCanvasMousePosition(touch);
        boundCanvasClick(this.mouseX, this.mouseY);
      });
    });
    this.listen(this.c, 'touchend', (e) => {
      e.preventDefault(); // Prevent emulated click
      this.resetCanvasMousePosition();
    });
    this.listen(this.c, 'touchmove', (e) => {
      e.preventDefault(); // Prevent emulated click
      Array.from(e.touches).forEach((touch) => {
        this.updateCanvasMousePosition(touch);
        boundCanvasClick(this.mouseX, this.mouseY);
      });
    });

    // Secret instrument switcher

    this.listen(window, 'keydown', (event) => {
      if (!event.isComposing && !(event.keyCode === 229)) {
        // not some chinese character weirdness
        if (event.keyCode >= 48 && event.keyCode <= 57) {
          this.grid.setCurrentInstrument(event.keyCode - 48); // 0 through 9
        } else if (event.keyCode >= 96 && event.keyCode <= 105) {
          this.grid.setCurrentInstrument(event.keyCode - 96); // 0 through 9, numpad
        }
      }
    });

    Tone.Transport.loopEnd = '1m'; // loop at one measure
    Tone.Transport.loop = true;
    Tone.Transport.start();

    // If Chrome Autoplay Policy is blocking audio,
    // add a play button that encourages user interaction

    if (
      'ontouchstart' in window ||
      window.location.toString().indexOf('?') >= 0
    ) {
      this.listen(canvasWrapperEl, 'click', () => {
        Tone.context.resume().then(() => {
          document.body.classList.add('playing');
        });
      });
      Tone.context.resume().then(() => {
        document.body.classList.add('playing');
      });
    } else {
      document.body.classList.add('playing');
    }

    // Kick off game loop

    const boundUpdateContinious = function updateContinuous(this: ToneMatrix) {
      if (this.destroyed) return;
      this.update();
      requestAnimationFrame(boundUpdateContinious);
    }.bind(this);
    requestAnimationFrame(boundUpdateContinious);
  }

  /**
   * Updates the state of the app, and draws it to the canvas.
   * Called in requestAnimationFrame.
   */
  update(): void {
    this.grid.update(this.mouseX, this.mouseY);
  }

  /**
   * Updates the this.mouseX and this.mouseY variables based on where the mouse is on the canvas
   * @param e - The touch or click event that contains the new "mouse" position
   */
  updateCanvasMousePosition(e: MouseEvent | Touch): void {
    const currentRect = this.c.getBoundingClientRect(); // abs. size of element
    const scaleX = this.c.width / currentRect.width; // relationship bitmap vs. element for X
    const scaleY = this.c.height / currentRect.height; // relationship bitmap vs. element for Y

    const x = (e.clientX - currentRect.left) * scaleX;
    const y = (e.clientY - currentRect.top) * scaleY;

    // Update internal position
    this.mouseX = x;
    this.mouseY = y;
  }

  /**
   * Resets the this.mouseX and this.mouseY variables.
   * Call this when the mouse leaves the canvas or the screen is not being touched.
   */
  resetCanvasMousePosition(): void {
    // Update internal position
    this.mouseX = NaN;
    this.mouseY = NaN;
  }

  /**
   * Clears all notes from the grid and resets the sharing URL.
   */
  clear(): void {
    this.grid.clearAllTiles();
  }

  /**
   * Sets whether the ToneMatrix application is muted.
   * @param muted - True for muted, false for unmuted
   */
  setMuted(muted: boolean): void {
    this.grid.setMuted(muted);
  }

  /**
   * Cleans up all resources used by this ToneMatrix
   */
  dispose(): void {
    this.destroyed = true;
    this.grid.dispose();
    this.listeners.forEach((listener) => {
      listener.trgt.removeEventListener(
        listener.evt,
        listener.cb as () => void,
      );
    });
    // restore mute status
    Tone.Destination.mute = false;
    this.listeners = [];
  }

  /**
   *
   */
  listen<P extends keyof HTMLElementEventMap>(
    trgt: {
      addEventListener: (
        evt: P,
        cb: (ev: HTMLElementEventMap[P]) => void,
      ) => void;
      removeEventListener: (
        evt: P,
        cb: (ev: HTMLElementEventMap[P]) => void,
      ) => void;
    },
    evt: P,
    cb: (ev: HTMLElementEventMap[P]) => void,
  ): void {
    this.listeners.push({
      trgt: trgt as Listener['trgt'],
      evt,
      cb,
    });
    trgt.addEventListener(evt, cb);
  }
}
