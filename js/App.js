// import NotesAPI from "./NotesAPI.js";
// import NotesView from "./NotesView.js";

// export default class App {
//   constructor(root) {
//     this.notes = [];
//     this.activeNote = null;
//     this.view = new NotesView(root, this._handlers());

//     this._refreshNotes();
//   }

//   _refreshNotes() {
//     const notes = NotesAPI.getAllNotes();

//     this._setNotes(notes);

//     // if (notes.length > 1) {
//     //   this._setActiveNote(notes[0]);
//     // }
//   }

//   _setActiveNote(note) {
//     this.activeNote = note;
//     this.view.updateActiveNote(note);
//   }

//   _setNotes(notes) {
//     this.notes = notes;
//     this.view.updateNotesList(notes);
//     this.view.updateNotePreviewVisibility(this.notes.length > 0);
//   }

//   _handlers() {
//     return {
//       onNoteSelect: (noteId) => {
//         const selectedNote = this.notes.find((note) => note.id == noteId);
//         this._setActiveNote(selectedNote);
//       },
//       onNoteAdd: () => {
//         const newNote = {
//           title: "New Note",
//           body: "",
//         };

//         NotesAPI.saveNote(newNote);
//         this._refreshNotes();
//       },
//       onNoteEdit: (title, body) => {
//         NotesAPI.saveNote({
//           id: this.activeNote.id,
//           title: title,
//           body: body,
//         });

//         this._refreshNotes();
//       },
//       onNoteDelete: (noteId) => {
//         NotesAPI.deleteNote(noteId);
//         this._refreshNotes();
//       },
//     };
//   }
// }

import NotesAPI from "./NotesAPI.js";
import NotesView from "./NotesView.js";

export default class App {
  constructor(root) {
    this.notes = [];
    this.activeNote = null;
    this.view = new NotesView(root, this._handlers());

    this._refreshNotes();
  }

  _refreshNotes() {
    const notes = NotesAPI.getAllNotes();

    this._setNotes(notes);

    // Don't automatically select the first note
    // Let the user choose which note to view
  }

  _setActiveNote(note) {
    this.activeNote = note;
    this.view.updateActiveNote(note);
    this.view.updateNotePreviewVisibility(true); // Show preview when note is selected
  }

  _setNotes(notes) {
    this.notes = notes;
    this.view.updateNotesList(notes);

    // Only show preview if there's an active note selected
    // Otherwise show empty state
    if (this.activeNote) {
      this.view.updateNotePreviewVisibility(true);
    } else {
      this.view.updateNotePreviewVisibility(false);
    }
  }

  _handlers() {
    return {
      onNoteSelect: (noteId) => {
        const selectedNote = this.notes.find((note) => note.id == noteId);
        this._setActiveNote(selectedNote);
      },
      onNoteAdd: () => {
        const newNote = {
          title: "New Note",
          body: "",
        };

        NotesAPI.saveNote(newNote);
        this._refreshNotes();

        // Automatically select the new note
        const updatedNotes = NotesAPI.getAllNotes();
        const addedNote = updatedNotes[updatedNotes.length - 1]; // Assuming new note is added at the end
        this._setActiveNote(addedNote);
      },
      onNoteEdit: (title, body) => {
        if (this.activeNote) {
          NotesAPI.saveNote({
            id: this.activeNote.id,
            title: title,
            body: body,
          });

          this._refreshNotes();
        }
      },
      onNoteDelete: (noteId) => {
        NotesAPI.deleteNote(noteId);

        // If the deleted note was the active note, clear the selection
        if (this.activeNote && this.activeNote.id == noteId) {
          this.activeNote = null;
        }

        this._refreshNotes();
      },
    };
  }
}
