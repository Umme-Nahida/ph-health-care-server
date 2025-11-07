
export type IUser = {
    name: string,
    email: string,
    password: string,
    profilePhoto?: string,
    address?: string,
    phoneNumber: string

}


export type IUserLogin = {
    emmail: string
}