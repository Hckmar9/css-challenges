// We're making it easy, so the available words are hardcoded, you can change them tho, or use an API
const words = {
  animals: [
    "ELEPHANT",
    "CAT",
    "GIRAFFE",
    "DOLPHIN",
    "KANGAROO",
    "ZEBRA",
    "TIGER",
    "LION",
  ],
  fruits: [
    "APPLE",
    "BANANA",
    "ORANGE",
    "MANGO",
    "PINEAPPLE",
    "GRAPE",
    "KIWI",
    "PEACH",
  ],
  countries: [
    "FRANCE",
    "JAPAN",
    "BRAZIL",
    "CANADA",
    "EGYPT",
    "SPAIN",
    "ITALY",
    "MEXICO",
  ],
  sports: [
    "FOOTBALL",
    "TENNIS",
    "BOXING",
    "SWIMMING",
    "BASKETBALL",
    "BASEBALL",
    "HOCKEY",
    "GOLF",
  ],
};

let currentWord = "";
let guessedLetters = new Set();
let lives = 8;

// Updates the display of the hangman image based on the number of lives left.
// Each part of the hangman image is given a class of "hangman-part".

function updateHangman() {
  const parts = document.querySelectorAll(".hangman-part");
  const lostLives = 8 - lives;
  parts.forEach((part, index) => {
    part.style.display = index < lostLives ? "block" : "none";
  });
}

// Shows the main menu.
function showMenu() {
  document.querySelector(".menu-section").style.display = "flex";
  document.querySelector(".instructions").style.display = "none";
  document.querySelector(".categories").style.display = "none";
  document.querySelector(".game-section").style.display = "none";
}

// This is to display the instructions section while hiding the menu.
function showInstructions() {
  document.querySelector(".menu-section").style.display = "none";
  document.querySelector(".instructions").style.display = "block";
  document.querySelector(".categories").style.display = "none";
  document.querySelector(".game-section").style.display = "none";
}

// With this one, we show the categories section, and hide the instructions.
// Each button has an event listener that calls startGame with its category.
function showCategories() {
  document.querySelector(".menu-section").style.display = "none";
  document.querySelector(".instructions").style.display = "none";
  document.querySelector(".categories").style.display = "grid";
  document.querySelector(".game-section").style.display = "none";

  const categoriesDiv = document.querySelector(".categories");
  categoriesDiv.innerHTML = "";

  Object.keys(words).forEach((category) => {
    const button = document.createElement("button");
    button.className = "category-btn";
    button.innerHTML = `${getCategoryEmoji(category)} ${
      category.charAt(0).toUpperCase() + category.slice(1)
    }`;
    button.onclick = () => startGame(category);
    categoriesDiv.appendChild(button);
  });
}

// Here is just to show the emoji that represents a category (Harcoded).
function getCategoryEmoji(category) {
  const emojis = {
    animals: "🦁",
    fruits: "🍎",
    countries: "🌎",
    sports: "⚽",
  };
  return emojis[category];
}

// Starts a new game with the given category selecting a random word from the hardcoded categories.
function startGame(category) {
  document.querySelector(".categories").style.display = "none";
  document.querySelector(".game-section").style.display = "block";

  // https://www.w3schools.com/js/js_math.asp
  currentWord =
    words[category][Math.floor(Math.random() * words[category].length)];
  guessedLetters = new Set();
  lives = 8;

  document.querySelector(".face").style.display = "none";
  updateDisplay();
  createKeyboard();
  updateHangman();
}

// Creates a virtual keyboard with letter buttons that trigger a guess when clicked.
function createKeyboard() {
  const keyboard = document.querySelector(".keyboard");
  keyboard.innerHTML = "";

  "QWERTYUIOPASDFGHJKLZXCVBNM".split("").forEach((letter) => {
    const button = document.createElement("button");
    button.textContent = letter;
    button.className = "key";
    button.onclick = () => guessLetter(letter);
    keyboard.appendChild(button);
  });
}

// Updates the word display with its current state of the guessed letters. And updates the lives counter and icons.
function updateDisplay() {
  const display = document.querySelector(".word-display");
  display.textContent = currentWord
    .split("")
    .map((letter) => (guessedLetters.has(letter) ? letter : "_"))
    .join(" ");

  document.getElementById("lives").textContent = lives;
  updateHealthIcons();

  if (!display.textContent.includes("_")) {
    endGame(true);
  } else if (lives === 0) {
    endGame(false);
  }
}

function updateHealthIcons() {
  const healthIcons = document.querySelector(".health-icons");
  healthIcons.innerHTML = "❤️".repeat(lives) + "🖤".repeat(8 - lives);
}

function guessLetter(letter) {
  if (guessedLetters.has(letter)) return;

  guessedLetters.add(letter);
  if (!currentWord.includes(letter)) {
    lives--;
    updateHangman();
  }

  updateDisplay();

  document.querySelectorAll(".key").forEach((button) => {
    if (button.textContent === letter) {
      button.disabled = true;
    }
  });
}

// Message when ending the game. If it's a win, it shows a congrats message. If it's a loss, it shows the right answer.
function endGame(won) {
  const keyboard = document.querySelector(".keyboard");
  keyboard.innerHTML = "";

  const gameOver = document.createElement("div");
  gameOver.className = "game-over " + (won ? "win" : "lose");
  gameOver.textContent = won
    ? "🎉 Congratulations! You won!"
    : "😢 Game Over! The word was: " + currentWord;

  keyboard.appendChild(gameOver);

  if (!won) {
    document.querySelector(".face").style.display = "block";
  }
}

showMenu();
