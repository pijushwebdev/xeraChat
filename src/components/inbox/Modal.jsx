/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import { isEmailValid } from "../../utils/isEmailValid";
import { useGetUserQuery } from "../../redux/features/users/usersApi";
import Error from "../ui/Error";
import useAuth from "../../hooks/useAuth";
import { useDispatch } from "react-redux";
import { conversationsApi, useAddConversationMutation, useEditConversationMutation } from "../../redux/features/conversations/conversationsApi";

const Modal = ({ open, control }) => {
  const [sendTo, setSendTo] = useState("");
  const [message, setMassage] = useState("");
  const [requesting, setRequesting] = useState(false);
  const [err, setErr] = useState("");
  const dispatch = useDispatch();

  const [conversation, setConversation] = useState(undefined);

  const user = useAuth() || {};
  const {email} = user;

  const debounceHandler = (fn, delay) => {
    let timeoutId;

    return (...agrs) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        fn(...agrs);
      }, delay);
    };
  };

  const { data: participant } = useGetUserQuery(sendTo, {
    skip: !requesting,
  });

  const setTo = (value) => {
    if (isEmailValid(value)) {
      //
      setRequesting(true);
      setSendTo(value);
    } else {
      setErr("Invalid email");
    }
  };

  useEffect(() => {
    if (participant && participant.length === 0) {
      setErr("Email does not exist");
    } else if (
      participant &&
      participant.length > 0 &&
      participant[0].email === email
    ) {
      setErr(`Can't send message yourself`);
    } else if (
      participant &&
      participant.length > 0 &&
      participant[0].email !== email
    ) {
      setErr("");
      //after getting the partner / need to find existing conversation
      // we can get it using useGetConversation (then we need a useState for skip handle) or using custom thank here 2nd option
      dispatch(
        conversationsApi.endpoints.getConversation.initiate({
          userEmail: email,
          participantEmail: sendTo,
        })
      )
        .unwrap()
        .then(data => setConversation(data))
        .catch((error) => setErr(error?.data));
    } else {
      setErr("");
    }
  }, [participant, email, dispatch, sendTo]);

  const handleSendTo = debounceHandler(setTo, 500);

  const [editConversation, {isSuccess: editSuccess}] = useEditConversationMutation();
  const [addConversation, {isSuccess: addSuccess}] = useAddConversationMutation();

  useEffect(() => {
    if(editSuccess || addSuccess){
      control()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editSuccess, addSuccess])   //suggest control add but if we add it as dependency it will rerender infinite cause control will call vice-versa

  const handleSubmit = (e) => {
    e.preventDefault();
    if(conversation?.length > 0){
      editConversation({
        id: conversation[0].id,
        sender: email,
        data: {
          participants: `${email}-${participant[0].email}`,
          users: [user, participant[0]],
          message,
          timestamp: new Date().getTime(),
        }
      })
    }else if(conversation?.length === 0){
      addConversation({
        sender: email,
        data: {
          participants: `${email}-${participant[0].email}`,
          users: [user, participant[0]],
          message,
          timestamp: new Date().getTime(),
        }
      })
    }
    
  }

  return (
    open && (
      <>
        <div
          onClick={control}
          className="fixed w-full h-full inset-0 z-10 bg-black/50 cursor-pointer"
        ></div>
        <div className="rounded w-[400px] lg:w-[600px] space-y-8 bg-white p-10 absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Send message
          </h2>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="to" className="sr-only">
                  To
                </label>
                <input
                  id="to"
                  name="to"
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                  placeholder="Send to"
                  onChange={(e) => handleSendTo(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="message" className="sr-only">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                  placeholder="Message"
                  value={message}
                  onChange={(e) => setMassage(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
              disabled={conversation === undefined || message === ''}
                type="submit"
                className="group disabled:bg-slate-400 relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
              >
                Send Message
              </button>
            </div>

            {err && <Error error={err} />}
          </form>
        </div>
      </>
    )
  );
};

export default Modal;
