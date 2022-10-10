import React from "react";

interface IProps {
  onDeleteColumn: () => void;
  onInsertColBefore: () => void;
  onInsertColAfter: () => void;
}

const ColDropdown: React.FC<IProps> = ({
  onDeleteColumn,
  onInsertColBefore,
  onInsertColAfter,
}) => {
  return (
    <div className="fixed right-6 z-10 w-56 mt-4 origin-top-right bg-white border border-gray-100 rounded-md shadow-lg">
      <div className="p-2">
        <p
          className="block px-4 py-2 text-sm text-gray-500 rounded-lg hover:bg-slate-100 hover:text-gray-700 cursor-pointer"
          onClick={onDeleteColumn}
        >
          Delete Column
        </p>
        <p
          className="block px-4 py-2 text-sm text-gray-500 rounded-lg hover:bg-slate-100 hover:text-gray-700 cursor-pointer"
          onClick={onInsertColBefore}
        >
          Insert Column Before
        </p>
        <p
          className="block px-4 py-2 text-sm text-gray-500 rounded-lg hover:bg-slate-100 hover:text-gray-700 cursor-pointer"
          onClick={onInsertColAfter}
        >
          Insert Column After
        </p>
      </div>
    </div>
  );
};

export default ColDropdown;
