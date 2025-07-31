
import dotenv from "dotenv"

dotenv.config()


interface EnvConfig {
    PORT: string,
    DB_URL: string,
    NODE_ENV: "development" | "production",
    BCRYPT_SALT_ROUNDS: string,
    JWT_ACCESS_SECRET: string,
    JWT_EXPIRATION: string,
    JWT_REFRESH_SECRET: string,
    JWT_REFRESH_EXPIRATION: string,
    ADMIN_EMAIL: string,
    ADMIN_PASSWORD: string,


}




const loadEnvVariables = (): EnvConfig => {
    const requiredEnvVariables: string[] = ["PORT", "DB_URL", "NODE_ENV", "BCRYPT_SALT_ROUNDS", "JWT_ACCESS_SECRET", "JWT_EXPIRATION", "JWT_REFRESH_SECRET", "JWT_REFRESH_EXPIRATION", "ADMIN_EMAIL", "ADMIN_PASSWORD",
    ];


    requiredEnvVariables.forEach(key => {
        if (!process.env[key]) {
            throw new Error(`Missing require environment variabl ${key}`)
        }
    })

    return {
        PORT: process.env.PORT as string,
        DB_URL: process.env.DB_URL as string,
        NODE_ENV: process.env.NODE_ENV as "development" | "production",
        BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS as string,
        JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
        JWT_EXPIRATION: process.env.JWT_EXPIRATION as string,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
        JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION as string,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL as string,
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD as string


    }
}

export const envVars = loadEnvVariables()