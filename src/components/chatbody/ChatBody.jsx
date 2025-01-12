import { useParams } from "react-router";
import ChatHead from "./ChatHead";
import Messages from "./Messages";
import Options from "./Options";
import { useGetMessagesQuery } from "../../redux/features/messages/messagesApi";

const ChatBody = () => {
  const { id } = useParams();

  const { data: messages, isError, isLoading, error } = useGetMessagesQuery(id);

  let content = null;

  if (isLoading) {
    content = <p>Loading conversations...</p>;
  } else if (!isLoading && isError) {
    content = <p>{error?.data}</p>;
  } else if (!isLoading && !isError && messages?.length === 0) {
    content = <p>No conversation found! </p>;
  } else if (!isLoading && !isError && messages.length > 0) {
    content = (
      <>
        <ChatHead message={messages[0]} />
        <Messages messages={messages} />
         <Options message={messages[0]}/> {/*last message info: last message because we sort it in message query */}
        {/* <Blank /> */}
      </>
    );
  }

  return (
    <div className="w-full lg:col-span-2 lg:block">
      <div className="w-full grid conversation-row-grid">{content}</div>
    </div>
  );
};

export default ChatBody;
