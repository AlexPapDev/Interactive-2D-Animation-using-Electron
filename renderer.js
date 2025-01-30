const canvas = document.getElementById('animationCanvas')
const ctx = canvas.getContext('2d')
canvas.width = screen.width
canvas.height = screen.height

const FRAME_COUNT = 224 // Number of frames
const FRAME_RATE = 11.11 // Frames per second

const LEFT_BTN_VAL = 14
const RIGHT_BTN_VAL = 15

const frames = []
let currentFrame = 0
let isPlayingForward = false
let isPlayingBackward = false
let gamepadIndex = null
let previousButtonStates = []
let isKeyDownLeft = false
let isKeyDownRight = false

// Preload all frames before starting
function preloadFrames() {
  const preloadPromises = []

  for (let i = 0; i < FRAME_COUNT; i++) {
    const img = new Image()
    img.src = `assets/ela2/img${String(i + 1).padStart(3, '0')}.jpg`

    const promise = new Promise((resolve) => {
      img.onload = async () => {
        const bitmap = await createImageBitmap(img)
        frames[i] = bitmap
        resolve()
      }
      img.onerror = resolve
    })

    preloadPromises.push(promise)
  }

  return Promise.all(preloadPromises)
}

// Draw a specific frame
function drawFrame(frameIndex) {
  const img = frames[frameIndex]
  if (img) { // Ensure the frame is loaded
    const width = canvas.height * (img.width / img.height)
    const xOffset = (canvas.width - width) / 2

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, xOffset, 0, width, canvas.height)
  }
}

function handleKeyboardInputs () {
  if (isKeyDownRight) {
    isPlayingForward = true
  } 
  if (isKeyDownLeft) {
    isPlayingBackward = true
  }
  if (!isKeyDownRight) {
    isPlayingForward = false
  }
  if (!isKeyDownLeft) {
    isPlayingBackward = false
  }
}

// Combined game loop for animation and input polling
function gameLoop() {
  // Poll gamepad input
  if (gamepadIndex !== null) {
    const gamepad = navigator.getGamepads()[gamepadIndex]
    if (gamepad) { 
      const rightButton = gamepad.buttons[RIGHT_BTN_VAL] // Right arrow button
      const leftButton = gamepad.buttons[LEFT_BTN_VAL] // Left arrow button
      
      const rightButtonPressed = rightButton?.pressed
      const leftButtonPressed = leftButton?.pressed

      // Axis support for Left/Right
      const xAxis = gamepad.axes[0] // Left/Right axis
      const rightAxisPressed = xAxis > 0.5
      const leftAxisPressed = xAxis < -0.5
      // console.log(xAxis)
      const rightButtonDown = (rightAxisPressed || rightButtonPressed) && !previousButtonStates[RIGHT_BTN_VAL]
      const leftButtonDown = (leftAxisPressed || leftButtonPressed) && !previousButtonStates[LEFT_BTN_VAL]
      const rightButtonUp = (!rightAxisPressed && !rightButtonPressed) && previousButtonStates[RIGHT_BTN_VAL]
      const leftButtonUp = (!leftAxisPressed && !leftButtonPressed) && previousButtonStates[LEFT_BTN_VAL]

      if (rightButtonDown) {
        isPlayingForward = true
      } 
      if (leftButtonDown) {
        isPlayingBackward = true
      }
      if (rightButtonUp) {
        isPlayingForward = false
      }
      if (leftButtonUp) {
        isPlayingBackward = false
      }

      // Store button states for the next frame
      previousButtonStates[RIGHT_BTN_VAL] = (rightAxisPressed || rightButtonPressed)
      previousButtonStates[LEFT_BTN_VAL] = (leftAxisPressed || leftButtonPressed)
    }
  } else {
    handleKeyboardInputs()
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
  const loadingText = document.querySelector(".loading-text")
  loadingText.style.display = 'none'
  requestAnimationFrame(gameLoop)
})

function handleKeyDown(event) {
  if (event.key === "ArrowRight") {
    isKeyDownRight = true
  } else if (event.key === "ArrowLeft") {
    isKeyDownLeft = true
  }
}

function handleKeyUp(event) {
  if (event.key === "ArrowRight") {
    isKeyDownRight = false
  } else if (event.key === "ArrowLeft") {
    isKeyDownLeft = false
  }
}
window.addEventListener("keydown", handleKeyDown)
window.addEventListener("keyup", handleKeyUp)