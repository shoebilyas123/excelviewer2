import React from "react";

interface IProps {
  rowNumber: number;
  onSelectRow: (rowNumber: number) => void;
  isRowSelected: boolean;
}

const RowNumCell: React.FC<IProps> = ({
  rowNumber,
  onSelectRow,
  isRowSelected,
}) => {
  return (
    <div
      className={`px-3 py-1 h-full font-bold text-zinc-700 m-0 min-w-[50px] max-w-[50px] ${
        rowNumber > -1
          ? isRowSelected
            ? "border border-x-0 border-l-2 border-y-2 border-blue-700 bg-blue-200"
            : "border bg-zinc-100"
          : ""
      }`}
      onClick={() => onSelectRow(rowNumber - 1)}
    >
      {rowNumber > -1 ? rowNumber : ""}
    </div>
  );
};

export default RowNumCell;
