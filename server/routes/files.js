const router = require('express').Router();
const multer = require('multer');
const { protect } = require('../utils/auth');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}-${file.originalname}`);
  },
});

const upload = multer({ storage: multerStorage });

const {
  getFile,
  getFileList,
  updateFileContent,
  uploadFile,
} = require('./../controllers/files');

router.get('/download/:filename', protect, getFile);
router.get('/list', protect, getFileList);
router.post('/save', protect, updateFileContent);
router.post('/upload', protect, upload.single('file'), uploadFile);

module.exports = router;
