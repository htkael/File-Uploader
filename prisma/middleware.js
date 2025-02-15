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
    if (params.action === "delete") {
      if (params.model === "File") {
        const file = await prisma.file.findUnique({
          where: params.args.where,
        });

        if (file?.cloudinary_id) {
          // Add resource_type: 'auto' to handle different file types
          await deleteCloudinaryFile(file.cloudinary_id);
        }
      }

      if (params.model === "User" || params.model === "Folder") {
        const files = await prisma.file.findMany({
          where:
            params.model === "User"
              ? { userId: params.args.where.id }
              : { folderId: params.args.where.id },
        });

        for (const file of files) {
          if (file.cloudinary_id) {
            await deleteCloudinaryFile(file.cloudinary_id);
          }
        }
      }
    }
    return next(params);
  });
};

module.exports = prismaMiddleware;
