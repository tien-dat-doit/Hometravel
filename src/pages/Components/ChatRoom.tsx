import React, { useState, useEffect } from 'react';
import { db } from '../../notification/firebase';
import {
    collection,
    addDoc,
    where,
    serverTimestamp,
    onSnapshot,
    query,
    orderBy,
    getDocs,
} from 'firebase/firestore';
import '../../styles/chat.css';
import useAuth from '../../hook/useAuth';

export const Chat = ({ room, setIsInChat }: any) => {
    const [messages, setMessages] = useState<any>([]);
    const [newMessage, setNewMessage] = useState('');
    const listUserCanChatWith = collection(db, '/userChat/fe502dcd-9b1a-4f67-9728-8a035c4fd531/withUser');
    const messagesRef = collection(db, '/messages/fe502dcd-9b1a-4f67-9728-8a035c4fd531/withUser/45f06e60-a18e-4647-a8b0-a9be1efcbb1b/message');
    const messagesRef2 = collection(db, '/messages/45f06e60-a18e-4647-a8b0-a9be1efcbb1b/withUser/fe502dcd-9b1a-4f67-9728-8a035c4fd531/message');
    const { auth }: any = useAuth();

    useEffect(() => {
        const getMessage = async () => {
            const q = query(messagesRef);
            const q2 = query(messagesRef2);
            const q3 = query(listUserCanChatWith);
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              console.log(doc.id, "1, => ", doc.data());
            });
            const querySnapshot2 = await getDocs(q2);
            querySnapshot2.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              console.log(doc.id, "2, => ", doc.data());
            });
            const querySnapshot3 = await getDocs(q3);
            querySnapshot3.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              console.log(doc.id, "3, => ", doc.data());
            });
        }
      
        // const queryMessages = query(
        //     messagesRef,
        //     orderBy('createdAt'),
        // );
        // const unsuscribe = onSnapshot(queryMessages, (snapshot) => {
        //     let messages: any = [];
        //     console.log({snapshot});
        //     snapshot.forEach((doc) => {
        //         messages.push({ ...doc.data(), id: doc.id });
        //     });
        //     console.log(messages);
        //     setMessages(messages);
        // });

        //return () => unsuscribe();
        getMessage()
    }, []);

    const handleSubmit = async (event: any) => {
        event.preventDefault();

        if (newMessage === '') return;
        await addDoc(messagesRef, {
            text: newMessage,
            createdAt: serverTimestamp(),
            user: auth?.user?.fullName,
            room,
        });

        setNewMessage('');
    };

    return (
        <div className="chat-app">
            <div className="header">
                <h1>Welcome to: {room.toUpperCase()}</h1>
            </div>
            <div className="messages">
                {messages.map((message: any) => (
                    <div key={message.id} className="message">
                        <span className="user">{message.user}:</span>{' '}
                        {message.text}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit} className="new-message-form">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(event) => setNewMessage(event.target.value)}
                    className="new-message-input"
                    placeholder="Type your message here..."
                />
                <div style={{ display: 'flex' }}>
                    <button type="submit" className="send-button">
                        Send
                    </button>
                    <button
                        className="send-button"
                        style={{ marginLeft: '10px' }}
                        onClick={() => setIsInChat(false)}
                    >
                        Out
                    </button>
                </div>
            </form>
        </div>
    );
};
