const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const Excel = require("exceljs");

exports.getFile = async (req, res) => {
  try {
    const { filename } = req.params;
    console.log(filename);
    const file = xlsx.readFile(`./uploads/${filename}`);
    const sheets = file.SheetNames;
    let data = [];
    const temp = xlsx.utils.sheet_to_json(file.Sheets["Sheet1"]);
    temp.forEach((val) => data.push(val));
    res.status(200).json({ file: data, filename });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

exports.getFileList = async (req, res) => {
  try {
    fs.readdir("./uploads", (err, files) => {
      console.log(files);
      res.status(200).json({ files });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

exports.updateFileContent = async (req, res) => {
  try {
    const { filename, newFileData, rowsToDelete, rowsToInsert } = req.body;

    if (
      newFileData.length === 0 &&
      rowsToDelete.length === 0 &&
      rowsToInsert.length === 0
    ) {
      return res
        .status(200)
        .json({ message: "Updated the worksheet successfully!" });
    }

    let workbook = new Excel.Workbook();
    workbook = await workbook.xlsx.readFile(`./uploads/${filename}`);
    let worksheet = workbook.getWorksheet("Sheet1");

    newFileData.forEach((fileData) => {
      worksheet
        .getRow(fileData.rowNumber + 1)
        .getCell(fileData.colNumber + 1).value = fileData.value;
    });

    console.log({ rowsToInsert });
    rowsToInsert.forEach((rowValue) => {
      //insert at 7 hence 7 becomes empty and the rows 7 and below are shifted one row down.
      worksheet.spliceRows(rowValue + 2, 0, [""]);
    });

    rowsToDelete.forEach((rowValue) => {
      worksheet.spliceRows(rowValue, 1);
    });

    workbook.xlsx.writeFile(`./uploads/${filename}`);
    res.status(201).json({ message: "Updated the worksheet successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};
