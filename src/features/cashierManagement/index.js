import User from "../../models/user.js";
import * as helpers from "../../helpers/index.js";
import * as Validation from "./validation.js";
import * as config from "../../config/index.js";
import { ValidationError } from "yup";
import * as error from "../../midlewares/error.handler.js";
import db from "../../models/index.js";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";

// @register cashier controller
export const register = async (req, res, next) => {
  // @Sequelize transaction
  const transaction = await db.sequelize.transaction();
  try {
    const {
      fullName,
      username,
      email,
      phone,
    } = req.body;
    await Validation.RegisterValidationSchema.validate(req.body);

    // @check if user is already registered
    const cashierExist = await User?.findOne({
      where: {
        username,
        email,
      },
    });
    if (cashierExist) {
      throw {
        status: 400,
        message: error.USER_ALREADY_EXISTS,
      };
    }

    //Give a cashier default password
    const defaultPassword = helpers.generateDefaultPassword();
    console.log(defaultPassword);

    // @encrypt user default password using bcrypt
    const encryptedPassword = helpers.hashPassword(defaultPassword);
    const cashier = await User.create({
      fullName,
      username,
      email,
      phone,
      password: encryptedPassword,
    });

    // @delete data password before sending response
    delete cashier?.dataValues?.password;

    // @generate access token
    const accessToken = helpers.createToken({
      id: cashier?.dataValues?.id,
      role: cashier?.dataValues?.role,
    });

    // @send response
    res
      .header("Authorization", `Bearer ${accessToken}`)
      .status(200)
      .json({
        message: "Register successful",
        data: cashier,
      });

    // @Send verification link via email
    const template = fs.readFileSync(
      path.join(process.cwd(), "templates", "registerCashier.html"),
      "utf8",
    );
    const message = handlebars.compile(template)({
      fullName,
      username,
      defaultPassword,
      link: config.REDIRECT_URL + `/auth/verify/${accessToken}`,
    });

    const mailOptions = {
      from: config.GMAIL,
      to: email,
      subject: "Welcome to Tokopaedi",
      html: message,
    };

    helpers.transporter.sendMail(mailOptions, (error, info) => {
      if (error) throw error;
      console.log(`Email sent : ${info.response}`);
    });

    // @commit transaction
    await transaction.commit();
  } catch (error) {
    // @rollback transaction
    await transaction.rollback();

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

// @Change status cashier
export const changeStatusCashier = async (req, res, next) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { id } = req.params;
    const { status } = req.query;

    // @Check if cashier exists
    const cashier = await User?.findOne({ where: { id: id } });
    if (!cashier) {
      throw {
        status: 400,
        message: error.USER_DOES_NOT_EXISTS,
      };
    }

    // @update status to 2 (inactive cashier)
    await User?.update({ status: status }, { where: { id: id } });
    res.status(200).json({ message: "Cashier status changed" });

    // @Send notification via email
    let templateEmail = "";
    let subject = "";
    if (status == 1) {
      templateEmail = "activationAccount.html";
      subject = "Re-Activate Account";
    } else {
      templateEmail = "deactivateAccount.html";
      subject = "Deactivate Account";
    }
    const template = fs.readFileSync(
      path.join(process.cwd(), "templates", templateEmail),
      "utf8",
    );
    const message = handlebars.compile(template)({
      fullName: cashier?.dataValues?.fullName,
    });

    const mailOptions = {
      from: config.GMAIL,
      to: cashier?.dataValues?.email,
      subject: subject,
      html: message,
    };

    helpers.transporter.sendMail(mailOptions, (error, info) => {
      if (error) throw error;
      console.log(`Email sent : ${info.response}`);
    });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

// @get cashier info
export const getCashierInfo = async (req, res, next) => {
  try {
    // @get query params
    const {
      status = 1,
      sort = "ASC",
      page = 1,
    } = req.query;

    // @pagination
    const pageSize = 9;
    let offset = 0;
    let limit = pageSize;
    let currentPage = 1;

    if (page && !isNaN(page)) {
      currentPage = page;
      offset = (currentPage - 1) * pageSize;
    }

    // @get cashier info
    const {
      count,
      rows: users,
    } = await User.findAndCountAll({
      where: {
        status: parseInt(status),
        role: 2,
      },
      order: [["createdAt", sort]],
      offset,
      limit,
    });

    const totalPages = Math.ceil(count / pageSize);

    // @delete password information
    delete users[0]?.dataValues?.password;

    res.status(200).json({
      totalCashier: count,
      cashierLimit: limit,
      totalPages: totalPages,
      currentPage: parseInt(currentPage),
      result: users,
    });
  } catch (error) {
    next(error);
  }
};
