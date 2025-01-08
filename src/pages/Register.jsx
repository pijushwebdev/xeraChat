import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useRegisterMutation } from "../redux/features/auth/authApi";

const Register = () => {
  const initialData = {
    fullName: "",
    email: "",
    password: "",
    confirm: "",
    agreed: false,
  };
  
  const [registerData, setRegisterData] = useState(initialData);
  const [isMatched, setIsMatched] = useState(true); 
  const [responseError, setResponseError] = useState(''); 


  const navigate = useNavigate();

  const [register, { isError, isLoading, error, data }] = useRegisterMutation();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setRegisterData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!registerData.agreed) {
      setResponseError("You must agree to the terms and conditions.");
      return;
    }

    if (registerData.password !== registerData.confirm) {
      setIsMatched(false);
    } else {
      setIsMatched(true);
      register(registerData);
      setRegisterData(initialData);
    }
  };

  useEffect(() => {
    if(error?.data){
        setResponseError(error?.data)
    }
    if(data?.accessToken && data?.user){
        navigate('/inbox')
    }
  }, [data, error, navigate]);

  return (
    <div className="grid place-items-center h-screen bg-[#F9FAFB">
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <Link to="/">
              <img
                className="mx-auto h-12 w-auto"
                src={""}
                alt="Learn with sumit"
              />
            </Link>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Create your account
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* <input type="hidden" name="remember" value="true" /> */}
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="fullName" className="sr-only">
                  Full Name
                </label>
                <input
                  id="name"
                  name="fullName"
                  type="text"
                  autoComplete="Name"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                  placeholder="Name"
                  value={registerData.fullName}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={registerData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={registerData.password}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="confirm" className="sr-only">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirm"
                  type="password"
                  autoComplete="current-confirm"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                  placeholder="confirmPassword"
                  value={registerData.confirm}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  checked={registerData.agreed}
                  onChange={handleChange}
                  id="remember-me"
                  name="agreed"
                  type="checkbox"
                  className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="agreed"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Agreed with the terms and condition
                </label>
              </div>
            </div>

            <div>
              <button
                disabled={isLoading}
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3"></span>
                Sign up
              </button>
            </div>

            <p
              className={
                isMatched ? "hidden" : "block text-red-500 text-center"
              }
            >
              Password not matched
            </p>

            {isError && (
              <p className={"block text-red-500 text-center"}>{responseError}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
