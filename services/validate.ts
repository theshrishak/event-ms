export const validate = (schema: any, data: any) => {
    const { error } = schema.validate(data, { abortEarly: false });
    if(!error) return;
    const validationErrors: any = {};
    error.details.forEach((item: any) => {
        validationErrors[item.path[0]] = item.message;
    });
    return validationErrors;
}
