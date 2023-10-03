const socket = io();
const userListContainer = document.querySelector(".inbox__people");

let currentUserName = "";

// 获取 URL 中的用户名
const urlParams = new URLSearchParams(window.location.search);
const userNameParam = urlParams.get("username");
currentUserName = userNameParam || "Guest";

let userConnected = false;

// 连接新用户
const connectNewUser = () => {
    socket.emit("new user", currentUserName);
    userConnected = true;
};


const addUserToUserList = (userName) => {
    const userElement = document.querySelector(`[data-username="${userName}"]`);
    if (!userElement) {
        // 添加用户到列表
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


// 在用户登录时调用 connectNewUser 函数
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


// 处理接收和显示消息的功能
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