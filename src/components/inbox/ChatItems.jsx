import moment from "moment";
import useAuth from "../../hooks/useAuth";
import { conversationsApi, useGetConversationsQuery } from "../../redux/features/conversations/conversationsApi";
import ChatItem from "./ChatItem";
import { getPartnerInfo } from "../../utils/getPartnerInfo";
import gravatarUrl from "gravatar-url";
import { Link } from "react-router";
import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const ChatItems = () => {
  const user = useAuth();
  const {email} = user || {};
  const dispatch = useDispatch()

  const {
    data,
    isError,
    isLoading,
    error,
  } = useGetConversationsQuery(email);

  const {data: conversations, totalCount} = data || {};

  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const fetchMoreData = () => {
    setPage(prev => prev + 1)
  }

  useEffect(() => {
    if(totalCount > 0){
      const isMoreDataExists = Math.ceil(totalCount / Number(import.meta.env.VITE_LIMIT_PER_QUERY)) > page;
      setHasMore(isMoreDataExists);
    }
  }, [totalCount, page])

  useEffect(() => {
    if(page > 1){
      dispatch(conversationsApi.endpoints.getMoreConversations.initiate({email, page}))
    }
  }, [page, dispatch, email])

  let content = null;

  if (isLoading) {
    content = <p>Loading conversations...</p>;
  } else if (!isLoading && isError) {
    content = <p>{error?.data}</p>;
  } else if (!isLoading && !isError && conversations?.length === 0) {
    content = <p>No conversation found! </p>;
  } else if (!isLoading && !isError && conversations?.length > 0) {
    content = (
      <InfiniteScroll
        dataLength={conversations.length} //This is important field to render the next data
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
        height={window.innerHeight - 600}
      >
        {conversations.map((conversation) => {
          const { id, message, timestamp } = conversation || {};

          const partner = getPartnerInfo(conversation?.users, email);

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
        })}
      </InfiniteScroll>
    );
  }

  return <ul>{content}</ul>;
};

export default ChatItems;
