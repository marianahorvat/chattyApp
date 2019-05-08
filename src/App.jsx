import React, {Component} from 'react';
import ChatBar from "./ChatBar.jsx";
import MessageList from "./MessageList.jsx";

class App extends Component {
  constructor (props) {
    super(props);
    this.socket = new WebSocket('ws://localhost:3001');
    this.state = {
      currentUser: {name: "Bob"}, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: [],
      //   {
      //     id: 1,
      //     username: "Bob",
      //     content: "Has anyone seen my marbles?",
      //   },
      //   {
      //     id: 2,
      //     username: "Anonymous",
      //     content: "No, I think you lost them. You lost your marbles Bob. You lost them for good."
      //   }
      // ]
    }
  }

  // in App.jsx
componentDidMount() {
  console.log("componentDidMount <App />");
  // const socket = new WebSocket("ws://localhost:3001/");
  this.socket.onopen = function (event) {
    console.log('Connected to server');
  };

  this.socket.onmessage = (event) => {
    console.log("The event onmessage data is: ", event.data);
    // code to handle incoming message
    this.setState({ messages: this.state.messages.concat(JSON.parse(event.data).message)});
    console.log("Current state is", this.state.messages);
  }
}

addName = (event) => {
  let newName = event.target.value
  this.setState({currentUser: {name:newName}})
}

// Send msg object as a JSON-formatted string.
sendMessageToServer = (msg) => {
  this.socket.send(JSON.stringify(msg));
  // console.log("JSON.stringify(msg) is: ", JSON.stringify(msg));
}

addMessage = (event) => {
    if(event.key === 'Enter'){

      let msg = {
        type: 'sendMessage',
        username: this.state.currentUser.name,
        content: event.target.value
      };
      this.sendMessageToServer({message: msg});
      console.log("msg is: ", msg);
    }
  }

  render() {
    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>
        </nav>
        <MessageList messages={this.state.messages} />
        <ChatBar currentUser={this.state.currentUser} 
                addMessage={this.addMessage}
                addName={this.addName} />
      </div>
    );
  }
}
export default App;
