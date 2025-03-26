// Smooth scrolling function
document.querySelectorAll('a[href^="#pick"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute("href")).scrollIntoView({
            behavior: "smooth",
            block: "start", // Scroll to the start of the target element
            inline: "start", // Scroll to the start of the target element
        });
    });
});

document.querySelectorAll('a[href^="#about"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute("href")).scrollIntoView({
            behavior: "smooth",
            block: "start", // Scroll to the start of the target element
            inline: "start", // Scroll to the start of the target element
        });
    });
});

document.querySelectorAll('a[href^="#contact"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute("href")).scrollIntoView({
            behavior: "smooth",
            block: "start", // Scroll to the start of the target element
            inline: "start", // Scroll to the start of the target element
        });
    });
});

document.querySelectorAll('a[href^="#home"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();

        document.querySelector("body").scrollIntoView({
            behavior: "smooth",
            block: "start", // Scroll to the start of the target element
            inline: "start", // Scroll to the start of the target element
        });
    });
});

//**********************************************//

// Start webcam streaming
function startWebcam() {
    const videoElement = document.getElementById("webcam");

    if (!videoElement) {
        console.error("Video element not found!");
        return;
    }

    navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
            videoElement.srcObject = stream;
        })
        .catch((err) => {
            console.error("Webcam access denied!", err);
        });
}

document.getElementById("start-webcam-button").addEventListener("click", () => {
    document.getElementById("cam-div").style = "display : block;";
    // document.getElementById("normal-div").style = "display : none;";
    document.getElementById("start-webcam-button").style = "display : none ;";
    document.getElementById("capture-webcam-button").style =
        "display : block ;";

    startWebcam();
});

// Capture image and display it on canvas
document
    .getElementById("capture-webcam-button")
    .addEventListener("click", function () {
        const video = document.getElementById("webcam");
        const canvas = document.getElementById("canvas");
        const context = canvas.getContext("2d");

        // Draw the video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas to base64 image data
        const imageData = canvas.toDataURL("image/png");

        // Set the hidden input value
        document.getElementById("imageData").value = imageData;
    });

// contact us setup

const modal = document.getElementById("modal");
const openModalBtn = document.getElementById("openModalBtn");
const cancelBtn = document.getElementById("cancelBtn");

openModalBtn.onclick = () => {
    modal.style.display = "block";
};

cancelBtn.onclick = () => {
    modal.style.display = "none";
};

window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
};

let detectLoaderDots = 1;

setInterval(() => {
    let detectNode = document.getElementById("loader-dots");
    detectNode.innerText = ".".repeat(detectLoaderDots);
    detectLoaderDots = (detectLoaderDots + 1) % 4;
}, 1000);
