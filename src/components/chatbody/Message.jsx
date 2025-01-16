/* eslint-disable react/prop-types */


const Message = ({ justify, message }) => {
    return (
        <li className={`flex justify-${justify}`}>
        <div className="relative max-w-xl px-4 py-2 text-gray-700 rounded shadow">
            <span className="break-words text-wrap">{message}</span>
        </div>
    </li>
    );
};

export default Message;