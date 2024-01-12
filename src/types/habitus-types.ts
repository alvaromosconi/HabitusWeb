export interface Habit {
    id: number
    user: User
    category: Category
    name: string
    description: string
    notificationTime: string
    selectedDaysSerialized: string
    state: HabitState
}

export interface Category {
    id: number
    name: string
}

export interface User {
    userId: string
    userName: string
}

export interface PostHabit {
    categoryId: number
    name: string
    description: string
    notificationTime: string
    selectedDays: string[]
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
    username: string
    password: string
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
