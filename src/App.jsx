import React, {Component} from 'react';
import ChatBar from "./ChatBar.jsx";
import MessageList from "./MessageList.jsx";

class App extends Component {
  constructor (props) {
    super(props);
    this.socket = new WebSocket('ws://localhost:3001');
    this.state = {
      currentUser: {name: "Anonymous"},
      messages: [], // messages coming from the server will be stored here as they arrive
      usersCount: 0,
    }
    this.clearChat = this.clearChat.bind(this);
  }

componentDidMount() {
  this.socket.onopen = function (event) {
    console.log('Connected to server');
  };

  // To handle user count and incoming messages
  this.socket.onmessage = (event) => {
    if (event.data == parseInt(event.data)) {
      this.setState({ usersCount: event.data });
    } else {
      const data = JSON.parse(event.data);
    this.setState({ messages: this.state.messages.concat(data.message)});
    }
  }
}

addName = (event) => {
  const oldusername = this.state.currentUser.name;

  if (event.key === 'Enter') {
    this.setState({currentUser: {name: event.target.value}});
    let msg = {
      type: "postNotification",
      oldusername: oldusername,
      newusername: event.target.value
    };
    this.sendMessageToServer({ message: msg });
  }
}

// Sends message as a JSON-formatted string.
sendMessageToServer = (msg) => {
  this.socket.send(JSON.stringify(msg));
}

addMessage = (event) => {
    if(event.key === 'Enter'){
      const msg = {
        type: 'postMessage',
        username: this.state.currentUser.name,
        content: event.target.value
      };
      this.sendMessageToServer({message: msg});
    }
  }

  clearChat(){
    this.setState({ messages: [] })
  }

    // Passes the states and props to children
  render() {
    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty Channel</a>
          
            <span className="navbar-usersCount">{this.state.usersCount} users online</span>
            <i className="fas fa-trash-alt navbar-brand" onClick={this.clearChat}></i>
        </nav>
        <MessageList messages={this.state.messages} />
        <ChatBar currentUser={this.state.currentUser} 
                addMessage={this.addMessage}
                addName={this.addName} 
                 />
      </div>
    );
  }
}
export default App;