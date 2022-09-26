const router = require("express").Router();

const {
  getFile,
  getFileList,
  updateFileContent,
} = require("./../controllers/files");

router.get("/download/:filename", getFile);
router.get("/list", getFileList);
router.post("/save", updateFileContent);

module.exports = router;
