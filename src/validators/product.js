import yup from "yup";

const createProductSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    description: yup.string().required("Description is required"),
    price: yup.number().required("Price is required"),
    image: yup.string().required("Image is required"),
});

const updateProductSchema = yup.object().shape({
    name: yup.string(),
    description: yup.string(),
    price: yup.number(),
    image: yup.string()
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
    validate,
    createProductSchema,
    updateProductSchema
};
