const canvas = document.getElementById("paintCanvas");
const ctx = canvas.getContext("2d");
const colorPicker = document.getElementById("colorPicker");
const brushSize = document.getElementById("brushSize");

// Create an off-screen canvas
const offScreenCanvas = document.createElement("canvas");
offScreenCanvas.width = canvas.width;
offScreenCanvas.height = canvas.height;
const offScreenCtx = offScreenCanvas.getContext("2d");

let painting = false;
let startX, startY;

function startPosition(e) {
    painting = true;
    startX = e.clientX - canvas.offsetLeft;
    startY = e.clientY - canvas.offsetTop;
    if (currentTool === "brush" || currentTool === "eraser") {
        draw(e);
    }
}

function endPosition() {
    painting = false;
    ctx.beginPath();  // Stops the stroke
    // Save the current state to the off-screen canvas
    offScreenCtx.drawImage(canvas, 0, 0);
}

function draw(e) {
    if (!painting) return;

    ctx.lineWidth = brushSize.value;
    ctx.lineCap = "round";
    ctx.strokeStyle = colorPicker.value;
    ctx.fillStyle = colorPicker.value;

    // Clear the canvas and redraw the off-screen canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(offScreenCanvas, 0, 0);

    if (currentTool === "brush") {
        ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop, brushSize.value / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    } else if (currentTool === "eraser") {
        ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    } else if (currentTool === "rectangle") {
        const width = e.clientX - canvas.offsetLeft - startX;
        const height = e.clientY - canvas.offsetTop - startY;
        ctx.strokeRect(startX, startY, width, height);
    } else if (currentTool === "circle") {
        const radius = Math.sqrt(Math.pow(e.clientX - canvas.offsetLeft - startX, 2) + Math.pow(e.clientY - canvas.offsetTop - startY, 2));
        ctx.beginPath();
        ctx.arc(startX, startY, radius, 0, Math.PI * 2);
        ctx.stroke();
    } else if (currentTool === "line") {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        ctx.stroke();
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    offScreenCtx.clearRect(0, 0, offScreenCanvas.width, offScreenCanvas.height);
}

const saveImageButton = document.getElementById("saveImage");

saveImageButton.addEventListener("click", () => {
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "canvas_image.png";
    link.click();
});

const brushButton = document.getElementById("brush");
const rectangleButton = document.getElementById("rectangle");
const circleButton = document.getElementById("circle");
const lineButton = document.getElementById("line");
const eraserButton = document.getElementById("eraser");

let currentTool = "brush";

brushButton.addEventListener("click", () => {
    currentTool = "brush";
    ctx.globalCompositeOperation = "source-over";
});

rectangleButton.addEventListener("click", () => {
    currentTool = "rectangle";
    ctx.globalCompositeOperation = "source-over";
});

circleButton.addEventListener("click", () => {
    currentTool = "circle";
    ctx.globalCompositeOperation = "source-over";
});

lineButton.addEventListener("click", () => {
    currentTool = "line";
    ctx.globalCompositeOperation = "source-over";
});

eraserButton.addEventListener("click", () => {
    currentTool = "eraser";
    ctx.globalCompositeOperation = "destination-out";
});

// Event listeners
canvas.addEventListener("mousedown", startPosition);
canvas.addEventListener("mouseup", endPosition);
canvas.addEventListener("mousemove", draw);

