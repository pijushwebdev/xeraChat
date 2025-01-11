/* eslint-disable react/prop-types */
import useAuth from "../../hooks/useAuth";
import Message from "./Message";

const Messages = ({ messages = [] }) => {
  const { email } = useAuth() || {};

  return (
    <div className="relative w-full h-[calc(100vh_-_197px)] p-6 overflow-y-auto flex flex-col-reverse">
      <ul className="space-y-2">
        {messages
          .slice()
          .sort((a, b) => a.timestamp - b.timestamp) // original array k sort korle err dibe tai slice method diye copy kore nite hoi
          .map((message) => {
            const { id, message: lastMessage, sender } = message || {};

            const justify = sender.email !== email ? "start" : "end";

            return <Message key={id} justify={justify} message={lastMessage} />;
          })}
      </ul>
    </div>
  );
};

export default Messages;
