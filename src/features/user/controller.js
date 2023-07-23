import { User } from "../../models/index.js";
import { upgradeToAdminSchema, validate } from "../../validators/user.js";

const upgradeToAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    await validate(upgradeToAdminSchema, req.body);
    const user = await User.update(req.body, {
      where: {
        id,
      },
    });

    res.status(200).send(user);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export { upgradeToAdmin };
