const cloudinary = require("cloudinary").v2;

const cloudinary = require("cloudinary").v2;

async function deleteCloudinaryFile(cloudinary_id) {
  try {
    console.log("Attempting to delete from Cloudinary:", cloudinary_id);
    const result = await cloudinary.uploader.destroy(cloudinary_id);
    console.log("Cloudinary deletion result:", result);
  } catch (error) {
    console.error("Cloudinary deletion error:", error);
  }
}

const prismaMiddleware = async (prisma) => {
  prisma.$use(async (params, next) => {
    console.log("Middleware triggered:", params.model, params.action);

    if (params.action === "delete") {
      if (params.model === "File") {
        console.log("File delete detected");
        const file = await prisma.file.findUnique({
          where: params.args.where,
        });
        console.log("Found file:", file);

        if (file?.cloudinary_id) {
          await deleteCloudinaryFile(file.cloudinary_id);
        }
      }

      if (params.model === "User" || params.model === "Folder") {
        console.log(`${params.model} delete detected`);
        const files = await prisma.file.findMany({
          where:
            params.model === "User"
              ? { userId: params.args.where.id }
              : { folderId: params.args.where.id },
        });
        console.log("Found files to delete:", files);

        for (const file of files) {
          await deleteCloudinaryFile(file.cloudinary_id);
        }
      }
    }
    return next(params);
  });
};

module.exports = prismaMiddleware;
