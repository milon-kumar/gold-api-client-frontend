export const parseError = (error) => {

    if (error?.errors) {
        return error.errors;
    }

    return {
        general: error?.message || "Something went wrong",
    };
};
