import yup from "yup";

const registerSchema = yup.object().shape({
    fullName: yup.string().required("Full name is required"),
    username: yup.string().required("Username is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phone: yup.string().required("Phone is required"),
    password: yup.string()
        .min(6, "Password must be at least 6 characters.")
        .required("Password is required."),
    confirmPassword: yup.string()
        .oneOf([yup.ref("password"), null], "Passwords must match.")
        .required("Confirm password is required."),
});

const loginSchema = yup.object().shape({
    username: yup.string().required("Username is required"),
    password: yup.string().required("Password is required"),
});

const changePasswordSchema = yup.object().shape({
    currentPassword: yup.string()
        .min(6, "Password must be at least 6 characters.")
        .required("Current password is required."),
    password: yup.string()
        .min(6, "Password must be at least 6 characters.")
        .matches(/^[a-zA-Z0-9]+$/, "Password must be alphanumeric.")
        .notOneOf(
            [yup.ref("currentPassword")],
            "New password must be different from current password."
        )
        .required("New password is required.")
});

const resetPasswordSchema = yup.object().shape({
    password: yup.string()
        .min(6, "Password must be at least 6 characters.")
        .notOneOf(
            [yup.ref("currentPassword")],
            "New password must be different from current password."
        )
        .required("New password is required."),
    confirmPassword: yup.string()
        .oneOf([yup.ref("password"), null], "Passwords must match.")
        .required("Confirm password is required."),
});

const validate = (schema, body) => {
    return schema.validate(body, {abortEarly: false})
        .catch((err) => {
            const errors = err.inner.reduce((acc, currentError) => {
                acc[currentError.path] = currentError.message;
                return acc;
            }, {});

            throw err.name === "ValidationError"
                ? {status: 400, message: "Validation error", errors: errors, errorsArray: err.inner.map(e => e.message)}
                : err;
        });
};

export default {
    registerSchema,
    loginSchema,
    changePasswordSchema,
    resetPasswordSchema,
    validate
}