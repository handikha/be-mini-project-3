import User from '../../models/user.js';
import * as helpers from '../../helpers/index.js';
import * as Validation from './validation.js';
import * as config from '../../config/index.js';
import { ValidationError } from 'yup';
import * as error from '../../midlewares/error.handler.js';
import db from '../../models/index.js';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

//@register cashier controller
export const register = async (req, res, next) => {
  //@Sequelize transaction
  const transaction = await db.sequelize.transaction();
  const profileImg = req?.files?.['file'][0].filename;
  try {
    const { data } = req.body;
    const body = JSON.parse(data);
    await Validation.RegisterValidationSchema.validate(body);

    //@check if user is already registered
    const cashierExist = await User?.findOne({
      where: { username: body.username, email: body.email },
    });
    if (cashierExist) throw { status: 400, message: error.USER_ALREADY_EXISTS };

    //Give a cashier default password
    const defaultPassword = helpers.generateDefaultPassword();
    console.log(defaultPassword);

    //@encrypt user default password using bcrypt
    const encryptedPassword = helpers.hashPassword(defaultPassword);
    const cashier = await User.create({
      fullName: body.fullName,
      username: body.username,
      email: body.email,
      phone: body.phone,
      password: encryptedPassword,
      profileImg: 'public/images/profiles/' + profileImg,
    });

    //@delete data password before sending response
    delete cashier?.dataValues?.password;

    //@generate access token
    const accessToken = helpers.createToken({
      id: cashier?.dataValues?.id,
      role: cashier?.dataValues?.role,
    });

    //@Send verification link via email
    const template = fs.readFileSync(path.join(process.cwd(), 'templates', 'registerCashier.html'), 'utf8');
    const message = handlebars.compile(template)({
      fullName: body.fullName,
      username: body.username,
      defaultPassword,
      link: config.REDIRECT_URL + `/auth/change-password/${accessToken}`,
    });

    const mailOptions = {
      from: config.GMAIL,
      to: body.email,
      subject: 'Welcome to Tokopaedi',
      html: message,
    };

    helpers.transporter.sendMail(mailOptions, (error, info) => {
      if (error) throw error;
      console.log(`Email sent : ${info.response}`);
    });

    //@send response
    res
      .header('Authorization', `Bearer ${accessToken}`)
      .status(200)
      .json({ message: 'Register successful', data: cashier });

    // @commit transaction
    await transaction.commit();
  } catch (error) {
    // @rollback transaction
    await transaction.rollback();

    // @check if error from validation
    if (error instanceof ValidationError) {
      return next({ status: 400, message: error?.errors?.[0] });
    }
    next(error);
  }
};

//@Change status cashier
export const changeStatusCashier = async (req, res, next) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { id } = req.params;
    const { status } = req.query;

    //@Check if cashier exists
    const cashier = await User?.findOne({ where: { id: id } });
    if (!cashier) throw { status: 400, message: error.USER_DOES_NOT_EXISTS };

    //@update status to 2 (inactive cashier)
    await User?.update({ status: status }, { where: { id: id } });
    res.status(200).json({ message: 'Cashier status changed' });

    //@Send notification via email
    let templateEmail = '';
    let subject = '';
    if (status == 1) {
      templateEmail = 'activationAccount.html';
      subject = 'Re-Activate Account';
    } else {
      templateEmail = 'deactivateAccount.html';
      subject = 'Deactivate Account';
    }
    const template = fs.readFileSync(path.join(process.cwd(), 'templates', templateEmail), 'utf8');
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

//@get cashier info
export const getCashierInfo = async (req, res, next) => {
  try {
    //@get query params
    const { sort = 'ASC', page = 1 } = req.query;

    //@pagination
    const pageSize = 10;
    let offset = 0;
    let limit = pageSize;
    let currentPage = 1;

    if (page && !isNaN(page)) {
      currentPage = page;
      offset = (currentPage - 1) * pageSize;
    }

    //@get cashier info
    const { count, rows: users } = await User.findAndCountAll({
      where: { role: 2 },
      order: [['createdAt', sort]],
      offset,
      limit,
    });

    const totalPages = Math.ceil(count / pageSize);

    //@delete password information
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

//@update profile cashier
export const updateProfile = async (req, res, next) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { id } = req.params;
    const { fullName, username, email, phone } = req.body;

    //@Check if cashier exists
    const cashier = await User?.findOne({ where: { id: id } });
    if (!cashier) throw { status: 400, message: error.USER_DOES_NOT_EXISTS };

    await User?.update({ fullName: fullName, username: username, email: email, phone: phone }, { where: { id: id } });
    res.status(200).json({ message: 'Profile change successfully', data: cashier });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};
