const startBtn = document.getElementById("startBtn");
const startCard = document.getElementById("startCard");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const successCard = document.getElementById("successCard");
const questionCard = document.getElementById("questionCard");
const levelLabel = document.getElementById("levelLabel");
const questionText = document.getElementById("questionText");
const questionHint = document.getElementById("questionHint");
const buttonRow = document.getElementById("buttonRow");
const audioToggle = document.getElementById("audioToggle");
const restartBtn = document.getElementById("restartBtn");
const confettiCanvas = document.getElementById("confetti");
const ctx = confettiCanvas.getContext("2d");

let audioEnabled = false;
let audioCtx = null;
let confettiParticles = [];
let confettiActive = false;
let currentLevelIndex = 0;

const levels = [
  {
    label: "LEVEL 1",
    question: "Are you my beautiful gorgeous perfect baby?",
    hint: "Press Yes to Lock It In",
  },
  {
    label: "LEVEL 2",
    question: "Do you like food?",
    hint: "Press Yes to Continue",
  },
  {
    label: "LEVEL 3",
    question: "Are you free on February the 14th?",
    hint: "Press Yes for the Final Level",
  },
  {
    label: "LEVEL 4",
    question: "Will You Be My Valentine?",
    hint: "Press Yes to Win",
  },
];

const resizeCanvas = () => {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
};

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const playBeep = (type = "square", frequency = 660, duration = 0.12) => {
  if (!audioEnabled) return;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  const oscillator = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.value = 0.07;
  oscillator.connect(gain);
  gain.connect(audioCtx.destination);
  oscillator.start();
  oscillator.stop(audioCtx.currentTime + duration);
};

const toggleAudio = () => {
  audioEnabled = !audioEnabled;
  audioToggle.setAttribute("aria-pressed", String(audioEnabled));
  audioToggle.textContent = `SOUND: ${audioEnabled ? "ON" : "OFF"}`;
  playBeep("sawtooth", audioEnabled ? 720 : 420, 0.15);
};

audioToggle.addEventListener("click", toggleAudio);

const moveNoButton = () => {
  const containerRect = buttonRow.getBoundingClientRect();
  const buttonRect = noBtn.getBoundingClientRect();
  const maxX = Math.max(0, containerRect.width - buttonRect.width);
  const maxY = Math.max(0, containerRect.height - buttonRect.height);
  const randomX = Math.random() * maxX;
  const randomY = Math.random() * maxY;
  noBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;
  playBeep("square", 560, 0.08);
};

noBtn.addEventListener("mouseenter", moveNoButton);
noBtn.addEventListener("click", moveNoButton);

const makeConfetti = () => {
  confettiParticles = Array.from({ length: 180 }, () => ({
    x: Math.random() * confettiCanvas.width,
    y: -20 - Math.random() * confettiCanvas.height * 0.3,
    size: 6 + Math.random() * 6,
    speed: 2 + Math.random() * 4,
    drift: (Math.random() - 0.5) * 1.5,
    rotation: Math.random() * Math.PI,
    rotationSpeed: (Math.random() - 0.5) * 0.2,
    color: `hsl(${330 + Math.random() * 40}, 90%, ${60 + Math.random() * 20}%)`,
  }));
};

const renderConfetti = () => {
  if (!confettiActive) return;
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiParticles.forEach((piece) => {
    piece.y += piece.speed;
    piece.x += piece.drift;
    piece.rotation += piece.rotationSpeed;
    if (piece.y > confettiCanvas.height + 20) {
      piece.y = -20;
      piece.x = Math.random() * confettiCanvas.width;
    }
    ctx.save();
    ctx.translate(piece.x, piece.y);
    ctx.rotate(piece.rotation);
    ctx.fillStyle = piece.color;
    ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 1.2);
    ctx.restore();
  });
  requestAnimationFrame(renderConfetti);
};

const showSuccess = () => {
  questionCard.style.display = "none";
  successCard.style.display = "block";
  successCard.setAttribute("aria-hidden", "false");
  confettiActive = true;
  makeConfetti();
  renderConfetti();
  playBeep("triangle", 880, 0.2);
};

const resetGame = () => {
  successCard.style.display = "none";
  successCard.setAttribute("aria-hidden", "true");
  questionCard.style.display = "none";
  startCard.style.display = "block";
  currentLevelIndex = 0;
  confettiActive = false;
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  noBtn.style.transform = "translate(0, 0)";
  playBeep("square", 520, 0.1);
};

const updateQuestion = () => {
  const level = levels[currentLevelIndex];
  levelLabel.textContent = level.label;
  questionText.textContent = level.question;
  questionHint.textContent = level.hint;
  noBtn.style.transform = "translate(0, 0)";
};

const startGame = () => {
  startCard.style.display = "none";
  questionCard.style.display = "block";
  updateQuestion();
  playBeep("triangle", 720, 0.12);
};

startBtn.addEventListener("click", startGame);
yesBtn.addEventListener("click", () => {
  if (currentLevelIndex < levels.length - 1) {
    currentLevelIndex += 1;
    updateQuestion();
    playBeep("triangle", 820, 0.1);
    return;
  }
  showSuccess();
});
restartBtn.addEventListener("click", resetGame);

startBtn.addEventListener("mouseenter", () => playBeep("sine", 660, 0.08));
yesBtn.addEventListener("mouseenter", () => playBeep("sine", 740, 0.08));
restartBtn.addEventListener("mouseenter", () => playBeep("sine", 680, 0.08));
