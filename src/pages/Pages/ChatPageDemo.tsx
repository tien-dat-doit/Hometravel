import React, { useState } from 'react';
import { Chat } from '../Components/ChatRoom';

const ChatPageDemo = () => {
    const [isInChat, setIsInChat] = useState(true);
    const [room, setRoom] = useState('');
    return (
        <>
            {!isInChat ? (
                <div
                    className="room"
                    style={{ marginLeft: '500px', marginTop: '100px' }}
                >
                    <label> Type room name: </label>
                    <input
                        className="w-[400px] p-3 focus:outline-teal-500"
                        placeholder="Nhập tên phòng để tham gia chat"
                        onChange={(e) => setRoom(e.target.value)}
                    />
                    <button
                        className="rounded bg-blue-400 p-3"
                        onClick={() => {
                            setIsInChat(true);
                        }}
                    >
                        Enter Chat
                    </button>
                </div>
            ) : (
                <Chat room={room} setIsInChat={setIsInChat} />
            )}
        </>
    );
};

export default ChatPageDemo;
