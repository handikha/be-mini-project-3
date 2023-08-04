import User from '../../models/user.js';
import db from '../../models/index.js';
import fs from 'fs';
import path from 'path';
import * as error from "../../midlewares/error.handler.js";

//@Upload user profile
export const uploadImage = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  const profileImg = req?.files?.['file'][0].filename;
  const imageUrl = 'public/images/profiles/' + profileImg;

  console.log('profileImg', profileImg);
  try {
    console.log("body", req.body)
    const id = req.body.userId
    const user = await User?.findOne({ where: { id: id } });
    if (!user) throw { status: 400, message: error.USER_DOES_NOT_EXISTS };

    //@delete old user Profile if exist
    if (user.imgProfile) {
      fs.unlink(path.join(process.cwd(), user.imgProfile), error => {
        if (error) {
          console.error('Error deleting file:', error);
          throw { status: 500, message: error };
        }
        console.log('Old image deleted');
      });
    }

    // @update the user profile
    await User?.update({ profileImg: imageUrl }, { where: { id: id } });

    // @send response
    res.status(200).json({
      message: 'Image uploaded successfully.',
      userId: req.user?.userId,
      imageUrl: imageUrl,
    });
    await transaction.commit();
  } catch (error) {
    console.log(error)
    await transaction.rollback();
    fs.unlink(path.join(process.cwd(), imageUrl), error => {
      if (error) {
        console.error('Error deleting file:', error);
      }
      console.log('New Image deleted');
    });
  }
};

export const viewImage = async (req, res, next) => {
  try {
    //@get post id from body
    const { folder, file } = req.params;
    const image = path.join(process.cwd(), 'public', 'images', folder, file);
    //@send response
    res.status(200).sendFile(image);
  } catch (error) {
    next(error);
  }
};
