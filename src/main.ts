import { connectToServer, disconnectToServer, statusInitial } from './socket-client'
import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h2>Websocket - Client</h2>
    <span id="serverStatus">Offline</span>
    <br/>
    <input id="jwt-token" type="text" placeholder="Json Web Token" />
    <br/>
    <span id="token-error" style="color: red;"></span>
    <br/>
    <button id="btn-connect">Connect</button>
    <button id="btn-disconnect">Disconnect</button>
    

    <ul id="clientId"></ul>
    
    <h3>Messages</h3>
    <ul id="messages-ul"></ul>

    <form id="message-form">
        <input type="text" placeholder="message" id="message-input" />
    </form>
    <span id="message-error" style="color: red;"></span>

    <br/>
    



  </div>
`
// connectToServer();
statusInitial();

const jwtToken = document.querySelector<HTMLInputElement>('#jwt-token')!;
const btnConnect = document.querySelector<HTMLButtonElement>('#btn-connect')!;
const btnDisconnect = document.querySelector<HTMLButtonElement>('#btn-disconnect')!;

btnConnect.addEventListener('click', () => {
  if(jwtToken.value.trim().length <= 0) return alert('Please enter a valid Json Web Token');
    connectToServer(jwtToken.value);
});

btnDisconnect.addEventListener('click', () => {
    disconnectToServer();
} );