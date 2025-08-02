"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCastError = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const handleCastError = (err) => {
    const statusCode = 400;
    const errObjId = err.value;
    const message = `Invalid MongoDB ObjectID (${errObjId}). Please provide a valid ID`;
    return {
        statusCode,
        errObjId,
        message
    };
};
exports.handleCastError = handleCastError;
