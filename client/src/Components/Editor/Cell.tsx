import React from "react";
import { ISelectCell } from "../../Interfaces/Cell";

interface IProps {
  value: string | number;
  rowNumber: number;
  colNumber: number;
  isSelected: boolean;
  isRowSelected: boolean;
  onSelect?: (params: ISelectCell) => void;
  onValueChange: (params: ISelectCell) => void;
  isInput?: boolean;
  isColSelected: boolean;
}

const Cell: React.FC<IProps> = ({
  value,
  rowNumber,
  colNumber,
  isSelected,
  onSelect,
  onValueChange,
  isInput,
  isRowSelected,
  isColSelected,
}) => {
  const [inputVal, setInputVal] = React.useState<string | number>(value);

  const onInputChangeHandler = (changedValue: string) => {
    setInputVal(changedValue);
  };

  return (
    <div
      className={`border h-full min-w-[100px] max-w-[100px] ${
        isInput ? "p-0 shadow-lg" : "p-2"
      } m-0 flex flex-row overflow-hidden text-ellipsis whitespace-nowrap ${
        rowNumber < 0
          ? "bg-zinc-100"
          : isRowSelected
          ? "border-y-blue-500 border-y-2 bg-blue-200"
          : isColSelected
          ? "border-x-blue-500 border-x-2 bg-blue-200"
          : isSelected
          ? "border-blue-500 border-2"
          : ""
      }`}
      onClick={() => onSelect && onSelect({ rowNumber, colNumber, value })}
    >
      {isInput ? (
        <input
          value={inputVal}
          className="w-full h-full border-none outline-none p-2"
          onChange={(e) => onInputChangeHandler(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setInputVal(value);
              onSelect && onSelect({ rowNumber: -1, colNumber: -1, value: "" });
            } else if (e.key === "Enter") {
              onValueChange &&
                onValueChange({ rowNumber, colNumber, value: inputVal });
            }
          }}
          autoFocus
        />
      ) : (
        value
      )}
    </div>
  );
};

export default Cell;
