const socket = io();
const userListContainer = document.querySelector(".inbox__people");

let currentUserName = "";

// Get the username in the URL
const urlParams = new URLSearchParams(window.location.search);
const userNameParam = urlParams.get("username");
currentUserName = userNameParam || "Guest";

let userConnected = false;
let isTyping = false;


// Connecting new users
const connectNewUser = () => {
    socket.emit("new user", currentUserName);
    userConnected = true;
};


const addUserToUserList = (userName) => {
    const userElement = document.querySelector(`[data-username="${userName}"]`);
    if (!userElement) {
        // Adding users to the list
        const userBoxHTML = `
        <div class="chat_user" data-username="${userName}">
            <h5>${userName}</h5>
        </div>
        `;
        userListContainer.innerHTML += userBoxHTML;
        console.log(`Added user to list: ${userName}`);
    } else {
        console.log(`User already in list: ${userName}`);
    }
};


// The connectNewUser function is called when the user logs in.
connectNewUser();

socket.on("new user", (data) => {
  console.log("New user event received:", data);
  data.forEach((user) => {
    if (!document.querySelector(`[data-username="${user}"]`)) {
      addUserToUserList(user);
    }
  });
});

socket.on("user connected", (data) => {
    console.log("User connected:", data);
    data.forEach((username) => {
        addUserToUserList(username);
        console.log(`${username} connected.`);
    });
});


socket.on("user disconnected", (data) => {
    const userElement = document.querySelector(`[data-username="${data}"]`);
    if (userElement) {
        userElement.remove();
    }
});


// Functions that handle receiving and displaying messages
const messageInputField = document.querySelector(".message_form__input");
const messageForm = document.querySelector(".message_form");
const messageHistory = document.querySelector(".messages__history");

const addNewMessage = ({ username, message }) => {
    const time = new Date();
    const formattedTime = time.toLocaleString("en-US", { hour: "numeric", minute: "numeric" });

    const receivedMsgHTML = `
    <div class="incoming__message">
        <div class="received__message">
            <p>${message}</p>
            <div class="message__info">
                <span class="message__author">${username}</span>
                <span class="time_date">${formattedTime}</span>
            </div>
        </div>
    </div>`;

    const myMsgHTML = `
    <div class="outgoing__message">
        <div class="sent__message">
            <p>${message}</p>
            <div class="message__info">
                <span class="message__author">${username}</span>
                <span class="time_date">${formattedTime}</span>
            </div>
        </div>
    </div>`;

    messageHistory.innerHTML += username === currentUserName ? myMsgHTML : receivedMsgHTML;

    // Scroll to the bottom of the message history
    messageHistory.scrollTop = messageHistory.scrollHeight;

};

messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!messageInputField.value) {
        return;
    }

    socket.emit("chat message", {
        message: messageInputField.value,
        username: currentUserName,
    });

    messageInputField.value = "";
});

socket.on("chat message", (data) => {
    addNewMessage({ username: data.username, message: data.message });
});

socket.on("system message", (message) => {
    const systemMessageHTML = `
    <div class="system__message">
        <p>${message}</p>
    </div>`;

    messageHistory.innerHTML += systemMessageHTML;
});

messageInputField.addEventListener("input", () => {
    isTyping = true;
    sendTypingStatus();
});

// Use a timer to detect when the user stops input
let typingTimer;
messageInputField.addEventListener("input", () => {
    isTyping = true;
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
        isTyping = false;
        sendTypingStatus();
    }, 2000); // If there is no input within 2 seconds, the input is considered to be stopped.
});

// Send "typing" event
const sendTypingStatus = () => {
    if (isTyping) {
        socket.emit("typing", currentUserName);
    } else {
        socket.emit("stop typing", currentUserName);
    }
};


socket.on("user typing", (username) => {
  // To display the "so-and-so is typing" prompt
  const typingIndicator = document.querySelector(".typing-indicator");
  typingIndicator.textContent = `${username} is typing...`;
});

socket.on("user stop typing", (username) => {
  // Hide the "so-and-so is typing" message.
  const typingIndicator = document.querySelector(".typing-indicator");
  typingIndicator.textContent = "";
});

