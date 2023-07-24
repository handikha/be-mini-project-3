import * as Yup from "yup";

export const RegisterValidationSchema = Yup.object({
  fullName: Yup.string().required("Username is required"),
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().required("Phone is required"),
});

export const LoginValidationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

export const changePasswordSchema = Yup.object({
  currentPassword: Yup.string()
    .min(6, "Password must be at least 6 characters.")
    .matches(/^[a-zA-Z0-9]+$/, "Password must be alphanumeric.")
    .required("Current password is required."),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters.")
    .matches(/^[a-zA-Z0-9]+$/, "Password must be alphanumeric.")
    .notOneOf(
      [Yup.ref("currentPassword")],
      "New password must be different from current password."
    )
    .required("New password is required."),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match.")
    .required("Confirm password is required."),
});

export const ressetPasswordSchema = Yup.object({
  password: Yup.string()
    .min(6, "Password must be at least 6 characters.")
    .matches(/^[a-zA-Z0-9]+$/, "Password must be alphanumeric.")
    .notOneOf(
      [Yup.ref("currentPassword")],
      "New password must be different from current password."
    )
    .required("New password is required."),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match.")
    .required("Confirm password is required."),
});
