import React from "react";

interface IProps {
  onInsertRowAbove?: () => void;
  onInsertRowBelow?: () => void;
  onDeleteEntireRow?: () => void;
  onDuplicateRow: () => void;
}

const RowDropdown: React.FC<IProps> = ({
  onInsertRowAbove,
  onInsertRowBelow,
  onDeleteEntireRow,
  onDuplicateRow,
}) => {
  return (
    <div className="fixed right-6 z-10 w-56 mt-4 origin-top-right bg-white border border-gray-100 rounded-md shadow-lg">
      <div className="p-2">
        <p
          className="block px-4 py-2 text-sm text-gray-500 rounded-lg hover:bg-slate-100 hover:text-gray-700 cursor-pointer"
          onClick={onInsertRowAbove}
        >
          + Insert Row Above
        </p>
        <p
          className="block px-4 py-2 text-sm text-gray-500 rounded-lg hover:bg-slate-100 hover:text-gray-700 cursor-pointer"
          onClick={onInsertRowBelow}
        >
          + Insert Row Below
        </p>
        <p
          className="block px-4 py-2 text-sm text-gray-500 rounded-lg hover:bg-slate-100 hover:text-gray-700 cursor-pointer"
          onClick={onDeleteEntireRow}
        >
          Delete Row
        </p>
        <p
          className="block px-4 py-2 text-sm text-gray-500 rounded-lg hover:bg-slate-100 hover:text-gray-700 cursor-pointer"
          onClick={onDuplicateRow}
        >
          Duplicate Row
        </p>
      </div>
    </div>
  );
};

export default RowDropdown;
