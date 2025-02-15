const prisma = require("../prisma/client");

exports.homePage = async (req, res) => {
  const user = req.user;
  const folders = await prisma.folder.findMany({
    where: {
      parentId: null,
    },
  });
  const files = await prisma.file.findMany({
    where: {
      folderId: null,
    },
  });
  res.render("homepage", { user: user, folders: folders, files: files });
};

exports.logout = async (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
};

exports.getFolderForm = async (req, res) => {
  res.render("create_folder", { user: req.user });
};

exports.createFolder = async (req, res) => {
  try {
    const name = req.body.name;
    const userId = req.user.id;
    const parentId = req.params.folder_id
      ? parseInt(req.params.folder_id)
      : null;
    await prisma.folder.create({
      data: {
        name: name,
        userId: userId,
        parentId: parentId,
      },
    });

    if (parentId) {
      res.redirect(`/folder/${parentId}`);
    } else {
      res.redirect("/");
    }
  } catch (err) {
    console.error(`Could not create folder ${err}`);
    res.status(500).send("Internal Server Error");
  }
};
