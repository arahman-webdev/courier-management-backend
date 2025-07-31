
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleDuplicateError = (err: any) => {
    // const match = err.message.match(/"([^"]*)"/)

    // const duplicateEmail = match?.[1] || "This email"

    // statusCode = 400;
    // message = `${duplicateEmail} already exist`

    const statusCode = 400;
    
    const matchEmail = err.message.match(/"([^"]*)"/);
    const duplicateEmail = matchEmail?.[1] || "This email"
    const message = `${duplicateEmail} already exists`

    return {
        statusCode,
        message
    }
}