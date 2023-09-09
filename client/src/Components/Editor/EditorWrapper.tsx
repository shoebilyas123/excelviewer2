import React, { FC, useEffect, useState } from 'react';
import Button from '../Button';
import Editor from '.';

interface IEditorWrapperProps {
  fileData: Array<{ ws: string; data: string }>;
  filename: string;
  onCloseFile: any;
  onReload: any;
}

const EditorWrapper: FC<IEditorWrapperProps> = ({
  fileData,
  filename,
  onReload,
  onCloseFile,
}) => {
  const [selectedSheet, setSelectedSheet] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (!selectedSheet) {
      setSelectedSheet(fileData[0].ws);
    }
  }, [fileData]);

  return (
    <div className="flex flex-col">
      <Editor
        fileData={{
          filename,
          file: fileData.find(({ ws }) => ws == selectedSheet)?.data || '',
        }}
        sheetName={selectedSheet || ''}
        onCloseFile={onCloseFile}
        onReload={onReload}
      />
      <div className="shadow-md shadow-black  bg-gradient-to-b from-slate-200 to-slate-100 w-full flex items-center">
        {fileData
          .map(({ ws }) => ws)
          .map((sheet) => (
            <button
              className={`bg-white hover:bg-zinc-300 active:bg-zinc-200 border-b-2 ${
                selectedSheet == sheet ? 'border-b-green-400' : ''
              } px-3`}
              onClick={() => setSelectedSheet(sheet)}
            >
              {sheet}
            </button>
          ))}
      </div>
    </div>
  );
};

export default EditorWrapper;
