import React from "react";

interface IProps extends React.HTMLProps<HTMLButtonElement> {}

const Button: React.FC<IProps> = ({ children, onClick, className }) => {
  return (
    <button
      className={`px-4 py-1 bg-green-700 hover:bg-green-800 flex items-center justify-center text-white rounded border hover:border-green-900 hover:shadow-md outline-none ${
        className || ""
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
