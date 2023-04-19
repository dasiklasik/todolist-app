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

export const todolistAPI = {
    fetchTodolists: () => {
        return instance.get<Array<TodolistType>>('todo-lists').then(response => response.data)
    },
    createTodolist: (title: string) => {
        return instance.post<ResponseType<{item: TodolistType}>>('todo-lists', {title}).then(response => response.data)
    },
    deleteTodolist: (todolistId: string) => {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}`).then(response => response.data)
    },
    updateTodolist: (todolistId: string, title: string) => {
        return instance.put<ResponseType>(`todo-lists/${todolistId}`, {title}).then(response => response.data)
    }
}

type LoginDataType = {
    email: string
    password: string
    rememberMe: boolean
}

type TodolistType = {
    id: string
    addedDate: Date
    order: number
    title: string
}

type ResponseType<D = {}> = {
    resultCode: number
    messages: [],
    data: D
}

