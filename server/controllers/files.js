const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const Excel = require('exceljs');

const User = require('./../models/user');

exports.getFile = async (req, res) => {
  try {
    const filename = `${req.user.id}-${req.params.filename}`;
    console.log({ filename });
    if (!req.user.files.includes(filename))
      return res
        .status(404)
        .json({ message: 'File has either been deleted or does not exist' });

    const file = xlsx.readFile(`./uploads/${filename}`);
    const temp = xlsx.utils.sheet_to_csv(file.Sheets[file.SheetNames[0]]);
    res.status(200).json({ file: temp, filename });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong!' });
  }
};

exports.uploadFile = async (req, res) => {
  try {
    const file = req.file;

    await User.findByIdAndUpdate(req.user._id, {
      $push: { files: `${req.user.id}-${file.originalname}` },
    });

    res.status(200).json({ message: 'Uploaded file successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
};

exports.getFileList = async (req, res) => {
  try {
    fs.readdir('./uploads', (err, files) => {
      const filesAllowed = files.filter((file) =>
        req.user.files.includes(file)
      );
      res.status(200).json({ files: filesAllowed });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

exports.updateFileContent = async (req, res) => {
  try {
    const {
      filename,
      newFileData,
      rowsToDelete,
      rowsToInsert,
      colToDelete,
      rowsToDuplicate,
      colsToInsert,
    } = req.body;

    console.log(req.body);

    if (
      newFileData?.length === 0 &&
      rowsToDelete?.length === 0 &&
      rowsToInsert?.length === 0 &&
      colToDelete?.length === 0 &&
      colsToInsert?.length === 0 &&
      rowsToDuplicate?.length === 0
    ) {
      return res.status(200).json({ message: 'File already up-to-date' });
    }

    let workbook = new Excel.Workbook();
    workbook = await workbook.xlsx.readFile(`./uploads/${filename}`);
    let worksheet = workbook.getWorksheet(workbook.worksheets[0].name);

    if (rowsToDuplicate)
      rowsToDuplicate.forEach((rowData) => {
        worksheet.spliceRows(
          rowData.rowNumber,
          1,
          rowData.rowValues,
          rowData.rowValues
        );
      });

    if (colsToInsert)
      colsToInsert.forEach((col) => {
        worksheet.spliceColumns(col, 0, []);
      });

    if (newFileData)
      newFileData.forEach((fileData) => {
        worksheet
          .getRow(fileData.rowNumber + 1)
          .getCell(fileData.colNumber + 1).value = fileData.value;
      });

    if (rowsToInsert)
      rowsToInsert.forEach((rowValue) => {
        //insert at 7 hence 7 becomes empty and the rows 7 and below are shifted one row down.
        worksheet.spliceRows(rowValue + 2, 0, ['']);
      });

    if (rowsToDelete)
      rowsToDelete.forEach((rowValue) => {
        worksheet.spliceRows(rowValue, 1);
      });

    if (colToDelete)
      colToDelete.forEach((colValue) => {
        worksheet.spliceColumns(colValue + 1, 1);
      });

    workbook.xlsx.writeFile(`./uploads/${filename}`);
    res.status(201).json({ message: 'Updated the worksheet successfully!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};
