import { useEffect, useState } from 'react';
import { firestore } from '../../src/firebase/config.js';
import jwtDecode from 'jwt-decode';

export const useChat = (receiver) => {
    let sender = 1
    // let receiver = 3
    // let userId = 1
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const unsubscribe = firestore.collection('messages')
            .where('sender', 'in', [sender, receiver])
            .where('receiver', 'in', [sender, receiver])
            .orderBy('dateCreated', 'asc')
            .onSnapshot((snapshot) => {
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setMessages(data);
            });

        return () => {
            unsubscribe();
        };
    }, [receiver]);
    return messages;

}

export const useUser = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const unsubscribe = firestore.collection('users')
            .onSnapshot((snapshot) => {
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setUsers(data);
            });

        return () => {
            unsubscribe();
        };
    }, []);

    const uniqueUsers = users.filter((user, index) => {
        return users.findIndex(u => u.id === user.id) === index;
    });

    return uniqueUsers;
}

export const sendMessage = (sender, receiver, message) => {
    firestore.collection('messages').add({
        sender: parseInt(sender),
        receiver: receiver,
        dateCreated: new Date().toLocaleString(),
        message: message,
    });
};