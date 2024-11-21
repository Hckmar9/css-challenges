// Here we retrieve and parse notes from localStorage
let notes;
try {
  const storedNotes = localStorage.getItem("notes");
  notes = storedNotes ? JSON.parse(storedNotes) : [];
} catch (error) {
  console.error("Error parsing notes from localStorage:", error);
  notes = [];
}

let currentEditIndex = null;

const notesSection = document.getElementById("notes-section");
const noteModal = document.getElementById("note-modal");
const noteForm = document.getElementById("note-form");
const newNoteBtn = document.getElementById("new-note-btn");
const themeToggleBtn = document.getElementById("theme-toggle");
const searchInput = document.getElementById("search-input");

// Here we save notes back to localStorage
const saveNotesToStorage = () => {
  try {
    localStorage.setItem("notes", JSON.stringify(notes));
  } catch (error) {
    console.error("Error saving notes to localStorage:", error);
  }
};

// And here we render all notes in the UI with search and sort
const renderNotes = () => {
  const searchTerm = searchInput.value.toLowerCase(); // Get the search term
  const filteredNotes = notes
    .filter(
      (note) =>
        note.title.toLowerCase().includes(searchTerm) ||
        note.content.toLowerCase().includes(searchTerm)
    ) // Filter notes
    .sort((a, b) => a.title.localeCompare(b.title)); // Sort notes by title

  notesSection.innerHTML = ""; // Clear the notes section
  filteredNotes.forEach((note, index) => {
    const noteElement = document.createElement("div");
    noteElement.classList.add(
      "note",
      document.body.classList.contains("dark") ? "dark" : "light"
    );
    noteElement.innerHTML = `
      <h2>${note.title}</h2>
      <p>${note.content}</p>
      <div class="tags">${note.tags.join(", ")}</div>
      <div class="actions">
        <button data-edit="${index}">Edit</button>
        <button data-delete="${index}">Delete</button>
      </div>
    `;
    notesSection.appendChild(noteElement);
  });
};

const toggleModal = () => {
  noteModal.classList.toggle("active");
};

// This is to toggle between light and dark theme
const toggleTheme = () => {
  const currentTheme = document.body.classList.contains("dark")
    ? "dark"
    : "light";
  const newTheme = currentTheme === "light" ? "dark" : "light";

  // Apply the new theme
  document.body.classList.remove(currentTheme);
  document.body.classList.add(newTheme);

  // Update the header and buttons with the theme class. Modal in dark mode is still showing a different h2, need to check that
  document.querySelector("header").classList.remove(currentTheme);
  document.querySelector("header").classList.add(newTheme);

  // Save the selected theme to localStorage
  localStorage.setItem("theme", newTheme);

  // Re-render notes to apply the chosen theme
  renderNotes();
};

// Apply the saved theme on page load
const savedTheme = localStorage.getItem("theme") || "light"; // Default to light theme, you can default the one you like best
document.body.classList.add(savedTheme);
document.querySelector("header").classList.add(savedTheme);

// Re-render notes with the chosen theme
renderNotes();

// Event listener for the theme toggle button
themeToggleBtn.addEventListener("click", toggleTheme);

// Event listener for the "New note" button
newNoteBtn.addEventListener("click", () => {
  currentEditIndex = null;
  noteForm.reset();
  toggleModal();
});

noteForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("note-title").value;
  const content = document.getElementById("note-content").value;
  const tags = document
    .getElementById("note-tags")
    .value.split(",")
    .map((tag) => tag.trim());

  if (currentEditIndex !== null) {
    notes[currentEditIndex] = { title, content, tags };
  } else {
    notes.push({ title, content, tags });
  }
  // Localstorage
  saveNotesToStorage();
  renderNotes();
  toggleModal();
});

notesSection.addEventListener("click", (e) => {
  if (e.target.dataset.edit !== undefined) {
    currentEditIndex = e.target.dataset.edit;
    const note = notes[currentEditIndex];
    document.getElementById("note-title").value = note.title;
    document.getElementById("note-content").value = note.content;
    document.getElementById("note-tags").value = note.tags.join(", ");
    toggleModal();
  }

  if (e.target.dataset.delete !== undefined) {
    const index = e.target.dataset.delete;
    notes.splice(index, 1);
    saveNotesToStorage();
    renderNotes();
  }
});

renderNotes();

const closeModal = () => {
  noteModal.classList.remove("active");
};

document
  .getElementById("close-modal-btn")
  .addEventListener("click", closeModal);

searchInput.addEventListener("input", renderNotes);
