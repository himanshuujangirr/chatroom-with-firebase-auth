import { db, addDoc, collection, serverTimestamp } from "../lib/firebase.js";
import { query, orderBy,onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";

// ✅ Login wale user ka data fetch karna
const urlParams = new URLSearchParams(window.location.search);
const loggedInUser = urlParams.get("user") || "Anonymous";  

const userData = {
    "himanshu": { name: "Himanshu", pic: "himanshu.jpg", chatWith: "Pragati", chatWithPic: "pragati.jpg" },
    "pragati": { name: "Pragati", pic: "pragati.jpg", chatWith: "Himanshu", chatWithPic: "himanshu.jpg" }
};

const currentUser = userData[loggedInUser] || { name: "Unknown", pic: "default.jpg", chatWith: "Unknown", chatWithPic: "default.jpg" };

// ✅ Profile pic & name position set karna
// ✅ Profile pic & name position set karna
document.getElementById("other-user-pic").src = currentUser.chatWithPic;
document.getElementById("other-user-name").innerText = currentUser.chatWith;

document.getElementById("current-user-pic").src = currentUser.pic;
// Login wale user ka naam hataya
document.getElementById("current-user-name").style.display = "none"; 

async function setUserActiveStatus(isActive) {
    const userDocRef = doc(db, "users", loggedInUser);
    try {
        await updateDoc(userDocRef, { active: isActive });
        console.log(`Status updated: ${isActive}`);
    } catch (error) {
        console.error("Error updating active status:", error);
    }
}

// ✅ On page visible (tab in focus)
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
        setUserActiveStatus(true);
    } else {
        setUserActiveStatus(false);
    }
});

// ✅ On focus (tab active)
window.addEventListener("focus", () => {
    setUserActiveStatus(true);
});

// ✅ On blur (tab inactive, switch tab or minimize)
window.addEventListener("blur", () => {
    setUserActiveStatus(false);
});

// ✅ Also on load — mark active
window.addEventListener("load", () => {
    setUserActiveStatus(true);
});

// ✅ On logout — mark inactive
document.getElementById("logout-btn").addEventListener("click", () => {
    setUserActiveStatus(false).then(() => {
        localStorage.removeItem("loggedInUser");
        window.location.href = "../index.html";
    });
});

// Function to check active/inactive status
function checkActiveStatus() {
    const userDocRef = doc(db, "users", loggedInUser);
    const chatWithDocRef = doc(db, "users", currentUser.chatWith.toLowerCase());

    // 🔁 Real-time check for logged-in user
    onSnapshot(userDocRef, (docSnap) => {
        const profileDiv = document.getElementById("user-info");
        if (docSnap.exists() && docSnap.data().active === true) {
            profileDiv.classList.add("user-active");
            profileDiv.classList.remove("user-inactive");
        } else {
            profileDiv.classList.add("user-inactive");
            profileDiv.classList.remove("user-active");
        }
    });

    // 🔁 Real-time check for other user (chat partner)
    onSnapshot(chatWithDocRef, (docSnap) => {
        const profileDiv = document.querySelector(".user-profile");
        const statusText = document.getElementById("user-status"); // ✅ Select the status text element

        if (docSnap.exists() && docSnap.data().active === true) {
            profileDiv.classList.add("user-active");
            profileDiv.classList.remove("user-inactive");
            statusText.innerText = "Online"; // ✅ Set status text to Online
            statusText.classList.add("online");
            statusText.classList.remove("offline");
        } else {
            profileDiv.classList.add("user-inactive");
            profileDiv.classList.remove("user-active");
            statusText.innerText = "Offline"; // ✅ Set status text to Offline
            statusText.classList.add("offline");
            statusText.classList.remove("online");
        }
    });
}

checkActiveStatus();


// ✅ Add click event to show logout popup
document.getElementById("user-info").addEventListener("click", () => {
    const popup = document.getElementById("logout-popup");
    popup.style.display = "flex"; // Display the logout popup
});

// ✅ Add click event to close the logout popup when Cancel button is clicked
document.getElementById("cancel-btn").addEventListener("click", () => {
    const popup = document.getElementById("logout-popup");
    popup.style.display = "none"; // Hide the logout popup
});

// ✅ Add click event to logout and redirect to login page when Logout button is clicked
document.getElementById("logout-btn").addEventListener("click", () => {
    // Clear any stored login data (if necessary)
    localStorage.removeItem("loggedInUser");

    // Redirect to login page
    window.location.href = "../index.html";  // Update the login page URL as needed
});

// ✅ Messages Load karna
const messagesContainer = document.getElementById("messages-container");
const messageInput = document.getElementById("message-input");
const chatForm = document.getElementById("chat-form");

function loadMessages() {
    const messagesRef = collection(db, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    onSnapshot(q, (snapshot) => {
        messagesContainer.innerHTML = "";  // Clear the message container
        snapshot.forEach((doc) => {
            displayMessage(doc.data());
        });

        messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to the bottom
    });
}

let lastDate = "";

function displayMessage(data) {
    const messageWrapper = document.createElement("div"); // Wrapper for message + timestamp
    messageWrapper.classList.add("message-wrapper");

    const messageElement = document.createElement("div");
    messageElement.classList.add("message");

    if (data.sender === loggedInUser) {
        messageElement.classList.add("sent");
        messageWrapper.classList.add("sent-wrapper"); // Right aligned
    } else {
        messageElement.classList.add("received");
        messageWrapper.classList.add("received-wrapper"); // Left aligned
    }

    const messageTime = data.timestamp?.toDate ? new Date(data.timestamp.toDate()) : new Date();
    const formattedTime = messageTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });

    const messageDate = messageTime.toISOString().split('T')[0]; // YYYY-MM-DD format

    // Insert date separator if it's a new date
    if (messageDate !== lastDate) {
        const separator = document.createElement("div");
        separator.classList.add("date-separator");
        separator.textContent = formatDateSeparator(messageTime);
        messagesContainer.appendChild(separator);
        lastDate = messageDate;
    }

    // Timestamp element
    const timestampElement = document.createElement("div");
    timestampElement.classList.add("timestamp");
    timestampElement.textContent = formattedTime;

    messageElement.innerHTML = `<div class="message-content">${data.text}</div>`;

    if (data.sender === loggedInUser) {
        messageWrapper.appendChild(timestampElement); // Time right side
        messageWrapper.appendChild(messageElement);
    } else {
        messageWrapper.appendChild(messageElement);
        messageWrapper.appendChild(timestampElement); // Time left side
    }

    messagesContainer.appendChild(messageWrapper);
}

// Function to format date separator
function formatDateSeparator(date) {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
        return "Yesterday";
    } else if (date > new Date(today.setDate(today.getDate() - 7))) {
        return date.toLocaleDateString(undefined, { weekday: 'long' }); // Monday, Tuesday...
    } else if (date.getFullYear() === today.getFullYear()) {
        return date.toLocaleDateString(undefined, { month: 'long', day: 'numeric' }); // March 12
    } else {
        return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }); // March 2024
    }
}


// ✅ Message Send karna
chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();  

    const messageText = messageInput.value.trim();
    if (messageText === "") return;

    await addDoc(collection(db, "messages"), {
        text: messageText,
        sender: loggedInUser,  
        timestamp: serverTimestamp()
    });

    messageInput.value = ""; // Clear the message input field
});

// Call the function to load messages
loadMessages();

// 🚀 Page Load: Show Photos & GIFs, Hide Send Button
window.onload = function () {
    document.getElementById("photo-button").classList.remove("hidden");
    document.getElementById("gif-button").classList.remove("hidden");
    document.getElementById("send-button").classList.add("hidden");
};

// 📝 Input Field Event Listener
messageInput.addEventListener("input", function () {
    if (messageInput.value.trim() === "") {
        // 👀 No Text: Show Photos & GIFs, Hide Send
        document.getElementById("photo-button").classList.remove("hidden");
        document.getElementById("gif-button").classList.remove("hidden");
        document.getElementById("send-button").classList.add("hidden");
    } else {
        // ✍️ Text Typed: Hide Photos & GIFs, Show Send
        document.getElementById("photo-button").classList.add("hidden");
        document.getElementById("gif-button").classList.add("hidden");
        document.getElementById("send-button").classList.remove("hidden");
    }
});

document.addEventListener("DOMContentLoaded", function() {
    // ✅ Elements
    const fileInput = document.getElementById("fileInput");
    const previewContainer = document.getElementById("preview-container");
    const previewFiles = document.getElementById("preview-files");
    const selectedMedia = document.getElementById("selected-media");
    const closePreview = document.getElementById("close-preview");
    const sendFiles = document.getElementById("send-files");
    const chatBox = document.querySelector(".chat-box");

    let selectedFiles = [];
    let currentIndex = 0;
    let currentVideoElement = null; // Track active video element

    // ✅ Open File Selector
    document.getElementById("photo-button").addEventListener("click", () => fileInput.click());

    // ✅ Handle File Selection
    fileInput.addEventListener("change", () => {
        const files = Array.from(fileInput.files);
        
        // Check file limit
        if (files.length > 5) {
            alert("Maximum 5 files allowed at once!");
            fileInput.value = "";
            return;
        }
        
        // Filter only images/videos
        selectedFiles = files.filter(file => 
            file.type.startsWith("image/") || file.type.startsWith("video/")
        );
        
        if (selectedFiles.length) {
            previewContainer.style.display = "block";
            chatBox.classList.add("blur-effect");
            currentIndex = 0;
            updatePreview();
        }
    });

    // ✅ Update Preview UI
    function updatePreview() {
        previewFiles.innerHTML = "";

        // Stop any currently playing video
        if (currentVideoElement) {
            currentVideoElement.pause();
            currentVideoElement = null;
        }

        // Update Big Preview
        if (selectedFiles.length) {
            const file = selectedFiles[currentIndex];
            const fileURL = URL.createObjectURL(file);
            
            // Clear previous content
            selectedMedia.innerHTML = '';
            
            if (file.type.startsWith("video")) {
                const video = document.createElement("video");
                video.src = fileURL;
                video.controls = true;
                video.autoplay = true;
                video.style.maxHeight = "40vh";
                video.style.maxWidth = "100%";
                video.style.borderRadius = "8px";
                video.style.display = "block";
                video.style.margin = "0 auto";
                selectedMedia.appendChild(video);
                currentVideoElement = video; // Track active video
            } else {
                const img = document.createElement("img");
                img.src = fileURL;
                img.style.maxHeight = "40vh";
                img.style.maxWidth = "100%";
                img.style.borderRadius = "8px";
                img.style.display = "block";
                img.style.margin = "0 auto";
                selectedMedia.appendChild(img);
            }
        }

        // Create Thumbnails
        selectedFiles.forEach((file, index) => {
            const fileURL = URL.createObjectURL(file);
            const isVideo = file.type.startsWith("video");
            const previewItem = document.createElement(isVideo ? "video" : "img");
            
            previewItem.src = fileURL;
            if (isVideo) {
                previewItem.muted = true;
                previewItem.autoplay = true;
                previewItem.loop = true;
                previewItem.playsInline = true;
            }
            
            previewItem.classList.add("preview-item");
            if (index === currentIndex) previewItem.classList.add("selected");

            // Click to Select
            previewItem.addEventListener("click", (e) => {
                e.preventDefault();
                currentIndex = index;
                updatePreview();
            });

            // Delete Button
            const deleteBtn = document.createElement("button");
            deleteBtn.className = "delete-btn";
            deleteBtn.innerHTML = `<img src="close.png" alt="X">`;
            deleteBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                selectedFiles.splice(index, 1);
                if (selectedFiles.length === 0) {
                    closePreview.click();
                } else {
                    if (currentIndex >= selectedFiles.length) currentIndex--;
                    updatePreview();
                }
            });

            const wrapper = document.createElement("div");
            wrapper.style.position = "relative";
            wrapper.appendChild(previewItem);
            wrapper.appendChild(deleteBtn);
            previewFiles.appendChild(wrapper);
        });
    }

    // ✅ Close Preview (Now properly stops videos)
    closePreview.addEventListener("click", () => {
        // Stop any playing video
        if (currentVideoElement) {
            currentVideoElement.pause();
            currentVideoElement = null;
        }
        
        // Revoke all object URLs to free memory
        selectedFiles.forEach(file => {
            URL.revokeObjectURL(file);
        });
        
        previewContainer.style.display = "none";
        chatBox.classList.remove("blur-effect");
        fileInput.value = "";
        selectedFiles = [];
        selectedMedia.innerHTML = ""; // Clear media container
    });

     closePreview.click();
});