import axios from 'axios';
import { format } from 'path';

interface IParams {
  newFileData: any;
  filename: string;
  rowsToDelete: Array<number>;
  rowsToInsert: Array<number>;
  colToDelete: Array<number>;
  config: {
    headers: { authorization: string };
  };
  sheetName: string;
  rowsToDuplicate: any;
  colsToInsert: Array<number>;
}
const saveFile = async (payload: IParams) => {
  const {
    filename,
    newFileData,
    rowsToDelete,
    rowsToInsert,
    colToDelete,
    rowsToDuplicate,
    colsToInsert,
    config,
    sheetName,
  } = payload;

  return axios.post(
    'http://localhost:8000/api/v1/files/save',
    {
      filename,
      newFileData,
      rowsToDelete,
      rowsToInsert,
      colToDelete,
      rowsToDuplicate,
      colsToInsert,
      sheetName,
    },
    config
  );
};

export default saveFile;
