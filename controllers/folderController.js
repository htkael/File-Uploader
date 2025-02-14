const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.folder = async (req, res) => {
  try {
    const folder_id = req.params.folder_id;
    console.log(folder_id);
    const folder = await prisma.folder.findUnique({
      where: {
        id: parseInt(folder_id),
      },
      include: {
        children: {
          select: {
            id: true,
            name: true,
            createdAt: true,
          },
        },
        files: {
          select: {
            id: true,
            filename: true,
            mimetype: true,
            size: true,
            createdAt: true,
          },
        },
        parent: true,
      },
    });

    const breadcrumb = [];
    let currentFolder = folder;
    while (currentFolder?.parent) {
      breadcrumb.unshift(currentFolder.parent);
      currentFolder = currentFolder.parent;
    }
    res.render("folder", {
      folder: folder,
      children: folder.files,
      breadcrumb: breadcrumb,
      currentPath: req.path,
    });
  } catch (err) {
    console.error(`Could not get folder ${err}`);
    res.status(500).send("Internal Server Error");
  }
};

exports.getCreateForm = async (req, res) => {
  const folder_id = req.params.folder_id;
  console.log(folder_id);
  const folder = await prisma.folder.findUnique({
    where: {
      id: parseInt(folder_id),
    },
  });
  res.render("folder_in_folder", { folder: folder });
};
