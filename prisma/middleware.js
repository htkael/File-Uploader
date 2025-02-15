const cloudinary = require("cloudinary").v2;

async function deleteCloudinaryFile(cloudinary_id) {
  try {
    await cloudinary.uploader.destroy(cloudinary_id);
    console.log("Deleted from Cloudinary:", cloudinary_id);
  } catch (error) {
    console.error("Cloudinary deletion error:", error);
  }
}

const prismaMiddleware = async (prisma) => {
  prisma.$use(async (params, next) => {
    // Check if this is a delete operation
    if (params.action === "delete") {
      // Handle direct file deletion
      if (params.model === "File") {
        // Get the file before it's deleted
        const file = await prisma.file.findUnique({
          where: params.args.where,
        });
        if (file?.cloudinary_id) {
          await deleteCloudinaryFile(file.cloudinary_id);
        }
      }
      // Handle cascade deletes from User or Folder
      if (params.model === "User" || params.model === "Folder") {
        const files = await prisma.file.findMany({
          where:
            params.model === "User"
              ? { userId: params.args.where.id }
              : { folderId: params.args.where.id },
        });

        // Delete all associated files from Cloudinary
        await Promise.all(
          files.map((file) => deleteCloudinaryFile(file.cloudinary_id))
        );
      }
    }
    return next(params);
  });
};

module.exports = prismaMiddleware;
