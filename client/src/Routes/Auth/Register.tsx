import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../../Components/Button";
import Input from "../../Components/Input";
import { IRegisterParams } from "../../Interfaces/auth";
import { register } from "../../Store/Slice/auth";
import { RootState } from "../../Store/store";
import Spinner from "../../Components/Spinner";

const Register = () => {
  const [userInfo, setUserInfo] = React.useState<IRegisterParams>();
  const { user, authLoading } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (user?.accessToken) {
      navigate("/");
    }
  }, [user?.accessToken]);

  const nameChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    // @ts-ignore
    setUserInfo((prev) => ({ ...prev, name: e.target.value }));
  };

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
    dispatch(register(userInfo));
  };

  return (
    <div className="w-screen h-screen bg-slate-50 flex items-center justify-center">
      <div className="rounded bg-white shadow-md flex flex-col p-2">
        <label>Email</label>
        <Input value={userInfo?.email} onChange={emailChangeHandler} required />
        <label>Name</label>
        <Input value={userInfo?.name} onChange={nameChangeHandler} required />
        <label>Password</label>
        <Input
          value={userInfo?.password}
          onChange={passwordChangeHandler}
          required
          type="password"
        />
        <Button onClick={onSubmitHandler}>
          {authLoading && <Spinner className="outline-none" />}
          <span>Register</span>
        </Button>
        <p>
          Already have an account?{" "}
          <a
            className="cursor-pointer text-green-700 hover:text-green-800"
            onClick={() => navigate("/login")}
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
