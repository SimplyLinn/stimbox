import GridRenderer from './GridRenderer';
import Util from './Util';

/** A 2-D matrix that keeps track of notes and can enable, disable, and play them */
export default class Grid {
  private pData: Tile[];

  public get data(): readonly Tile[] {
    return this.pData;
  }

  public readonly width: number;

  public readonly height: number;

  private renderer: GridRenderer;

  private pCurrentInstrument: number = 0;

  public get currentInstrument(): number {
    return this.pCurrentInstrument;
  }

  public readonly instruments: readonly SynthInstrument[];

  /**
   * Creates a new Grid
   * @param width - The width of the grid in tiles
   * @param height  - The height of the grid in tiles
   * @param canvas - The canvas DOM element that the grid should draw to
   */
  constructor(width: number, height: number, canvas: HTMLCanvasElement) {
    this.pData = Array.from({ length: width * height }, () => new Tile());
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
  update(mouseX: number, mouseY: number) {
    this.renderer.update(mouseX, mouseY);
  }

  /**
   * Gets whether a grid tile is currently lit up (armed)
   * @param x - The x position, measured in grid tiles
   * @param y - The y position, measured in grid tiles
   * @returns Whether the tile is lit up
   */
  getTileValue(x: number, y: number) {
    return this.pData[Util.coordToIndex(x, y, this.height)].hasNote(
      this.pCurrentInstrument,
    );
  }

  /**
   * Sets whether a grid tile is currently lit up (armed)
   * @param x - The x position, measured in grid tiles
   * @param y - The y position, measured in grid tiles
   * @param bool - Whether the tile should be turned on (true) or off (false)
   */
  setTileValue(x: number, y: number, bool: boolean) {
    if (bool) {
      if (this.getTileValue(x, y)) return;
      // Turning on, schedule note

      this.pData[Util.coordToIndex(x, y, this.height)].addNote(
        this.pCurrentInstrument,
        this.instruments[this.pCurrentInstrument].scheduleNote(x, y),
      );
    } else {
      if (!this.getTileValue(x, y)) return;
      // Turning off, unschedule note
      this.instruments[this.pCurrentInstrument].unscheduleNote(
        this.pData[Util.coordToIndex(x, y, this.height)].getNote(
          this.pCurrentInstrument,
        ),
      );
      this.pData[Util.coordToIndex(x, y, this.height)].removeNote(
        this.pCurrentInstrument,
      );
    }
  }

  /**
   * Toggles whether a grid tile is currently lit up (armed)
   * @param x - The x position, measured in grid tiles
   * @param y - The y position, measured in grid tiles
   */
  toggleTileValue(x: number, y: number) {
    this.setTileValue(x, y, !this.getTileValue(x, y));
  }

  /**
   * Turns off all tiles and removes all notes
   */
  clearAllTiles() {
    this.pData.forEach((e) => e.removeAllNotes());
    Tone.Transport.cancel();
  }

  setCurrentInstrument(instrumentId: number) {
    if (instrumentId >= this.instruments.length) {
      console.warn('tried to switch to nonexistent instrument');
    } else {
      this.pCurrentInstrument = instrumentId;
    }
  }

  /**
   * Sets whether the ToneMatrix grid is muted.
   * @param muted - True for muted, false for unmuted
   */
  // eslint-disable-next-line class-methods-use-this
  setMuted(muted: boolean) {
    Tone.Destination.mute = muted;
  }

  /**
   * Saves the grid's current state into a savestate string
   * @returns The base64-encoded URL-encoded savestate string,
   *   ready for saving or outputting in a URL
   */
  toBase64() {
    let dataflag = false;
    const bytes = new Uint8Array(this.pData.length / 8);
    for (let i = 0; i < this.pData.length / 8; i += 1) {
      let str = '';
      for (let j = 0; j < 8; j += 1) {
        const tile = !this.pData[Util.coordToIndex(i, j, 8)].isEmpty();
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
    const base64 = btoa(binary);
    const base64enc = encodeURIComponent(base64);
    return base64enc;
  }

  /**
   * Loads a savestate from a string into the grid
   * @param base64enc - The base64-encoded URL-encoded savestate string
   */
  fromBase64(base64enc: string) {
    try {
      const base64 = decodeURIComponent(base64enc);
      const binary = atob(base64);

      const bytes = new Uint8Array(this.pData.length / 8);
      let str = '';
      for (let i = 0; i < this.pData.length / 8; i += 1) {
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
}
