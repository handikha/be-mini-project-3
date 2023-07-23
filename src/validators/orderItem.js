import yup from "yup";

const createOrderItemSchema = yup.object().shape({
    orderId: yup.number().required("Order id is required"),
    productId: yup.number().required("Product id is required"),
    quantity: yup.number().required("Quantity is required"),
});

const updateOrderItemSchema = yup.object().shape({
    orderId: yup.number().required("Order id is required"),
    productId: yup.number().required("Product id is required"),
    quantity: yup.number().required("Quantity is required"),
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

export {
    validate,
    createOrderItemSchema,
    updateOrderItemSchema

}