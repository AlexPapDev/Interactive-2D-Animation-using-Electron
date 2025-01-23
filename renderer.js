const canvas = document.getElementById('animationCanvas')
const ctx = canvas.getContext('2d')
ELECTRON_ENABLE_LOGGING=1

const FRAME_COUNT = 49 // Number of frames
const FRAME_RATE = 24 // Frames per second
const frames = []
let currentFrame = 0
let isPlayingForward = false
let isPlayingBackward = false

// Preload frames
for (let i = 0 i < FRAME_COUNT i++) {
  const img = new Image()
  img.src = `assets/frames/frame_${String(i).padStart(4, '0')}.png` // Adjust the path and format
  frames.push(img)
}

// Draw a specific frame
function drawFrame(frameIndex) {
  const img = frames[frameIndex]
  if (img.complete) {
    ctx.clearRect(0, 0, 2000, 2000)
    ctx.drawImage(img, 0, 0, 800, 800)
  }
}

// Animation loop
function playAnimation() {
  console.log(currentFrame, FRAME_COUNT, (currentFrame % (FRAME_COUNT - 1)))
  if (isPlayingForward && currentFrame <= FRAME_COUNT - 1) {
    currentFrame = (currentFrame % (FRAME_COUNT - 1)) + 1
    // console.log(currentFrame)
    drawFrame(currentFrame)
  } else if (isPlayingBackward && currentFrame > 0) {
    currentFrame--
    drawFrame(currentFrame)
  }

  setTimeout(() => requestAnimationFrame(playAnimation), 1000 / FRAME_RATE)
}

// Event listeners for controls
document.getElementById('forward').addEventListener('mousedown', () => {
  isPlayingForward = true
})
document.getElementById('forward').addEventListener('mouseup', () => {
  isPlayingForward = false
})

document.getElementById('backward').addEventListener('mousedown', () => {
  isPlayingBackward = true
})
document.getElementById('backward').addEventListener('mouseup', () => {
  isPlayingBackward = false
})


// Start animation loop
playAnimation()
