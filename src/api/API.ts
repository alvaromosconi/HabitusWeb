/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/dot-notation */
import axios, { type AxiosResponse } from 'axios'
import { type LoginData, type Habit, type PostHabit, type Category, type PostCategory, type APIResponse, type RegisterData } from '../types/habitus-types'

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    timeout: 15000
})

const handleResponse = (response: AxiosResponse) => {
    try {
        if (response.status >= 200 && response.status < 300) {
            return response.data // Success
        } else {
            throw new Error(response.data)
        }
    } catch (error) {
        return error
    }
}

instance.interceptors.request.use(function (config) {
    const token = localStorage.getItem('token')
    config.headers.Authorization = (token != null) ? `Bearer ${token}` : ''
    return config
})

const requests = {
    get: async (url: string) => await instance.get(url).then(handleResponse),
    post: async (url: string, body: unknown) => await instance.post(url, body).then(handleResponse),
    put: async (url: string, body: unknown) => await instance.put(url, body).then(handleResponse),
    putWithoutBody: async (url: string) => await instance.put(url).then(handleResponse),
    delete: async (url: string) => await instance.delete(url).then(handleResponse)
}

// User
export const HabitusAPI = {
    login: async (post: LoginData): Promise<APIResponse> => {
        const response: APIResponse = await requests.post('users/login', post)
        if (response.success) {
            localStorage.setItem('user', JSON.stringify(response.resource))
            localStorage.setItem('token', response.resource.token)
            return response
        } else {
            throw new Error(response.message)
        }
    },
    register: async (post: RegisterData): Promise<APIResponse> => {
        const response: APIResponse = await requests.post('users/register', post)
        if (response.success) {
            return response
        } else {
            throw new Error(response.message)
        }
    },
     updateTelegramChatId: async (chatId: number): Promise<APIResponse> => await requests.putWithoutBody(`users?chatId=${chatId}`),

    // Habits
    getHabits: async (): Promise<Habit[]> => await requests.get('habits'),
    getHabit: async (id: number): Promise<Habit> => await requests.get(`habits/${id}`),
    postHabit: async (post: PostHabit): Promise<Habit> => await requests.post('habits', post),
    updateHabit: async (post: PostHabit, id: number): Promise<Habit> => await requests.put(`habits/${id}`, post),
    deleteHabit: async (id: number): Promise<Habit> => await requests.delete(`habits/${id}`),
    enableTelegramReminder: async (id: number): Promise<Habit> => await requests.putWithoutBody(`habits/enableTelegram/${id}`),

    // Categories
    getCategories: async (): Promise<Category[]> => await requests.get('categories'),
    getCategory: async (id: number): Promise<Category> => await requests.get(`categories/${id}`),
    postCategory: async (post: PostCategory): Promise<Category> => await requests.post('categories', post),
    updateCategory: async (post: PostCategory, id: number): Promise<Category> => await requests.put(`categories/${id}`, post),
    deleteCategory: async (id: number): Promise<Category> => await requests.delete(`categories/${id}`)
}

export default HabitusAPI
