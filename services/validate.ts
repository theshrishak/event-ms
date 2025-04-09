export const validate = (schema, data) => {
    const { error } = schema.validate(data, { abortEarly: false });
    if(!error) return;
    const validationErrors = {};
    error.details.forEach((item) => {
        validationErrors[item.path[0]] = item.message;
    });
    return validationErrors;
}
