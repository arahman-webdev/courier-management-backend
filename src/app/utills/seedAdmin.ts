/* eslint-disable no-console */

import { envVars } from "../config/env";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";

import { User } from "../modules/user/user.model";
import bcrypt from "bcryptjs";


export const seedAdmin = async () => {

    try {
        const isSuperAdminExist = await User.findOne({ email: envVars.ADMIN_EMAIL })

        if (isSuperAdminExist) {

            return console.log("Admin already exist")

        }

        console.log("Trying to create super admin..............")


        const hashAdminPass = await bcrypt.hash(envVars.ADMIN_PASSWORD as string, Number(envVars.BCRYPT_SALT_ROUNDS));



        const authProvider: IAuthProvider = {
            provider: "credential",
            providerId: envVars.ADMIN_EMAIL
        }

        const payload: IUser = {
            name: "Admin",
            role: Role.ADMIN,
            email: envVars.ADMIN_EMAIL,
            password: hashAdminPass,
            isVerified: true,
            auth: [authProvider]
        }

        const superAdmin = await User.create(payload)

        console.log("Admin created successfully \n")
        console.log(superAdmin)
    } catch (error) {
        console.log(error)
    }
}