# CHATUS Application

This is an example of a real-time chat application built using Express and Socket.IO. The application allows users to join a chat room, send messages, and view messages from other users in real-time.

# Features
*User Connection: Users can enter a username and join the chat room.

*Real-Time Messaging: Users can send and receive real-time chat messages.

*Typing Indicator: When a user starts typing a message, other users will see a typing indicator.

*User Disconnection: When a user leaves the chat room, other users are notified.

# Installation

Clone or download the project 

If you do not have the runtime environment installed, please enter:
  
    npm init -y

    npm install express

    npm install socket.io

# Start the server

Now its time to test the application: return to the terminal and enter the following command:

    cd ca4
    
    node index.js

## Join the Chat

Open a web browser 
Enter your desired username in the input field and click the "Join" button.
You will be added to the chat room, and you can start sending and receiving messages.

## Sending Messages

To send a message, type your message in the input field at the bottom of the chat interface and press Enter.
Your message will be broadcast to all users in the chat room in real-time.

## Typing Indicator
When you start typing a message, other users in the chat room will see a "typing" indicator next to your username.
The indicator will disappear when you stop typing.

## Leaving the Chat
To leave the chat room, simply close the browser window or navigate away from the application.
Other users will be notified when you leave the chat room.

## Customize and Extend
You can customize and extend this chat application to meet your specific requirements. The client-side code can be found in client.js, and the server-side code is in index.js.

## License
This project is licensed under the MIT License. Feel free to use and modify it as needed.

## Acknowledgments
Special thanks to Express and Socket.IO for making real-time chat applications like this one possible.

