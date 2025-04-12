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

//for community group
document.addEventListener("DOMContentLoaded", function () {
    const communityBtn = document.getElementById("community-btn");
    const communityPopup = document.getElementById("community-popup");
    const closePopup = document.getElementById("close-popup");

    if (communityBtn && communityPopup) {
        communityBtn.addEventListener("click", function (event) {
            event.preventDefault();  // prevent default anchor behavior
            communityPopup.style.display = "flex";  // show chat
            // call scrollToBottOm after opening the chat
            setTimeout(scrollToBottom, 100);
        });
    }

    if (closePopup) {
        closePopup.addEventListener("click", function () {
            communityPopup.style.display = "none";
        });
    }

     // ✅ Send message when pressing Enter key
     if (messageInput && sendBtn) {
        messageInput.addEventListener("keypress", function (e) {
            if (e.key === "Enter" && !e.shiftKey) {  
                e.preventDefault();  // Prevent new line in input field
                sendBtn.click();  // Trigger send button click
            }
        });
    }
});


function scrollToBottom() {
    setTimeout(() => {
        let messagesContainer = document.getElementById(
            "chat-content-messages"
        );
        if (messagesContainer) {
            messagesContainer.style.overflowY = "auto"; // Ensure scrolling is allowed
            messagesContainer.scrollTop =
                messagesContainer.scrollHeight;
        }
    }, 300); // Delay to ensure messages load before scrolling
}

document.addEventListener("DOMContentLoaded", function () {
    scrollToBottom(); // Scroll when page loads

    // Detect new messages and scroll
    let messagesContainer = document.getElementById(
        "chat-content-messages"
    );
    if (messagesContainer) {
        const observer = new MutationObserver(scrollToBottom);
        observer.observe(messagesContainer, {
            childList: true,
            subtree: true,
        });
    }
});