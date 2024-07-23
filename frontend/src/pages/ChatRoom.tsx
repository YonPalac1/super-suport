import React, { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

import { Chat } from '../types/chat';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';

const ENDPOINT =
    window.location.host.indexOf("localhost") >= 0
        ? "http://127.0.0.1:4000"
        : window.location.host;

interface selectedUser {
    name: string;
}
interface users {
    name: string;
    online: boolean;
    unread: boolean;
}
interface messages {
    name: string;
    from: string;
    body: string;
    to: string;
}



const ChatRoom = () => {
    const [selectedUser, setSelectedUser] = useState<selectedUser>({ name: '' });
    const [socket, setSocket] = useState(null);
    const uiMessagesRef = useRef(null);
    const [messageBody, setMessageBody] = useState("");
    const [messages, setMessages] = useState<messages[]>([]);
    const [users, setUsers] = useState<users[]>([]);

    useEffect(() => {
        if (socket) {
            socket.on("message", (data: any) => {
                if (selectedUser.name === data.from) {
                    setMessages([...messages, data]);
                } else {
                    const existUser = users.find((user) => user.name === data.from);
                    if (existUser) {
                        setUsers(
                            users.map((user) =>
                                user.name === existUser.name ? { ...user, unread: true } : user
                            )
                        );
                    }
                }
            });

            socket.on("updateUser", (updatedUser: any) => {
                const existUser = users.find((user) => user.name === updatedUser.name);
                if (existUser) {
                    setUsers(
                        users.map((user) =>
                            user.name === existUser.name ? updatedUser : user
                        )
                    );
                } else {
                    setUsers([...users, updatedUser]);
                }
            });
            socket.on("listUsers", (updatedUsers) => {
                setUsers(updatedUsers);
            });

            socket.on("selectUser", (user) => {
                setMessages(user.messages);
            });
        } else {
            const sk = socketIOClient(ENDPOINT);
            setSocket(sk);
            sk.emit("onLogin", {
                name: "Admin",
            });
        }
    }, [messages, selectedUser, socket, users]);

    const selectUser = (user) => {
        setSelectedUser(user);
        const existUser = users.find((x) => x.name === user.name);
        if (existUser) {
            setUsers(
                users.map((x) =>
                    x.name === existUser.name ? { ...x, unread: false } : x
                )
            );
        }
        socket.emit("onUserSelected", user);
    };

    const submitHandler = (e) => {
        e.preventDefault();
        if (!messageBody.trim()) {
            alert("Error. Please type message.");
        } else {
            setMessages([
                ...messages,
                { body: messageBody, from: "Admin", to: selectedUser.name },
            ]);
            setTimeout(() => {
                socket.emit("onMessage", {
                    body: messageBody,
                    from: "Admin",
                    to: selectedUser.name,
                });
            }, 1000);
            setMessageBody("");
        }
    };


    return (
        <DefaultLayout>
            <div className="mx-auto max-w-270">
                <Breadcrumb pageName="Messages" />

                <div className="grid grid-cols-5 gap-8">
                    <div className="col-span-5 xl:col-span-2">
                        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                            <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                                {users.filter((x) => x.name !== "Admin").length === 0 && (
                                    <div>No User Found</div>
                                )}
                                <div className="border-b border-stroke mb-4 py-2 px-2 dark:border-strokedark">
                                    <h3 className="font-medium text-black dark:text-white">
                                        Usuarios
                                    </h3>
                                </div>
                                <ul>
                                    {users
                                        .filter((x) => x.name !== "Admin")
                                        .map((user) => (
                                            <li
                                                action
                                                key={user.name}
                                                variant={user.name === selectedUser.name ? "info" : ""}
                                                onClick={() => selectUser(user)} 
                                                className="py-1"
                                            >
                                                <span className="bg-blue-200 border px-4 text-black">
                                                    {selectedUser.name === user.name
                                                        ? user.online
                                                            ? "Online"
                                                            : "Offline"
                                                        : user.unread
                                                            ? "New"
                                                            : user.online
                                                                ? "Online"
                                                                : "Offline"}
                                                </span>
                                                &nbsp;
                                                {user.name}
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-5 xl:col-span-3">
                        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                            <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                                {!selectedUser.name ? (
                                    <span>Select a user to start chat</span>
                                ) : (
                                    <div>
                                        <div className="border-b border-stroke py-2 px-2 dark:border-strokedark">
                                            <h3 className="font-medium text-black dark:text-white">
                                                Chat with {selectedUser.name}
                                            </h3>
                                        </div>
                                        <ul ref={uiMessagesRef} className="body-chats ">
                                            {messages.length === 0 && (
                                                <li className="py-4">No message</li>
                                            )}
                                            {messages.map((msg, index) => (
                                                <li key={index} className="py-1">
                                                    <strong>{`${msg.from}: `}</strong> {msg.body}
                                                </li>
                                            ))}
                                        </ul>
                                        <div>
                                            <form onSubmit={submitHandler}>
                                                <input
                                                    value={messageBody}
                                                    onChange={(e) => setMessageBody(e.target.value)}
                                                    type="text"
                                                    placeholder="escribe un mensaje"
                                                    className="w-full rounded border border-stroke bg-gray py-3 pl-1.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                                ></input>
                                                <button 
                                                 className="mt-2 flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                                                type="submit">
                                                    enviar
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    )
}

export default ChatRoom;