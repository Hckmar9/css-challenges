class PomodoroTimer {
  constructor() {
    this.timeLeft = 25 * 60; // minutes in seconds
    this.totalTime = 25 * 60;
    this.isRunning = false;
    this.currentMode = "pomodoro";
    this.interval = null;

    this.settings = {
      pomodoro: 25,
      shortBreak: 5,
      longBreak: 15,
      font: "Kumbh Sans",
      color: "#FF6B6B",
    };

    // DOM Elements
    this.timeDisplay = document.querySelector(".time");
    this.timerButton = document.querySelector(".timer-button");
    this.modeButtons = document.querySelectorAll(".timer-modes button");
    this.progressRing = document.querySelector(".progress-ring circle");
    this.settingsButton = document.querySelector(".settings-button");
    this.modal = document.querySelector(".modal");
    this.closeButton = document.querySelector(".close-button");
    this.applyButton = document.querySelector(".apply-button");
    this.fontOptions = document.querySelectorAll(".font-option");
    this.colorOptions = document.querySelectorAll(".color-option");

    // This is for the circle progress
    const radius = this.progressRing.r.baseVal.value;
    this.circumference = radius * 2 * Math.PI;
    this.progressRing.style.strokeDasharray = `${this.circumference} ${this.circumference}`;

    this.initializeEventListeners();
    this.updateDisplay();
    this.initializeAudio(); // This line to play the sound
  }

  initializeAudio() {
    const sound = document.getElementById("timerSound");
    sound.load();

    // Enable audio
    document.body.addEventListener(
      "click",
      () => {
        sound
          .play()
          .then(() => {
            sound.pause();
            sound.currentTime = 0;
          })
          .catch((error) => {
            console.error("Audio initialization failed: ", error);
          });
      },
      { once: true }
    );
  }

  playSound() {
    const sound = document.getElementById("timerSound");
    // Reset the audio to the beginning
    sound.currentTime = 0;
    const playPromise = sound.play();

    if (playPromise !== undefined) {
      playPromise
        .then((_) => {})
        .catch((error) => {
          console.error("Audio playback failed: ", error);
        });
    }
  }

  handleTimerComplete() {
    this.pauseTimer();
    this.playSound();
    this.resetTimer();
  }

  initializeEventListeners() {
    // Timer controls
    this.timerButton.addEventListener("click", () => this.toggleTimer());

    // Mode selection
    this.modeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.setMode(button.dataset.mode);
      });
    });

    // Settings modal
    this.settingsButton.addEventListener("click", () => this.openSettings());
    this.closeButton.addEventListener("click", () => this.closeSettings());
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) this.closeSettings();
    });

    // Settings options
    this.fontOptions.forEach((option) => {
      option.addEventListener("click", () => this.selectFont(option));
    });

    this.colorOptions.forEach((option) => {
      option.addEventListener("click", () => this.selectColor(option));
    });

    this.applyButton.addEventListener("click", () => this.applySettings());
  }

  toggleTimer() {
    if (this.isRunning) {
      this.pauseTimer();
    } else {
      this.startTimer();
    }
  }

  startTimer() {
    this.isRunning = true;
    this.timerButton.textContent = "PAUSE";

    this.interval = setInterval(() => {
      this.timeLeft--;
      this.updateDisplay();

      if (this.timeLeft <= 0) {
        this.handleTimerComplete();
      }
    }, 1000);
  }

  pauseTimer() {
    this.isRunning = false;
    this.timerButton.textContent = "START";
    clearInterval(this.interval);
  }

  resetTimer() {
    this.timeLeft = this.totalTime;
    this.updateDisplay();
  }

  setMode(mode) {
    this.currentMode = mode;
    this.modeButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.mode === mode);
    });

    // Update timer duration based on mode
    this.totalTime = this.settings[mode] * 60;
    this.timeLeft = this.totalTime;

    // Reset timer state
    this.pauseTimer();
    this.updateDisplay();
  }

  updateDisplay() {
    // Update time display
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    this.timeDisplay.textContent = `${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;

    // Update progress ring
    const progress = this.timeLeft / this.totalTime;
    const offset = this.circumference - progress * this.circumference;
    this.progressRing.style.strokeDashoffset = offset;
  }

  openSettings() {
    this.modal.classList.add("show");
    // Populate current settings
    document.getElementById("pomodoroTime").value = this.settings.pomodoro;
    document.getElementById("shortBreakTime").value = this.settings.shortBreak;
    document.getElementById("longBreakTime").value = this.settings.longBreak;
  }

  closeSettings() {
    this.modal.classList.remove("show");
  }

  selectFont(option) {
    this.fontOptions.forEach((opt) => opt.classList.remove("active"));
    option.classList.add("active");
  }

  selectColor(option) {
    this.colorOptions.forEach((opt) => opt.classList.remove("active"));
    option.classList.add("active");
  }

  applySettings() {
    // Save time settings
    this.settings.pomodoro = parseInt(
      document.getElementById("pomodoroTime").value
    );
    this.settings.shortBreak = parseInt(
      document.getElementById("shortBreakTime").value
    );
    this.settings.longBreak = parseInt(
      document.getElementById("longBreakTime").value
    );

    // Save font setting
    const selectedFont = document.querySelector(".font-option.active").dataset
      .font;
    document.body.style.fontFamily = selectedFont;

    // Save color setting
    const selectedColor = document.querySelector(".color-option.active").dataset
      .color;
    document.documentElement.style.setProperty(
      "--primary-color",
      selectedColor
    );

    // Update current timer if needed
    this.totalTime = this.settings[this.currentMode] * 60;
    if (!this.isRunning) {
      this.timeLeft = this.totalTime;
      this.updateDisplay();
    }

    this.closeSettings();
  }
}

// Initialize the timer when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new PomodoroTimer();
});
