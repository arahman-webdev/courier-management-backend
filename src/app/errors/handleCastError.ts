/* eslint-disable @typescript-eslint/no-explicit-any */
export const handleCastError = (err:any)=>{
    const statusCode = 400;

    const errObjId = err.value;
    const message = `Invalid MongoDB ObjectID (${errObjId}). Please provide a valid ID`


    return {
        statusCode,
        errObjId,
        message
    }
}