const cloudinary = require("cloudinary").v2;
async function deleteCloudinaryFile(cloudinary_id) {
  try {
    console.log("Attempting to delete from Cloudinary:", cloudinary_id);
    const result = await cloudinary.uploader.destroy(cloudinary_id);
    console.log("Cloudinary deletion result:", result);

    // Even if file is not found, we consider it "deleted"
    if (result.result === "ok" || result.result === "not found") {
      console.log("File removed or already removed from Cloudinary");
      return true;
    }
    return false;
  } catch (error) {
    console.error("Cloudinary deletion error:", error);
    return false;
  }
}

const prismaMiddleware = async (prisma) => {
  prisma.$use(async (params, next) => {
    console.log("Middleware triggered:", params.model, params.action);

    if (params.action === "delete") {
      if (params.model === "File") {
        // Handle direct file deletion
        const file = await prisma.file.findUnique({
          where: params.args.where,
        });
        if (file?.cloudinary_id) {
          await deleteCloudinaryFile(file.cloudinary_id);
        }
      }

      if (params.model === "Folder") {
        // Recursively get all files in this folder and subfolders
        const getAllFolderFiles = async (folderId) => {
          const files = await prisma.file.findMany({
            where: { folderId },
          });

          const subfolders = await prisma.folder.findMany({
            where: { parentId: folderId },
          });

          let allFiles = [...files];
          for (const subfolder of subfolders) {
            const subfolderFiles = await getAllFolderFiles(subfolder.id);
            allFiles = allFiles.concat(subfolderFiles);
          }

          return allFiles;
        };

        const files = await getAllFolderFiles(params.args.where.id);
        console.log(`Found ${files.length} files in folder and subfolders`);

        for (const file of files) {
          await deleteCloudinaryFile(file.cloudinary_id);
        }
      }

      if (params.model === "User") {
        const files = await prisma.file.findMany({
          where: { userId: params.args.where.id },
        });

        for (const file of files) {
          await deleteCloudinaryFile(file.cloudinary_id);
        }
      }
    }
    return next(params);
  });
};
module.exports = prismaMiddleware;
