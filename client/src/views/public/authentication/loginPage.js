import React, { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import { userLoginApiCall } from "../../../services/authentication";
import { setUserInfo } from "../../../features/user";
import e from "cors";
export default function LoginPage(props) {
  const dispatch = useDispatch();
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [isLoading, setIsLoading] = useState(false);
  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await userLoginApiCall(email, password)
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            localStorage.setItem("accessToken", res.data.accessToken);
            dispatch(
              setUserInfo({
                id: res.data.user.id,
                name: res.data.user.firstName + " " + res.data.user.lastName.toUpperCase(),
                email: res.data.user.email,
                isLoggedIn: true,
              })
            );
          }
        })
        .catch((err) => {
          console.log(err);
        });
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Fragment className="h-screen font-sans login bg-cover">
      <div className="container mx-auto h-full flex flex-1 justify-center items-center">
        <div className="w-full max-w-lg">
          <div className="leading-loose">
            <form
              className="max-w-xl m-4 p-10 bg-white rounded shadow-xl"
              onSubmit={onSubmitForm}
            >
              <p className="text-gray-800 font-medium text-center text-lg font-bold">
                Login
              </p>
              <div className="">
                <label className="block text-sm text-gray-00" for="username">
                  Email
                </label>
                <input
                  className="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    email = e.target.value;
                    console.log(email);
                  }}
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="example@email.com"
                  aria-label="Email"
                />
              </div>
              <div className="mt-2">
                <label className="block text-sm text-gray-600" for="password">
                  Password
                </label>
                <input
                  className="w-full px-5  py-1 text-gray-700 bg-gray-200 rounded"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    password = e.target.value;
                    console.log(password);
                  }}
                  id="password"
                  name="password"
                  type="text"
                  required
                  placeholder="*******"
                  aria-label="password"
                />
              </div>
              <div className="mt-4 items-center justify-between">
                <button
                  className="px-4 py-1 text-white font-light tracking-wider bg-gray-900 rounded"
                  type="submit"
                >
                  Login
                </button>
                <a
                  className="inline-block right-0 align-baseline  font-bold text-sm text-500 hover:text-blue-800"
                  href="#"
                >
                  Forgot Password?
                </a>
              </div>
              <a
                className="inline-block right-0 align-baseline font-bold text-sm text-500 hover:text-blue-800"
                href="#"
              >
                Not registered ?
              </a>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
