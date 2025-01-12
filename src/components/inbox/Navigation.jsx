import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import { userLoggedOut } from "../../redux/features/auth/authSlice";


const Navigation = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logout = () => {
        dispatch(userLoggedOut());
        localStorage.removeItem('auth');
        navigate('/')
    }

    return (
        <nav className="border-general sticky top-0 z-40 border-b bg-violet-700 transition-colors">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/">
                        <img
                            className="h-10"
                            src={'logoImage'}
                            alt="xeraChat"
                        />
                    </Link>
                    <ul>
                        <li className="text-white">
                            <span onClick={logout} className="cursor-pointer">Logout</span>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;