import { User } from "../models/index.js";

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    // Check username
    const user = await User.findOne({
      where: { username: req.body.username },
    });

    if (user) {
      return res
        .status(400)
        .send({ message: "Failed! Username is already in use!" });
    }

    // Check email
    const email = await User.findOne({
      where: { email: req.body.email },
    });

    if (email) {
      return res
        .status(400)
        .send({ message: "Failed! Email is already in use!" });
    }

    next();
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

export default {
  checkDuplicateUsernameOrEmail,
};
