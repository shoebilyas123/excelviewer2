import React from 'react';

interface IProps extends React.HTMLProps<HTMLInputElement> {}

const Input: React.FC<IProps> = ({
  value,
  onChange,
  className,
  type,
  label,
}) => {
  return (
    <>
      {label && <label className="text-zinc-500 ml-2">{label}</label>}
      <input
        className="p-2 m-1 border rounded-md outline-none border-zinc-200 bg-zinc-50 "
        value={value}
        onChange={onChange}
        type={type}
      />
    </>
  );
};

export default Input;
