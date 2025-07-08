import { getSecurityQuestion } from "../lib/firebase.js"; // Firebase se data lene ke liye

document.addEventListener("DOMContentLoaded", () => {
    const himanshu = document.getElementById("himanshu");
    const pragati = document.getElementById("pragati");
    const popup = document.getElementById("popup");
    const questionText = document.getElementById("question");
    const answerInput = document.getElementById("answer");
    const submitButton = document.getElementById("submit");
    const closeButton = document.getElementById("close");
    const errorText = document.getElementById("error");
    const profilePic = document.getElementById("popup-profile-pic");

    let selectedUser = "";
    let correctAnswer = "";

    async function openPopup(userId) {
        selectedUser = userId;
        const data = await getSecurityQuestion(userId);

        if (data) {
            questionText.textContent = data.question;
            correctAnswer = data.answer.toLowerCase();
            answerInput.value = "";
            errorText.style.display = "none";

            // ✅ Profile Picture Set Karna
            profilePic.src = `${userId}.jpg`;

            // ✅ Pop-up Dikhana Aur Blur Effect Lagana
            popup.style.display = "block";
            document.body.classList.add("popup-active");
        } else {
            alert("No security question found!");
        }
    }

    himanshu.addEventListener("click", () => openPopup("himanshu"));
    pragati.addEventListener("click", () => openPopup("pragati"));

    submitButton.addEventListener("click", () => {
        if (answerInput.value.trim().toLowerCase() === correctAnswer) {
            window.location.href = `../chatroom/chatroom.html?user=${selectedUser}`;
        } else {
            errorText.style.display = "block";
            errorText.textContent = "Wrong answer!";
            popup.classList.add("shake");
            setTimeout(() => popup.classList.remove("shake"), 500);
        }
    });

    closeButton.addEventListener("click", () => {
        popup.style.display = "none";
        document.body.classList.remove("popup-active"); // ✅ Blur Effect Remove Karna
    });
});
