const multer = require("multer");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const { folder } = require("./folderController");
const exp = require("constants");
const prisma = new PrismaClient();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
});

exports.getUploadForm = async (req, res) => {
  res.render("upload", { user: req.user });
};

exports.uploadFile = async (req, res) => {
  try {
    upload.single("uploaded_file")(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        console.error("Multer error", err);
        return res.redirect("/upload");
      } else if (err) {
        console.error("Upload error", error);
        return res.redirect("/upload");
      }
      const file = req.file;
      const folderId = req.params.folder_id
        ? parseInt(req.params.folder_id)
        : null;
      console.log(`Folder ID: ${folderId}`);
      await prisma.file.create({
        data: {
          filename: file.filename,
          path: file.path,
          mimetype: file.mimetype,
          size: file.size,
          userId: req.user.id,
          folderId: folderId,
        },
      });
      if (folderId) {
        res.redirect(`/folder/${folderId}`);
      } else {
        res.redirect("/");
      }
    });
  } catch (err) {
    console.error("Upload error", err);
    res.redirect("/upload");
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const fileId = parseInt(req.params.file_id);
    console.log("Attempting to delete file with ID:", fileId); // Add this log

    await prisma.file.delete({
      where: {
        id: fileId,
      },
    });

    if (req.params.folder_id) {
      res.redirect(`/folder/${req.params.folder_id}`);
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.log("Error details:", error); // Add more detailed error logging
    res.status(500).send("Error deleting file");
  }
};
