import React, { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';

const ENDPOINT =
    window.location.host.indexOf("localhost") >= 0
        ? "http://127.0.0.1:4000"
        : window.location.host;

const ChatClient = () => {
    const uiMessagesRef = useRef(null);

    const [userName, setUserName] = useState("");
    const [messages, setMessages] = useState([
        { from: "System", body: "Hello there, Please ask your question." },
    ]);

    const [socket, setSocket] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [messageBody, setMessageBody] = useState("");

    useEffect(() => {
        if (socket) {
            socket.emit("onLogin", { name: userName });
            socket.on("message", (data) => {
                setMessages([...messages, data]);
            });
        }
    }, [messages, socket, userName]);

    const supportHandler = () => {
        setIsOpen(true);
        if (!userName) {
            setUserName(prompt("Please enter your name"));
        }
        const sk = socketIOClient(ENDPOINT);
        setSocket(sk);
    };
    const closeHandler = () => {
        setIsOpen(false);
    };

    const submitHandler = (e) => {
        e.preventDefault();
        if (!messageBody.trim()) {
            alert("Error. Please type message.");
        } else {
            setMessages([
                ...messages,
                { body: messageBody, from: userName, to: "Admin" },
            ]);
            setTimeout(() => {
                socket.emit("onMessage", {
                    body: messageBody,
                    from: userName,
                    to: "Admin",
                });
            }, 1000);
            setMessageBody("");
        }
    };

    return (
        <DefaultLayout>
            <div className="mx-auto max-w-270">
                <Breadcrumb pageName="Messages" />

                <p>Este es un ejemplo del chat que veria un visitante de la página para que pueda tener un soporte en tiempo real con el administrador</p>
                <div className="grid grid-cols-5 gap-8">
                    <div className="col-span-5">
                        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                            <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                                {!isOpen ? (
                                    <button onClick={supportHandler}>
                                        Chat with us
                                    </button>
                                ) : (
                                    <div>
                                        <ul ref={uiMessagesRef}>
                                            {messages.map((msg, index) => (
                                                <li className="py-1" key={index}>
                                                    <strong>{`${msg.from}: `}</strong> {msg.body}
                                                </li>
                                            ))}
                                        </ul>
                                        <form
                                        className="border-t border-stroke mt-5  py-2 px-2 dark:border-strokedark"
                                        onSubmit={submitHandler}>
                                            <input
                                                value={messageBody}
                                                onChange={(e) => setMessageBody(e.target.value)}
                                                type="text"
                                                placeholder="type message"
                                                className="w-full rounded border border-stroke bg-gray py-3 pl-8.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                            ></input>
                                            <button type="submit"
                                                className="mt-2 flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90">
                                                Send
                                            </button>
                                        </form>

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

export default ChatClient;