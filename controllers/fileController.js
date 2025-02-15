const path = require("path");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cloudinary = require("../config/cloudinary");
const prismaMiddleware = require("../prisma/middleware");
prismaMiddleware(prisma);

exports.getUploadForm = async (req, res) => {
  res.render("upload", { user: req.user });
};

exports.uploadFile = async (req, res) => {
  try {
    const file = req.files.file;
    console.log("File: ", file);
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",
    });
    const folderId = req.params.folder_id
      ? parseInt(req.params.folder_id)
      : null;
    console.log(result);
    await prisma.file.create({
      data: {
        filename: file.name,
        cloudinary_id: result.public_id,
        url: result.secure_url,
        mimetype: file.mimetype,
        size: file.size,
        userId: req.user.id,
        folderId: folderId,
      },
    });
    if (req.params.folder_id) {
      res.redirect(`/folder/${folderId}`);
    } else {
      res.redirect("/");
    }
  } catch (err) {
    console.error("Upload error", err);
    res.redirect("/upload");
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const fileId = parseInt(req.params.file_id);
    console.log("Attempting to delete file with ID:", fileId); // Add this log

    const file = await prisma.file.findUnique({
      where: {
        id: fileId,
      },
    });

    await cloudinary.uploader.destroy(file.cloudinary_id);

    await prisma.file.delete({
      where: {
        id: fileId,
      },
    });

    console.log("File deleted successfully from both Cloudinary and database");

    if (req.query.folder_id) {
      res.redirect(`/folder/${req.query.folder_id}`);
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.log("Error details:", error); // Add more detailed error logging
    res.status(500).send("Error deleting file");
  }
};

exports.getFileDetails = async (req, res) => {
  try {
    const id = parseInt(req.params.file_id);
    const file = await prisma.file.findUnique({
      where: {
        id: id,
      },
    });
    console.log(file);
    res.render("details", { file: file, user: req.user });
  } catch (error) {
    console.log("Error details:", error); // Add more detailed error logging
    res.status(500).send("Error getting file details");
  }
};

exports.downloadFile = async (req, res) => {
  const file_id = parseInt(req.params.file_id);
  const file = await prisma.file.findUnique({
    where: {
      id: file_id,
    },
  });
  if (!file) {
    return res.status(404).json({ error: "File not found" });
  }
  res.redirect(file.url);
};
