"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDuplicateError = void 0;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleDuplicateError = (err) => {
    // const match = err.message.match(/"([^"]*)"/)
    // const duplicateEmail = match?.[1] || "This email"
    // statusCode = 400;
    // message = `${duplicateEmail} already exist`
    const statusCode = 400;
    const matchEmail = err.message.match(/"([^"]*)"/);
    const duplicateEmail = (matchEmail === null || matchEmail === void 0 ? void 0 : matchEmail[1]) || "This email";
    const message = `${duplicateEmail} already exists`;
    return {
        statusCode,
        message
    };
};
exports.handleDuplicateError = handleDuplicateError;
