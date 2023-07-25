import yup from "yup";

const createOrderSchema = yup.object().shape({
  customerName: yup.string().required("Customer name is required"),
  table: yup.number().required("Table is required"),
  userId: yup.number().required("User id is required"),
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

export { validate, createOrderSchema };
