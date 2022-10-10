import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../../Components/Button";
import Input from "../../Components/Input";
import Spinner from "../../Components/Spinner";
import { IRegisterParams } from "../../Interfaces/auth";
import { login } from "../../Store/Slice/auth";
import { RootState } from "../../Store/store";

const Login = () => {
  const [userInfo, setUserInfo] = React.useState<IRegisterParams>();
  const authState = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (authState?.user?.accessToken) {
      navigate("/");
    }
  }, [authState]);

  const emailChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    // @ts-ignore
    setUserInfo((prev) => ({ ...prev, email: e.target.value }));
  };

  const passwordChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    // @ts-ignore
    setUserInfo((prev) => ({ ...prev, password: e.target.value }));
  };

  const onSubmitHandler = () => {
    // @ts-ignore
    dispatch(login(userInfo));
  };

  return (
    <div className="w-screen h-screen bg-slate-50 flex items-center justify-center">
      <div className="rounded bg-white shadow-md flex flex-col p-2">
        <h1 className="text-xl my-2 text-center">Excel Viewer Login</h1>
        <div className="flex flex-col">
          <label>Email</label>
          <Input
            value={userInfo?.name}
            onChange={emailChangeHandler}
            required
          />
          <label>Password</label>
          <Input
            value={userInfo?.password}
            onChange={passwordChangeHandler}
            required
            type="password"
          />
          <Button onClick={onSubmitHandler}>
            {authState.authLoading && <Spinner />} <p>Login</p>
          </Button>
          <p>
            Don't have an account?{" "}
            <a
              className="cursor-pointer text-green-700 hover:text-green-800"
              onClick={() => navigate("/register")}
            >
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
