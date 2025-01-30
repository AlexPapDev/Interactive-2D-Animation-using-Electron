const canvas = document.getElementById('animationCanvas')
const ctx = canvas.getContext('2d')
canvas.width = screen.width
canvas.height = screen.height

const FRAME_COUNT = 224 // Number of frames
const FRAME_RATE = 11.11 // Frames per second

const frames = []
let currentFrame = 0
let isPlayingForward = false
let isPlayingBackward = false
let gamepadIndex = null
let previousButtonStates = []
let isKeyDownLeft = false;
let isKeyDownRight = false;

// Preload all frames before starting
function preloadFrames() {
  const preloadPromises = []

  for (let i = 0 ; i < FRAME_COUNT; i++) {
    const img = new Image()
    img.src = `assets/elaaaa/img${String(i + 1).padStart(3, '0')}.jpg`
    frames.push(img)

    const promise = new Promise((resolve) => {
      img.onload = resolve
      img.onerror = resolve
    })
    preloadPromises.push(promise)
  }

  return Promise.all(preloadPromises)
}

// Draw a specific frame
function drawFrame(frameIndex) {
  const img = frames[frameIndex]
  if (img.complete) {
    const width = canvas.height * (img.width / img.height)
    const xOffset = (canvas.width - width) / 2

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, xOffset, 0, width, canvas.height)
  }
}

// Combined game loop for animation and input polling
function gameLoop() {
  // Poll gamepad input
  if (gamepadIndex !== null) {
    const gamepad = navigator.getGamepads()[gamepadIndex]
    if (gamepad) {
      const rightButton = gamepad.buttons[15]; // Right arrow button
      const leftButton = gamepad.buttons[14]; // Left arrow button

      const rightButtonPressed = rightButton.pressed;
      const leftButtonPressed = leftButton.pressed;

      const rightButtonDown = rightButtonPressed && !previousButtonStates[15];
      const leftButtonDown = leftButtonPressed && !previousButtonStates[14];
      const rightButtonUp = !rightButtonPressed && previousButtonStates[15];
      const leftButtonUp = !leftButtonPressed && previousButtonStates[14];

      if (rightButtonDown) {
        isPlayingForward = true;
      } 
      if (leftButtonDown) {
        isPlayingBackward = true;
      }
      if (rightButtonUp) {
        isPlayingForward = false;
      }
      if (leftButtonUp) {
        isPlayingBackward = false;
      }

      // Store button states for the next frame
      previousButtonStates[15] = rightButtonPressed;
      previousButtonStates[14] = leftButtonPressed;
    }
  } else {
    if (isKeyDownRight) {
      isPlayingForward = true;
    } 
    if (isKeyDownLeft) {
      isPlayingBackward = true;
    }
    if (!isKeyDownRight) {
      isPlayingForward = false;
    }
    if (!isKeyDownLeft) {
      isPlayingBackward = false;
    }
  }

  // Handle animation
  if (isPlayingForward) {
    currentFrame = (currentFrame % (FRAME_COUNT - 1)) + 1
    drawFrame(currentFrame)
  } else if (isPlayingBackward) {
    currentFrame = (currentFrame - 1 + FRAME_COUNT) % FRAME_COUNT
    drawFrame(currentFrame)
  }

  // Request next frame
  setTimeout(() => requestAnimationFrame(gameLoop), 1000 / FRAME_RATE)
}

// Start everything once frames are preloaded
window.addEventListener("gamepadconnected", (event) => {
  gamepadIndex = event.gamepad.index
  console.log(`Gamepad connected: ${event.gamepad.id}`)
})

preloadFrames().then(() => {
  console.log("All frames preloaded, starting animation.")
  requestAnimationFrame(gameLoop)
})
function handleKeyDown(event) {
  if (event.key === "ArrowRight") {
    isKeyDownRight = true;
  } else if (event.key === "ArrowLeft") {
    isKeyDownLeft = true;
  }
}

function handleKeyUp(event) {
  if (event.key === "ArrowRight") {
    isKeyDownRight = false;
  } else if (event.key === "ArrowLeft") {
    isKeyDownLeft = false;
  }
}
window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);