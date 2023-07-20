import User from "../../models/user.js";
import * as helpers from "../../helpers/index.js";
import * as Validation from "./validation.js";
import * as config from "../../config/index.js";
import { ValidationError } from "yup";
import * as error from "../../midlewares/error.handler.js";
import db from "../../models/index.js";

//@verify account constroller
export const verifyAccount = async (req, res, next) => {
  try {
    //@get token params
    const { token } = req.params;

    //@verify the token
    const decodedToken = helpers.verifyToken(token);

    //@update isVerified field to 1
    await User?.update({ status: 1 }, { where: { id: decodedToken?.id } });
    // @return response
    res.status(200).json({ message: "Account verified successfully" });
  } catch (error) {
    next(error);
  }
};

//@Change default password
export const changeDefaultPassword = async (req, res, next) => {
  const transaction = await db.sequelize.transaction();
  try {
    //@get body from request
    const { currentPassword, password, confirmPassword } = req.body;
    await Validation.changePasswordSchema.validate(req.body);

    const user = await User?.findOne({ where: { id: req?.user.id } });

    //@check default password
    const isPasswordCorrect = helpers.comparePassword(
      currentPassword,
      user?.dataValues?.password
    );
    if (!isPasswordCorrect)
      throw { status: 400, message: error.INVALID_CREDENTIALS };

    //@has new password
    const encryptedPassword = helpers.hashPassword(password);

    //@udpate password in database and change isVerified to false
    await User?.update(
      { password: encryptedPassword },
      { where: { id: req.user.id } }
    );

    //@send response
    res.status(200).json({ message: "Password changed successfully" });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    if (error instanceof ValidationError) {
      return next({ status: 400, message: error?.errors?.[0] });
    }
    next(error);
  }
};

//@login controller
export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    await Validation.LoginValidationSchema.validate(req.body);

    //@check if user exists
    const userExists = await User?.findOne({ where: { username } });
    if (!userExists) throw { status: 400, message: error.USER_DOES_NOT_EXISTS };

    //@check password
    const isPasswordCorrect = helpers.comparePassword(
      password,
      userExists?.dataValues?.password
    );
    if (!isPasswordCorrect)
      throw { status: 400, message: error.INVALID_CREDENTIALS };

    //@check if user verified
    if (userExists?.dataValues?.status === 0)
      throw { status: 400, message: error.USER_UNVERIFIED };

    //@check if user deleted
    if (userExists?.dataValues?.status === 3)
      throw { status: 400, message: error.USER_DOES_NOT_EXISTS };

    //@generate access token
    const accessToken = helpers.createToken({
      id: userExists?.dataValues?.id,
      role: userExists?.dataValues?.role,
    });

    //@delete password before sending response
    delete userExists?.dataValues?.password;

    //@send response
    res
      .header("Authorization", `Bearer ${accessToken}`)
      .status(200)
      .json({ message: "Login Successfull", data: userExists });
  } catch (error) {
    // @check if error from validation
    if (error instanceof ValidationError) {
      return next({ status: 400, message: error?.errors?.[0] });
    }
    next(error);
  }
};

//@forget Password constroller
export const forgetPassword = async (req, res, next) => {
  try {
    //@get body from request
    const { email } = req.body;

    //@asume that email is uniqe
    const user = await User?.findOne({ where: { email: email } });
    if (!user) throw { status: 400, message: error.EMAIL_DOES_NOT_EXIS };

    //@generate access token
    const accessToken = helpers.createToken({
      id: user.id,
      role: user.role,
    });

    //@Send verification link to new email
    const mailOptions = {
      from: config.GMAIL,
      to: email,
      subject: "Reset Password",
      html: `<h1>Click <a href="http://localhost:5000/api/auth/forgetPassword/${accessToken}">here</a> to verify your account</h1>`,
    };

    helpers.transporter.sendMail(mailOptions, (error, info) => {
      if (error) throw error;
      console.log(`Email sent : ${info.response}`);
    });

    //@send response
    res
      .header("Authorization", `Bearer ${accessToken}`)
      .status(200)
      .json({ message: "Please check your email" });
  } catch (error) {
    next(error);
  }
};

//@Reset Password constroller
export const ressetPassword = async (req, res, next) => {
  const transaction = await db.sequelize.transaction();
  try {
    //@get body from request
    const { password, confirmPassword } = req.body;
    await Validation.ressetPassword.validate(req.body);

    //@asume front end send the request using header authorization
    //@the header authorization get from forget password url
    const token = req.headers.authorization?.split(" ")[1];
    const decodedToken = helpers.verifyToken(token);

    //@has new password
    const encryptedPassword = helpers.hashPassword(password);

    //@udpate password in database and isVerified set to 1
    await User?.update(
      { password: encryptedPassword },
      { where: { id: decodedToken?.id } }
    );

    //@send response
    res
      .header("Authorization", `Bearer ${token}`)
      .status(200)
      .json({ message: "Password resset successfully" });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    if (error instanceof ValidationError) {
      return next({ status: 400, message: error?.errors?.[0] });
    }
    next(error);
  }
};
