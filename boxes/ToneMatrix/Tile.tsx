export default class Tile {
  private notes: unknown[] = [];

  private numberOfNotes = 0;

  isEmpty() {
    return this.numberOfNotes === 0;
  }

  getNote(i: number) {
    return this.notes[i];
  }

  hasNote(i: number) {
    return typeof this.notes[i] !== 'undefined';
  }

  addNote(i: number, noteId: unknown) {
    this.notes[i] = noteId;
    this.numberOfNotes += 1;
  }

  removeNote(i: number) {
    delete this.notes[i];
    this.numberOfNotes -= 1;
  }

  removeAllNotes() {
    this.notes = [];
    this.numberOfNotes = 0;
  }
}
