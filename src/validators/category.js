import yup from "yup";

const createCategorySchema = yup.object().shape({
  name: yup.string().required("Name is required"),
});

const updateCategorySchema = yup.object().shape({
  name: yup.string().required("Name is required"),
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

export { validate, createCategorySchema, updateCategorySchema };
