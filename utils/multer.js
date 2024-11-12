const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({storage})
const path = require("path");
const DataUri = require("datauri/parser");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(
//       null,
//       file.fieldname +
//         "-" +
//         Date.now() +
//         path.extname(file.originalname).toLowerCase()
//     );
//   },
// });



const imageUploads = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 3 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpg|jpeg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(
      "Error: File upload only supports the following filetypes - " + filetypes
    );
  },
}).single("image");

const dataUri = (req) => {
  const file = req.file;
  const fileUri = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
  return { content: fileUri };
};

module.exports = { dataUri, imageUploads };
