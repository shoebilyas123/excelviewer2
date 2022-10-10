import React, { useEffect, useState } from "react";
// @ts-ignore
import { useVirtualizer } from "@tanstack/react-virtual";
import { toast } from "react-toastify";
import { AiOutlineReload } from "react-icons/ai";

import useLoading from "../../Hooks/useLoading";
import Cell from "./Cell";
import downloadFile from "../../API/Files/downloadFile";
import RowNumCell from "./CellRowNum";
import Button from "../Button";
import { ISelectCell } from "../../Interfaces/Cell";
import CellColHead from "./CellColHead";
import saveFile from "../../API/Files/saveFile";
import Spinner from "../Spinner";
import { RowDropdown } from "../Dropdown";
import ColDropdown from "../Dropdown/ColDropdown";
import { useSelector } from "react-redux";
import { RootState } from "../../Store/store";

interface IProps {
  fileData: {
    filename: string;
    file: any;
  };
  onCloseFile: () => void;
  onReload: (fName: string) => void;
}

interface IRowsToDup {
  rowNumber: number;
  rowValues: Array<string | number>;
}

interface ISelectedCell extends ISelectCell {
  isInput: boolean;
}

interface IRowRenderParams {
  rowNumber: number;
}

const Editor: React.FC<IProps> = ({ fileData, onCloseFile, onReload }) => {
  const [selectedCell, setSelectedCell] = useState<ISelectedCell>();
  const { loading, startLoading, stopLoading } = useLoading();
  const [data, setData] = useState<(string[] | number[])[]>([]);
  const [editedCells, setEditedCells] = React.useState<ISelectCell[]>([]);
  const [limit, setLimit] = useState<number>(100);
  const [selectedRow, setSelectedRow] = React.useState<number>(-1);
  const [rowsToDelete, setRowsToDelete] = React.useState<Array<number>>([]);
  const [rowsToInsert, setRowsToInsert] = React.useState<Array<number>>([]);
  const [columnsToDelete, setColumnsToDelete] = React.useState<Array<number>>(
    []
  );
  const [selectedCol, setSelectedCol] = React.useState<number>(-1);
  const {
    user: { accessToken },
  } = useSelector((state: RootState) => state.auth);
  const [colsToInsert, setColsToInsert] = React.useState<Array<number>>();

  const [rowsToDuplicate, setRowsToDuplicate] =
    React.useState<Array<IRowsToDup>>();

  const parentRef = React.useRef<any>();

  const rowVirtualizer = useVirtualizer({
    count: 1000,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
  });

  document.body.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (
        selectedCell &&
        selectedCell?.rowNumber > -1 &&
        selectedCell?.colNumber > -1
      ) {
        resetCellSelect();
      }
    }
  });

  const saveFileHandler = async () => {
    try {
      startLoading();

      const { data } = await saveFile({
        filename: fileData.filename,
        newFileData: editedCells,
        rowsToDelete: rowsToDelete,
        rowsToInsert,
        colToDelete: columnsToDelete,
        rowsToDuplicate,
        colsToInsert: colsToInsert || [],
        config: {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        },
      });

      toast.success(data?.message);
      setColumnsToDelete([]);
      setRowsToDelete([]);
      setRowsToInsert([]);
      stopLoading();
    } catch (error) {
      stopLoading();
    }
  };

  const resetCellSelect = () =>
    setSelectedCell({
      rowNumber: -1,
      colNumber: -1,
      value: "",
      isInput: false,
    });

  const formatData = () => {
    startLoading();
    let tempData: any = [];
    tempData = fileData.file.split("\n").map((str: string) => str.split(","));
    setData(tempData);
    stopLoading();
  };

  const selectCellHandler = ({ rowNumber, colNumber, value }: ISelectCell) => {
    setSelectedRow(-1);
    setSelectedCol(-1);
    if (
      selectedCell &&
      selectedCell?.rowNumber === rowNumber &&
      selectedCell?.colNumber === colNumber
    ) {
      setSelectedCell({ ...selectedCell, isInput: true });
    } else {
      setSelectedCell({ rowNumber, colNumber, value, isInput: false });
    }
  };

  const selectColumnHandler = (params: { colNumber: number }) => {
    resetCellSelect();
    const { colNumber } = params;
    setSelectedCol(colNumber);
  };

  const renderColHeads = () => {
    let headsNode = [];

    let i = 65;
    headsNode.push(
      <RowNumCell
        rowNumber={-1}
        onSelectRow={(s: number) => {}}
        isRowSelected={false}
      />
    );
    while (i <= 90) {
      headsNode.push(
        <CellColHead
          colNumber={i - 65}
          isSelected={selectedCol === i - 65}
          onSelect={selectColumnHandler}
        />
      );
      i++;
    }

    return <div className="flex">{headsNode}</div>;
  };

  const onValueChangeHandler = (params: ISelectCell) => {
    const { rowNumber, colNumber, value } = params;
    let tempData = data;

    if (rowNumber > tempData.length) {
      let r = tempData.length;

      while (r < rowNumber) {
        tempData.push([]);
        r++;
      }
    }

    if (
      (colNumber === 0 && tempData[rowNumber].length === 0) ||
      colNumber > tempData[rowNumber].length
    ) {
      let i = tempData[rowNumber].length;

      while (i < colNumber) {
        // @ts-ignore
        tempData[rowNumber].push("");
        i++;
      }
    }

    if (tempData[rowNumber][colNumber] === value) {
      return;
    }

    tempData[rowNumber][colNumber] = value;
    setData(tempData);
    if (
      !editedCells.some(
        (cell) => cell.rowNumber === rowNumber && cell.colNumber === colNumber
      )
    )
      setEditedCells((prev) => [...prev, { rowNumber, colNumber, value }]);

    resetCellSelect();
  };

  const selectRowHandler = (rowNumber: number) => {
    setSelectedRow(rowNumber);
    resetCellSelect();
  };

  const renderRow = (params: IRowRenderParams) => {
    const { rowNumber } = params;
    let row = [];
    row.push(
      <RowNumCell
        rowNumber={rowNumber + 1}
        onSelectRow={selectRowHandler}
        isRowSelected={rowNumber === selectedRow}
      />
    );

    let i = 65;
    while (i <= 90) {
      if (rowNumber >= data.length) {
        row.push(
          <Cell
            value={""}
            rowNumber={rowNumber}
            colNumber={i - 65}
            isSelected={
              selectedCell?.rowNumber === rowNumber &&
              selectedCell.colNumber === i - 65
            }
            isRowSelected={rowNumber === selectedRow}
            onSelect={selectCellHandler}
            isInput={
              selectedCell?.rowNumber === rowNumber &&
              selectedCell.colNumber === i - 65 &&
              selectedCell.isInput
            }
            onValueChange={onValueChangeHandler}
            isColSelected={selectedCol === i - 65}
          />
        );
      } else {
        row.push(
          <Cell
            value={
              i - 65 < data[rowNumber].length ? data[rowNumber][i - 65] : ""
            }
            rowNumber={rowNumber}
            colNumber={i - 65}
            isSelected={
              selectedCell?.rowNumber === rowNumber &&
              selectedCell.colNumber === i - 65
            }
            isRowSelected={rowNumber === selectedRow}
            onSelect={selectCellHandler}
            isInput={
              selectedCell?.rowNumber === rowNumber &&
              selectedCell.colNumber === i - 65 &&
              selectedCell.isInput
            }
            onValueChange={onValueChangeHandler}
            isColSelected={selectedCol === i - 65}
          />
        );
      }
      i++;
    }

    return row;
  };

  const renderTable = () => {
    return rowVirtualizer.getVirtualItems().map((virtualItem: any) => (
      <div
        key={virtualItem.key}
        className="flex flex-row items-center"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: `${virtualItem.size}px`,
          transform: `translateY(${virtualItem.start}px)`,
        }}
      >
        {renderRow({ rowNumber: virtualItem.index })}
      </div>
    ));
  };

  useEffect(() => {
    formatData();
  }, [fileData]);

  const deleteRowHandler = () => {
    if (selectedRow < data.length) {
      let tempData: any = data;
      tempData = tempData.filter(
        (val: string[] | number[], index: number) => index !== selectedRow
      );
      setRowsToDelete((prev) => [...prev, selectedRow]);
      setData(tempData);
    }
    setSelectedRow(-1);
  };

  const insertRowAboveHandler = () => {
    if (selectedRow < data.length) {
      let tempData: any = data;

      tempData.splice(selectedRow, 0, []);
      setData(tempData);
      setRowsToInsert((prev) => [...prev, selectedRow]);
    }

    setSelectedRow(-1);
  };

  const insertRowBelowHandler = () => {
    if (selectedRow < data.length) {
      let tempData: any = data;

      tempData.splice(selectedRow + 1, 0, []);
      setData(tempData);
      setRowsToInsert((prev) => [...prev, selectedRow + 1]);
    }

    setSelectedRow(-1);
  };

  const deleteColumnHandler = () => {
    let tempData: (string[] | number[])[] = data;

    tempData = tempData.map((d) => {
      d.splice(selectedCol, 1);
      return d;
    });

    setColumnsToDelete((prev) => [...prev, selectedCol]);
    setData(tempData);
    setSelectedCol(-1);
  };

  const duplicateRowHandler = () => {
    let tempData = data;

    tempData.splice(selectedRow, 0, tempData[selectedRow]);
    // @ts-ignore
    setRowsToDuplicate((prev) => [
      ...(prev ? prev : []),
      {
        rowNumber: selectedRow,
        rowValues: tempData[selectedRow],
      },
    ]);
    setData(tempData);
    setSelectedRow(-1);
  };

  const insertColumnBefore = () => {
    let tempData = data;

    tempData = tempData.map((d) => {
      d.splice(selectedCol, 0, "");
      return d;
    });
    setColsToInsert((prev) => [...(prev ? prev : []), selectedCol]);
    setData(tempData);
    setSelectedCol(-1);
  };

  const insertColumnAfter = () => {
    let tempData = data;

    tempData = tempData.map((d) => {
      d.splice(selectedCol + 1, 0, "");
      return d;
    });

    setColsToInsert((prev) => [...(prev ? prev : []), selectedCol + 2]);
    setData(tempData);
    setSelectedCol(-1);
  };

  return (
    <>
      {selectedRow > -1 && (
        <RowDropdown
          onDeleteEntireRow={deleteRowHandler}
          onInsertRowAbove={insertRowAboveHandler}
          onInsertRowBelow={insertRowBelowHandler}
          onDuplicateRow={duplicateRowHandler}
        />
      )}
      {selectedCol > -1 && (
        <ColDropdown
          onDeleteColumn={deleteColumnHandler}
          onInsertColBefore={insertColumnBefore}
          onInsertColAfter={insertColumnAfter}
        />
      )}
      <div className="w-full z-9">
        <div className="relative w-full bg-gradient-to-t from-slate-200 to-slate-100 shadow-sm text-xl flex items-center justify-center py-3 ">
          {fileData.filename.substring(25)}
          <div className="absolute left-2 flex items-center space-x-2 ">
            <Button
              className="rounded text-xl py-2 border-zinc-300 bg-slate-50 hover:bg-slate-200 text-zinc-900"
              onClick={() => onReload(fileData.filename.substring(25))}
            >
              <AiOutlineReload />
            </Button>
            <Button
              className="border-zinc-300 bg-slate-50 hover:bg-slate-200 text-zinc-900"
              onClick={onCloseFile}
            >
              Close
            </Button>
            <Button onClick={saveFileHandler}>Save</Button>
            {loading && <Spinner />}
          </div>
        </div>
        <div
          ref={parentRef}
          style={{
            height: `90vh`,
            overflow: "auto", // Make it scroll!
          }}
          // className="h-screen"
        >
          {renderColHeads()}
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            <>{data.length !== 0 && renderTable()}</>
          </div>
        </div>
      </div>
    </>
  );
};

export default Editor;
