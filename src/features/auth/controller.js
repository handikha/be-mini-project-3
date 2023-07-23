import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { User } from "../../models/index.js";
import { expiresIn, secret } from "../../config/auth.js";

const register = async (req, res) => {
  const { username, password, email } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 8);

  try {
    await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return login(req, res);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }
    return res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      accessToken: jsonwebtoken.sign({ id: user.id }, secret, {
        expiresIn,
      }),
    });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

export default {
  register,
  login,
};
