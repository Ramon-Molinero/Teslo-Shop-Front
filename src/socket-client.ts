import { Manager, Socket } from "socket.io-client"

let socket: Socket;
let statusClient: 'Online' | 'Offline' = 'Offline';


/**
  * @author R.M
  * @version 1.0
  * 
  * @method getElement
  *
  * @description
  * Obtiene un elemento del DOM utilizando un selector CSS, asegurando que el tipo devuelto corresponda al especificado por el genérico `T`.
  *
  * @param {string} selector - Selector CSS para encontrar el elemento.
  * @returns {T} - Elemento del DOM encontrado, asegurando el tipo especificado.
  * 
  * @throws {TypeError} Si el elemento no se encuentra, lanza un error al usar `!`.
  */
const getElement = <T extends HTMLElement>(selector: string): T => {
    return document.querySelector<T>(selector)!;
};


/**
  * @author R.M
  * @version 1.0
  * 
  * @namespace element
  * 
  * @description
  * Contiene funciones para obtener referencias específicas de elementos del DOM utilizados en la aplicación.
  */
const element = {
    serverStatusLabel: () => {
        return getElement<HTMLSpanElement>('#serverStatus')!
    },
    clientUl: () => {
        return getElement<HTMLUListElement>('#clientId')!
    },
    messageForm: () => {
        return getElement<HTMLFormElement>('#message-form')!
    },
    messageInput: () => {
        return getElement<HTMLInputElement>('#message-input')!
    },
    messagesUl: () => {
        return getElement<HTMLUListElement>('#messages-ul')!
    },
    messageError: () => {
        return getElement<HTMLSpanElement>('#message-error')!
    },
    tokenError: () => {
        return getElement<HTMLSpanElement>('#token-error')!
    },
    jwtToken: () => {
        return getElement<HTMLInputElement>('#jwt-token')!
    },
    btnConnect: () => {
        return getElement<HTMLButtonElement>('#btn-connect')!
    },
    btnDisconnect: () => {
        return getElement<HTMLButtonElement>('#btn-disconnect')!
    }
    
}


/**
  * @author R.M
  * @version 1.0
  * 
  * @method connectToServer
  *
  * @description
  * Establece una conexión con el servidor WebSocket utilizando el token JWT proporcionado.
  *
  * @param {string} jwtToken - Token JWT para la autenticación.
  *
  * @throws {Error} Si ocurre un error al intentar conectar.
  */
export const connectToServer = (jwtToken: string) => {

    try {

        //! Desconecta el WebSocket si ya existe una conexión. Esto no permite tener más de una conexión activa por usuario.
        // if (socket) {
        //     socket.disconnect();
        // }

        const manager = new Manager('https://teslo-shop-nest-iv2l.onrender.com/socket.io/socket.io.js', {
            
            extraHeaders: {
                Authorization: jwtToken,
            }
        });

        socket?.removeAllListeners();
        socket = manager.socket('/');


        addListeners();


    } catch (error) {
        console.error('Error connecting to server:', error);
    }
    
}


/**
  * @author R.M
  * @version 1.0
  * 
  * @method disconnectToServer
  *
  * @description
  * Desconecta el WebSocket del servidor y restablece los valores de la interfaz.
  */
export const disconnectToServer = () => {

    //! Desconecta el WebSocket si ya existe una conexión. Esto no permite tener más de una conexión activa por usuario.
    if (socket) {
         try {
            socket.disconnect();
            element.jwtToken().value = '';

        } catch (error) {
            console.error('Error disconnecting from server:', error);
        }
        
    }
    resetValues();
    tokenErrorMessage('hidden');

    
    
}


/**
  * @author R.M
  * @version 1.0
  * 
  * @method statusInitial
  *
  * @description
  * Configura el estado inicial de la interfaz y agrega un evento de escucha al formulario de mensajes.
  */
export const statusInitial = () => {
    
    disbledButtons('Offline');
    element.messageForm().addEventListener('submit', (event) => {
        event.preventDefault();
        const inputValue = element.messageInput().value.trim();

        if ( statusClient === 'Offline' && inputValue) {
            statusLabelAndClient('Offline');
            errMessage('visible');
            element.messageInput().value = '';

        }else{
            statusLabelAndClient('Online');
            disbledButtons('Online');
        }

    });


}


/**
  * @author R.M
  * @version 1.0
  * 
  * @method addListeners
  *
  * @description
  * Configura los eventos de escucha para el socket, manejando la conexión, desconexión, actualización de clientes y recepción de mensajes.
  */
const addListeners = () => {
    
    socket.on('connect', () => {
        statusLabelAndClient('Online');
        tokenErrorMessage('hidden');
        disbledButtons('Online');
        
    });

    socket.on('disconnect', () => {
        statusLabelAndClient('Offline');
        disbledButtons('Offline');
        errMessage('hidden');
        tokenErrorMessage('visible');
        resetValues();

    });


    socket.on('clients-updated', (clients: string[]) => {
        let clientsList = '';

        clients.forEach(client => {
            clientsList += `<li>${client}</li>`;
        });

        element.clientUl().innerHTML = clientsList;
    });


    element.messageForm().addEventListener('submit', (event) => {

        event.preventDefault(); // evita el envío del formulario
    
        if ( statusClient === 'Offline' || element.messageInput().value.trim().length <= 0) return;

        if(statusClient === 'Online'){
            socket.emit('message-form-client', { 
                id: socket.id, 
                message: element.messageInput().value 
            });

            element.messageInput().value = '';

        }

    });


    socket.on('message-from-server', ( payload: { fullName: string, message: string }) => {
        
        const messageLi = document.createElement('li');
        messageLi.innerHTML = `<b>${payload.fullName}</b>: ${payload.message}`;
        element.messagesUl().appendChild(messageLi);
        
    })

}


/**
  * @author R.M
  * @version 1.0
  * 
  * @method resetValues
  *
  * @description
  * Restablece los valores iniciales de los elementos de la interfaz.
  */
const resetValues = () => {
    element.clientUl().innerHTML = '';
    element.messagesUl().innerHTML = ''; 
    statusLabelAndClient('Offline');
    errMessage('hidden');
    

}


/**
  * @author R.M
  * @version 1.0
  * 
  * @method errMessage
  *
  * @description
  * Muestra u oculta el mensaje de error en función de la visibilidad.
  *
  * @param {'hidden' | 'visible'} visibility - Estado de visibilidad del mensaje.
  */
const errMessage = (visibility: 'hidden' | 'visible') => {
    if(visibility === 'hidden'){
        element.messageError().style.visibility = 'hidden';
        element.messageError().textContent = '';
    }else{
        element.messageError().style.visibility = 'visible';
        element.messageError().textContent = "You are offline. Connect to send messages.";
    }

}


/**
  * @author R.M
  * @version 1.0
  * 
  * @method tokenErrorMessage
  *
  * @description
  * Muestra u oculta el mensaje de error relacionado con el token JWT.
  *
  * @param {'hidden' | 'visible'} visibility - Estado de visibilidad del mensaje.
  */
const tokenErrorMessage = (visibility: 'hidden' | 'visible') => {
    if(visibility === 'hidden'){
        element.tokenError().style.visibility = 'hidden';
        element.tokenError().textContent = '';
    }else{
        element.tokenError().style.visibility = 'visible';
        element.tokenError().textContent = "Invalid Json Web Token";
    }
}


/**
  * @author R.M
  * @version 1.0
  * 
  * @method statusLabelAndClient
  *
  * @description
  * Actualiza el estado del servidor y el cliente en la interfaz.
  *
  * @param {'Online' | 'Offline'} status - Estado del cliente y del servidor.
  */
const statusLabelAndClient = (status: 'Online' | 'Offline') => {
    statusClient = status;
    element.serverStatusLabel().textContent = status;
    element.serverStatusLabel().style.color = status === 'Online' ? 'green' : 'red';
    
}


/**
  * @author R.M
  * @version 1.0
  * 
  * @method disbledButtons
  *
  * @description
  * Habilita o deshabilita los botones de conexión y desconexión según el estado del cliente.
  *
  * @param {'Online' | 'Offline'} status - Estado del cliente.
  */
const disbledButtons = (status: 'Online' | 'Offline') => {
    if(status === 'Online'){
        element.btnConnect().disabled = true;
        element.btnDisconnect().disabled = false;
    }
    if(status === 'Offline'){
        element.btnConnect().disabled = false;
        element.btnDisconnect().disabled = true;
    }
}
