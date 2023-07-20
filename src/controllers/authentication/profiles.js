import User from "../../models/user.js";
import db from "../../models/index.js";
import fs from "fs";
import path from "path";

//@Upload user profile
export const uploadImage = async (req, res, next) => {
  const transaction = await db.sequelize.transaction();
  const imageUrl = "public/images/profiles/" + req?.file?.filename;
  try {
    // @check if image is uploaded
    if (!req.file) {
      throw new { status: 400, message: "Please upload an image." }();
    }
    const user = await User?.findOne({
      where: { userId: req?.user.userId },
    });

    //@delete old user Profile if exist
    console.log("Delete old");
    if (user.imgProfile) {
      fs.unlink(path.join(process.cwd(), user.imgProfile), (error) => {
        if (error) {
          console.error("Error deleting file:", error);
          throw { status: 500, message: error };
        }
        console.log("Old image deleted");
      });
    }

    // @update the user profile
    await User?.update(
      { imgProfile: imageUrl },
      { where: { userId: req.user.userId } }
    );

    // @send response
    res.status(200).json({
      message: "Image uploaded successfully.",
      userId: req.user?.userId,
      imageUrl: imageUrl,
    });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    fs.unlink(path.join(process.cwd(), imageUrl), (error) => {
      if (error) {
        console.error("Error deleting file:", error);
      }
      console.log("New Image deleted");
    });
    next(error);
  }
};

export const viewImage = async (req, res, next) => {
  try {
    //@get post id from body
    const { folder, file } = req.params;
    const image = path.join(process.cwd(), "public", "images", folder, file);
    //@send response
    res.status(200).sendFile(image);
  } catch (error) {
    next(error);
  }
};
