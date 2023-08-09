import conf from "@/conf/config";
import { Client, Account, ID } from 'appwrite'

type CreateUserAccount = {
    email: String,
    password: String,
    name: String
}

type LoginUserAccount = {
    email: String,
    password: String,
}

const appwriteClient = new Client();

appwriteClient.setEndpoint(conf.appwriteUrl).setProject(conf.appwriteProjectId)

export const account = new Account(appwriteClient)

export class AppwriteService {
    //create a new record of user inside appwrite

    async createUserAccount({ email, password, name }: CreateUserAccount) {

        try {
            const userAccount = await account.create(ID.unique(), email, password, name)

            if (userAccount) {
                return this.login({ email, password })
            } else {
                return userAccount
            }

        } catch (err: any) {
            throw err
        }

    }

    async login({ email, password }: LoginUserAccount) {

        try {
            return await account.createEmailSession(email, password)

        } catch (err: any) {
            throw err
        }

    }

    async isLoggedIn(): Promise<boolean> {

        try {
            const data = await this.getCurrentUser()
            return Boolean(data)
        } catch (err) {
            throw err
        }

        return false
    }

    async getCurrentUser() {

        try {
            return account.get()
        } catch (err) {
            console.log("getCurrentUser error: " + err)
        }

        return null
    }

    async logout() {
        try {
            return await account.deleteSession('current')
        } catch (err: any) {
            throw err
        }
    }

}

const appwriteService = new AppwriteService()

export default appwriteService