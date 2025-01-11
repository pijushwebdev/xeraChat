// import { Outlet } from 'react-router'
import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Conversation from "./pages/Conversation";
import Inbox from "./pages/Inbox";
import { useAuthCheck } from "./hooks/useAuthCheck";
import PrivateRoute from "./Routes/PrivateRoute";

function App() {
  const authChecked = useAuthCheck();

  const Loading = () => <p>Loading...</p>;

  return (
    <>
      {/* <Outlet/> */}

      {authChecked ? (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/inbox"
              element={
                <PrivateRoute>
                  <Conversation />{" "}
                </PrivateRoute>
              }
            />
            <Route path="/inbox/:id" element={<Inbox />} />
          </Routes>
        </BrowserRouter>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default App;
