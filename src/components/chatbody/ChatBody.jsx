import ChatHead from "./ChatHead";
import Messages from "./Messages";
import Options from "./Options";


const ChatBody = () => {
    return (
        <div className="w-full lg:col-span-2 lg:block">
            <div className="w-full grid conversation-row-grid">
                <ChatHead
                    avatar="https://cdn.pixabay.com/photo/2018/01/15/07/51/woman-3083383__340.jpg"
                    name="Akash Ahmed"
                />
                <Messages />
                <Options />
                {/* <Blank /> */}
            </div>
        </div>
    );
};

export default ChatBody;