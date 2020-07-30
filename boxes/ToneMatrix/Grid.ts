import * as Tone from 'tone';
import GridRenderer from './GridRenderer';
import Util from './Util';
import SynthInstrument from './SynthInstrument';
import Tile from './Tile';

/** A 2-D matrix that keeps track of notes and can enable, disable, and play them */
export default class Grid {
  public readonly data: readonly Tile[];

  public readonly width: number;

  public readonly height: number;

  private renderer: GridRenderer;

  public readonly currentInstrument = 0;

  public readonly instruments: readonly SynthInstrument[];

  /**
   * Creates a new Grid
   * @param width - The width of the grid in tiles
   * @param height  - The height of the grid in tiles
   * @param canvas - The canvas DOM element that the grid should draw to
   */
  constructor(width: number, height: number, canvas: HTMLCanvasElement) {
    this.data = Array.from({ length: width * height }, () => new Tile());
    this.width = width;
    this.height = height;
    const instruments = [];
    instruments.push(
      new SynthInstrument(
        width,
        height,
        {
          oscillator: {
            type: 'sine',
          },
          envelope: {
            attack: 0.005,
            decay: 0.1,
            sustain: 0.3,
            release: 1,
          },
        },
        {
          frequency: 1100,
          rolloff: -12,
        },
      ),
    );
    instruments.push(
      new SynthInstrument(
        width,
        height,
        {
          oscillator: {
            type: 'sawtooth',
          },
          envelope: {
            attack: 0.005,
            decay: 0.1,
            sustain: 0.3,
            release: 2,
          },
        },
        {
          frequency: 1100,
          rolloff: -12,
        },
      ),
    );
    this.instruments = instruments;
    this.renderer = new GridRenderer(this, canvas);
  }

  /**
   * Updates and draws the grid to the canvas
   * @param mouseX - The current x position of the mouse on the canvas element
   * @param mouseY - The current y position of the mouse on the canvas element
   */
  update(mouseX: number, mouseY: number): void {
    this.renderer.update(mouseX, mouseY);
  }

  /**
   * Gets whether a grid tile is currently lit up (armed)
   * @param x - The x position, measured in grid tiles
   * @param y - The y position, measured in grid tiles
   * @returns Whether the tile is lit up
   */
  getTileValue(x: number, y: number): boolean {
    return this.data[Util.coordToIndex(x, y, this.height)].hasNote(
      this.currentInstrument,
    );
  }

  /**
   * Sets whether a grid tile is currently lit up (armed)
   * @param x - The x position, measured in grid tiles
   * @param y - The y position, measured in grid tiles
   * @param bool - Whether the tile should be turned on (true) or off (false)
   */
  setTileValue(x: number, y: number, bool: boolean): void {
    if (bool) {
      if (this.getTileValue(x, y)) return;
      // Turning on, schedule note

      this.data[Util.coordToIndex(x, y, this.height)].addNote(
        this.currentInstrument,
        this.instruments[this.currentInstrument].scheduleNote(x, y),
      );
    } else {
      if (!this.getTileValue(x, y)) return;
      // Turning off, unschedule note
      this.instruments[this.currentInstrument].unscheduleNote(
        this.data[Util.coordToIndex(x, y, this.height)].getNote(
          this.currentInstrument,
        ),
      );
      this.data[Util.coordToIndex(x, y, this.height)].removeNote(
        this.currentInstrument,
      );
    }
  }

  /**
   * Toggles whether a grid tile is currently lit up (armed)
   * @param x - The x position, measured in grid tiles
   * @param y - The y position, measured in grid tiles
   */
  toggleTileValue(x: number, y: number): void {
    this.setTileValue(x, y, !this.getTileValue(x, y));
  }

  /**
   * Turns off all tiles and removes all notes
   */
  clearAllTiles(): void {
    this.data.forEach((e) => e.removeAllNotes());
    this.instruments.forEach((inst) => inst.clearNotes());
    Tone.Transport.cancel();
  }

  setCurrentInstrument(instrumentId: number): void {
    if (instrumentId >= this.instruments.length) {
      console.warn('tried to switch to nonexistent instrument');
    } else {
      (this.currentInstrument as number) = instrumentId;
    }
  }

  /**
   * Sets whether the ToneMatrix grid is muted.
   * @param muted - True for muted, false for unmuted
   */
  // eslint-disable-next-line class-methods-use-this
  setMuted(muted: boolean): void {
    Tone.Destination.mute = muted;
  }

  /**
   * Saves the grid's current state into a savestate string
   * @returns The base64-encoded URL-encoded savestate string,
   *   ready for saving or outputting in a URL
   */
  toBase64(): string {
    let dataflag = false;
    const bytes = new Uint8Array(this.data.length / 8);
    for (let i = 0; i < this.data.length / 8; i += 1) {
      let str = '';
      for (let j = 0; j < 8; j += 1) {
        const tile = !this.data[Util.coordToIndex(i, j, 8)].isEmpty();
        if (tile) {
          str += '1';
          dataflag = true;
        } else {
          str += '0';
        }
      }
      bytes[i] = parseInt(str, 2);
    }
    if (!dataflag) return '';

    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i += 1) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  /**
   * Loads a savestate from a string into the grid
   * @param base64enc - The base64-encoded URL-encoded savestate string
   */
  fromBase64(base64enc: string): void {
    try {
      const base64 = decodeURIComponent(base64enc);
      const binary = atob(base64);

      const bytes = new Uint8Array(this.data.length / 8);
      let str = '';
      for (let i = 0; i < this.data.length / 8; i += 1) {
        const byte = binary.charCodeAt(i);
        bytes[i] = byte;
        let bits = byte.toString(2);
        bits = bits.padStart(8, '0');
        str += bits;
      }

      for (let i = 0; i < str.length; i += 1) {
        const bool = str[i] === '1';
        this.setTileValue(Math.floor(i / this.width), i % this.width, bool);
      }
    } catch (e) {
      // Invalid hash
    }
  }

  dispose(): void {
    Tone.Transport.cancel();
    this.instruments.forEach((inst) => inst.dispose());
    (this.data as Tile[]).length = 0;
    (this.instruments as SynthInstrument[]).length = 0;
  }
}
