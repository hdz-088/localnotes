export default class NotesView {
  constructor(
    root,
    { onNoteSelect, onNoteDelete, onNoteAdd, onNoteEdit } = {}
  ) {
    this.root = root;
    this.onNoteAdd = onNoteAdd;
    this.onNoteDelete = onNoteDelete;
    this.onNoteEdit = onNoteEdit;
    this.onNoteSelect = onNoteSelect;
    this.root.innerHTML = `
      <div class="notes__sidebar">
        <button class="notes__add" type="button">Add Note</button>
        <div class="notes__list"></div>
      </div>
      <div class="notes__preview">
        <input class="notes__title" type="text" placeholder="Welcom to LocalNotes" />
        <textarea class="notes__body"></textarea>
      </div>
      <div class="notes__empty-state">
        <img src="assets/penguin.png" alt="No notes selected" class="notes__empty-image" />
        <h1 class="notes__empty-title">LocalNotes</h1>
        <p class="notes__empty-watermark">Made by <b><a href="https://github.com/hdz-088">HDz</a> 🦉</b>
      </div>
    `;

    const btnAddNote = this.root.querySelector(".notes__add");
    const inpTitle = this.root.querySelector(".notes__title");
    const inpBody = this.root.querySelector(".notes__body");

    btnAddNote.addEventListener("click", () => {
      this.onNoteAdd();
    });

    [inpTitle, inpBody].forEach((inputField) => {
      inputField.addEventListener("blur", () => {
        const updateTitle = inpTitle.value.trim();
        const updateBody = inpBody.value.trim();

        this.onNoteEdit(updateTitle, updateBody);
      });
    });

    this.updateNotePreviewVisibility(false);
  }

  _createListItemHTML(id, title, body, updated) {
    const MAX_BODY_LENGTH = 60;

    return `
      <div class="notes__list-item" data-note-id="${id}">
        <div class="notes__small-title">${title}</div>
        <div class="notes__small-body">
          ${body.substring(0, MAX_BODY_LENGTH)}
          ${body.length > MAX_BODY_LENGTH ? "..." : ""}
        </div>
        <div class="notes__small-updated">
          ${updated.toLocaleString(undefined, {
            dateStyle: "full",
            timeStyle: "short",
          })}
        </div>
      </div>
    `;
  }

  updateNotesList(notes) {
    const notesListContainer = this.root.querySelector(".notes__list");

    notesListContainer.innerHTML = "";

    for (const note of notes) {
      const html = this._createListItemHTML(
        note.id,
        note.title,
        note.body,
        new Date(note.updated)
      );

      notesListContainer.insertAdjacentHTML("beforeend", html);
    }

    notesListContainer
      .querySelectorAll(".notes__list-item")
      .forEach((noteListItem) => {
        noteListItem.addEventListener("click", () => {
          this.onNoteSelect(noteListItem.dataset.noteId);
        });

        noteListItem.addEventListener("dblclick", () => {
          const doDelete = confirm("This note will be deleted permanently");

          if (doDelete) {
            this.onNoteDelete(noteListItem.dataset.noteId);
          }
        });
      });
  }

  updateActiveNote(note) {
    this.root.querySelector(".notes__title").value = note.title;
    this.root.querySelector(".notes__body").value = note.body;

    this.root.querySelectorAll(".notes__list-item").forEach((noteListItem) => {
      noteListItem.classList.remove("notes__list-item--selected");
    });

    this.root
      .querySelector(`.notes__list-item[data-note-id="${note.id}"]`)
      .classList.add("notes__list-item--selected");
  }

  // updateNotePreviewVisibility(visible) {
  //   this.root.querySelector(".notes__preview").style.visibility = visible
  //     ? "visible"
  //     : "hidden";
  // }

  updateNotePreviewVisibility(visible) {
    this.root.querySelector(".notes__preview").style.display = visible
      ? "flex"
      : "none";
    this.root.querySelector(".notes__empty-state").style.display = visible
      ? "none"
      : "flex";
  }
}
