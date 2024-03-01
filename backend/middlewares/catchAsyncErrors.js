const catchAsyncErrors = (fn) => {
    // Return a middleware function that ensures the wrapped function returns a Promise
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

export default catchAsyncErrors;