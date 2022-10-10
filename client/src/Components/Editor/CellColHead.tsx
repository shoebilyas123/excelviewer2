import React from "react";

interface IProps {
  colNumber: number;
  isSelected: boolean;
  onSelect?: (params: { colNumber: number }) => void;
}

const CellColHead: React.FC<IProps> = ({ colNumber, isSelected, onSelect }) => {
  return (
    <div
      className={`border h-full font-bold text-zinc-800 min-w-[100px] max-w-[100px] px-2 py-1 m-0 flex flex-row overflow-hidden text-ellipsis whitespace-nowrap bg-zinc-100 ${
        isSelected
          ? "border-t-blue-500  border-x-blue-500 border-2 bg-blue-200"
          : ""
      }`}
      onClick={() => onSelect && onSelect({ colNumber })}
    >
      {String.fromCharCode(colNumber + 65)}
    </div>
  );
};

export default CellColHead;
