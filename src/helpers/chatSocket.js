import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let stompClient = null;

export const connect = (token, onMessageReceived, onConnectSuccess) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const socketUrl = `${API_BASE_URL}/ws?token=${token}`;

    stompClient = new Client({
        webSocketFactory: () => new SockJS(socketUrl),
        debug: (str) => {
            console.log(str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = (frame) => {
        console.log('STOMP Connected: ', frame);
        if (onConnectSuccess) onConnectSuccess();
        
        console.log('Subscribing to /user/queue/messages...');
        stompClient.subscribe('/user/queue/messages', (message) => {
            console.log('Received raw message from WS:', message.body);
            try {
                const parsed = JSON.parse(message.body);
                onMessageReceived?.(parsed);
            } catch (error) {
                console.error('Error parsing WS message body:', error);
            }
        });
    };

    stompClient.onStompError = (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
    };

    stompClient.onWebSocketClose = (evt) => {
        console.warn('WebSocket closed:', evt);
    };

    stompClient.onWebSocketError = (evt) => {
        console.error('WebSocket error:', evt);
    };

    stompClient.activate();
};

export const disconnect = () => {
    if (stompClient !== null) {
        stompClient.deactivate();
        console.log("Disconnected");
    }
};

export const sendMessage = (destination, message) => {
    console.log(`Sending message to ${destination}:`, message);
    if (stompClient && stompClient.connected) {
        stompClient.publish({
            destination: destination,
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(message),
        });
        console.log('Message published successfully');
    } else {
        console.error("Cannot send message, not connected. stompClient:", stompClient, "connected:", stompClient?.connected);
    }
};

export const subscribeToMessages = (callback) => {
    if (stompClient && stompClient.connected) {
        return stompClient.subscribe('/user/queue/messages', (message) => {
            try {
                callback(JSON.parse(message.body));
            } catch (error) {
                console.error('Error parsing WS message body:', error);
            }
        });
    }
    return null;
};
