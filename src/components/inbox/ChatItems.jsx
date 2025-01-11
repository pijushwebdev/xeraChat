import moment from "moment";
import useAuth from "../../hooks/useAuth";
import { useGetConversationsQuery } from "../../redux/features/conversations/conversationsApi";
import ChatItem from "./ChatItem";
import { getPartnerInfo } from "../../utils/getPartnerInfo";
import gravatarUrl from "gravatar-url";
import { Link } from "react-router";

const ChatItems = () => {
  const user = useAuth();

  const {
    data: conversations,
    isError,
    isLoading,
    error,
  } = useGetConversationsQuery(user?.email);

  let content = null;

  if (isLoading) {
    content = <p>Loading conversations...</p>;
  } else if (!isLoading && isError) {
    content = <p>{error?.data}</p>;
  } else if (!isLoading && !isError && conversations?.length === 0) {
    content = <p>No conversation found! </p>;
  } else if (!isLoading && !isError && conversations.length > 0) {
    content = conversations.map((conversation) => {
        
      const { id, message, timestamp } = conversation;

      const partner = getPartnerInfo(conversation.users, user?.email);

      return (
        <li key={id}>
          <Link to={`/inbox/${id}`}>
            <ChatItem
              avatar={gravatarUrl(partner?.email, {
                size: 80,
              })}
              name={partner?.name}
              lastMessage={message}
              lastTime={moment(timestamp).fromNow()}
            />
          </Link>
        </li>
      );
    });
  }


  
  return <ul>{content}</ul>;
};

export default ChatItems;
