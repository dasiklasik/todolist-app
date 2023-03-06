import axios from "axios";

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {'API-KEY': 'ef755321-4a0d-4233-91f3-788e73abd00e'},
})

const authAPI = {
    authMe: () => {
        return instance.get<ResponseType<{id: number, email: string, login: string}>>('auth/me')
    },
    login: (loginData: LoginDataType) => {
        return instance.post<ResponseType<{userId: number}>>('auth/login', loginData)
    },
    logout: () => {
        return instance.delete<ResponseType>('auth/login')
    },
}

type LoginDataType = {
    email: string
    password: string
    rememberMe: boolean
}

type ResponseType<D = {}> = {
    resultCode: number
    messages: [],
    data: D
}

