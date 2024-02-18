export default (controllerFunction) => (re, res, next) =>
    Promise.resolve(controllerFunction(req.res, next)).catch(next);