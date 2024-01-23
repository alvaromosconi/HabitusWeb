export interface Habit {
    id: number
    user: User
    category: Category
    name: string
    description: string
    notificationTime: string
    selectedDays: WeekDays[]
    notifyByTelegram: boolean
    state: HabitState
}

export interface Category {
    id: number
    name: string
}

export interface User {
    id: string
    userName: string
    phoneNumber: string
    chatId: number
    token: string
}

export interface PostHabit {
    categoryId: number | undefined
    name: string
    description: string
    notificationTime: string
    selectedDays: WeekDays[]
    state: HabitState
}

export interface PostCategory {
    name: string
}
export interface HabitContextType {
    habitForm: Habit
    saveTodo: (habits: Habit) => void
    updateTodo: (id: number) => void
}

export interface LoginData {
    email: string
    password: string
}

export interface RegisterData {
    email: string
    password: string
}

export interface APIResponse {
    success: boolean
    message: string
    resource: any
}

export enum WeekDays {
    Monday = 'Monday',
    Tuesday = 'Tuesday',
    Wednesday = 'Wednesday',
    Thursday = 'Thursday',
    Friday = 'Friday',
    Saturday = 'Saturday',
    Sunday = 'Sunday'
  }

export enum HabitState { Active = 'Active', Inactive = 'Inactive' }
