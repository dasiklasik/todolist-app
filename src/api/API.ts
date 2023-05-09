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
    },
}

export const tasksApi = {
    fetchTasks: (todolistId: string) => {
        return instance.get<FetchTasksResponseType>(`todo-lists/${todolistId}/tasks`).then(response => response.data)
    },
    addTask: (todolistId: string, title: string) => {
        return instance.post<ResponseType<{item: TaskType}>>(`todo-lists/${todolistId}/tasks`, {title})
            .then(response => response.data)
            .catch(error => error)
    },
    updateTask: (todolistId: string, taskId: string, taskData: UpdateTaskType) => {
        return instance.put<ResponseType<{item: TaskType}>>(`todo-lists/${todolistId}/tasks/${taskId}`, taskData).then(response => response.data)
    },
    deleteTask: (todolistId: string, taskId: string) => {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`).then(response => response.data)
    }
}

type LoginDataType = {
    email: string
    password: string
    rememberMe: boolean
}

export type TodolistType = {
    id: string
    addedDate: string
    order: number
    title: string
}

export type TaskType = {
    description: string
    title: string
    status: number
    priority: number
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}

type FetchTasksResponseType = {
    error: string | null
    totalCount: number
    items: TaskType[]
}

export type UpdateTaskType = {
    title: string
    description: string
    status: number
    priority: number
    startDate: string
    deadline: string
}

type ResponseType<D = {}> = {
    resultCode: number
    messages: [],
    data: D
}

