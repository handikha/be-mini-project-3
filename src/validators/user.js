import yup from "yup";

const upgradeToAdminSchema = yup.object().shape({
  role: yup.number().required("Role is required"),
});

const validate = (schema, body) => {
  return schema.validate(body, { abortEarly: false }).catch((err) => {
    const errors = err.inner.reduce((acc, currentError) => {
      acc[currentError.path] = currentError.message;
      return acc;
    }, {});

    throw err.name === "ValidationError"
      ? {
        status: 400,
        message: "Validation error",
        errors: errors,
        errorsArray: err.inner.map((e) => e.message),
      }
      : err;
  });
};

export { validate, upgradeToAdminSchema };
