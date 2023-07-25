import bcrypt from "bcryptjs";
import jsonwebToken from "jsonwebtoken";
import { User } from "../../models/index.js";
import { expiresIn, secret } from "../../config/auth.js";
import { ValidationError } from "yup";
import { verifyToken } from "../../middlewares/auth.js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { EMAIL_DOES_NOT_EXIS } from "../../error/message.js";
import sendEmail from "../../services/email.js";
import * as handlebars from "handlebars";
import { resetPasswordSchema } from "../../validators/auth.js";

dotenv.config();

function hashPassword (password) {
  return bcrypt.hashSync(password, 10);
}

const createToken = (payload, expiresIn = "1d") => {
  return jsonwebToken.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

const register = async (req, res) => {
  const {
    username,
    password,
    email,
  } = req.body;

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
  const {
    username,
    password,
  } = req.body;
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
      accessToken: jsonwebToken.sign({ id: user.id }, secret, {
        expiresIn,
      }),
    });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

const keepLogin = async (req, res, next) => {
  try {
    // @asume frontend send the request using header authorization
    const token = req.headers.authorization?.split(" ")[1];
    const decodedToken = verifyToken(token);

    const user = await User?.findOne({
      where: { id: decodedToken?.id },
    });

    // @delete password before sending response
    delete user?.dataValues?.password;

    // @send response
    res.status(200).json({ user });
  } catch (error) {
    // @check if error from validation
    if (error instanceof ValidationError) {
      return next({
        status: 400,
        message: error?.errors?.[0],
      });
    }
    next(error);
  }
};

const forgetPassword = async (req, res, next) => {
  try {
    // @get body from request
    const { email } = req.body;

    // @asume that email is unique
    const user = await User?.findOne({ where: { email: email } });
    if (!user) {
      throw {
        status: 400,
        message: EMAIL_DOES_NOT_EXIS,
      };
    }

    // @generate access token
    const accessToken = createToken({
      id: user.id,
      role: user.role,
    });

    // @Send verification link to new email
    const template = fs.readFileSync(
      path.join(process.cwd(), "templates", "resetPassword.html"),
      "utf8",
    );
    const message = handlebars.compile(template)({
      fullName: user?.dataValues?.fullName,
      link: process.env.REDIRECT_URL + `/auth/reset-password/${accessToken}`,
    });

    sendEmail(email, message);

    // @send response
    res
      .header("Authorization", `Bearer ${accessToken}`)
      .status(200)
      .json({ message: "Please check your email" });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    // @get body from request
    const {
      password,
    } = req.body;
    await resetPasswordSchema.validate(req.body);

    // @asume front end send the request using header authorization
    // @the header authorization get from forget password url
    const token = req.headers.authorization?.split(" ")[1];
    const decodedToken = verifyToken(token);

    // @has new password
    const encryptedPassword = hashPassword(password);

    // @udpate password in database and isVerified set to 1
    await User?.update(
      { password: encryptedPassword },
      { where: { id: decodedToken?.id } },
    );

    // @send response
    res
      .header("Authorization", `Bearer ${token}`)
      .status(200)
      .json({ message: "Password resset successfully" });
  } catch (error) {
    if (error instanceof ValidationError) {
      return next({
        status: 400,
        message: error?.errors?.[0],
      });
    }
    next(error);
  }
};

export default {
  register,
  login,
  keepLogin,
  forgetPassword,
};
