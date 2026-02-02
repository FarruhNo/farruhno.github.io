// Note: To make this functional, you'd paste your Firebase config here
const chatBox = document.getElementById('chat-box');
const messageForm = document.getElementById('message-form');
const userInput = document.getElementById('user-input');

// 1. Function to add a message to the screen
function displayMessage(text, isMine) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message');
    if (isMine) msgDiv.classList.add('mine');
    msgDiv.textContent = text;
    chatBox.appendChild(msgDiv);
    
    // Auto-scroll to bottom
    chatBox.scrollTop = chatBox.scrollHeight;
}

// 2. Handle Form Submission
messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = userInput.value;

    // Display locally
    displayMessage(message, true);

    // TODO: Send 'message' to your Database/Socket here!
    
    userInput.value = '';
});

/* REAL-TIME LOGIC: 
   In a real app, you would use a listener like:
   db.on('child_added', (snapshot) => {
       const data = snapshot.val();
       displayMessage(data.text, false);
   });
*/