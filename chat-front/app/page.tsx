"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import TextBoxChat from './chat'

const socket = io("http://localhost:3000");

export default function Home() {
  const [content, setContent] = useState("");
  const [messages, setMessages] = useState<
    {
      username: string;
      content: string;
      timeSent: string;
    }[]
  >([]);

  const [username, setUsername] = useState("");

  const [exists, setExists] = useState(true);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("message", (data) => {
      console.log({ data });
      setMessages((prev) => [...prev, data]);
    });

    socket.on("user-exist", (data) => {
      setExists(data);
    });
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    socket.emit("message", {
      username,
      content,
      timeSent: new Date().toUTCString(),
    });

    setContent("");
  };

  const handleUsername = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!exists) socket.emit("user-take", username);
  };

  useEffect(() => {
    socket.emit("user-check", username);
  }, [username]);

  return (
    <main className="flex min-h-screen flex-col justify-center items-center">
      <form onSubmit={handleUsername}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={`input ${exists ? "input-error" : ""}`}
        />
        <button type="submit" className="btn btn-primary">
          Join
        </button>
      </form>
      <div className="card w-96 h-96 shadow-xl">
        <div className="card-body w-full overflow-y-scroll">
          {messages.map((message) => {
            return (
              <TextBoxChat msg={message} usr={username}/>
            );
            
          })}
        </div>
        <form onSubmit={handleSubmit} className="justify-self-end">
          <input
            id="inputMessage"
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="input"
          />
          <button type="submit" className="btn btn-primary">
            Send
          </button>
          <div><input type="submit" onClick={(e) => {setContent(e.target.value);e.target.value = " "}} id="proposition1"></input>
          <input type="submit" onClick={(e) => {setContent(e.target.value);e.target.value = " "}} id="proposition2"></input></div>
        </form>
      </div>
    </main>
  );
}
