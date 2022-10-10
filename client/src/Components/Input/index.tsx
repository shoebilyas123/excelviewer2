import React from "react";

interface IProps extends React.HTMLProps<HTMLInputElement> {}

const Input: React.FC<IProps> = ({ value, onChange, className, type }) => {
  return (
    <input
      className="p-2 m-1 border rounded outline-none border-zinc-400 bg-zinc-50 "
      value={value}
      onChange={onChange}
      type={type}
    />
  );
};

export default Input;
