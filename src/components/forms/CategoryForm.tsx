/* eslint-disable padded-blocks */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useEffect, useState } from 'react'
import { type Category, type PostCategory } from '../../types/habitus-types'
import HabitusAPI from '../../api/API'
import { type ZodType, z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

interface Props {
    categoryToUpdate?: Category
    onCategoriesChange: (newCategory: Category) => void
}

const CategoryForm = ({ categoryToUpdate, onCategoriesChange }: Props) => {

    interface FormData {
        name: string
    }

    const [category, setCategory] = useState<PostCategory>({
        name: ''
    })

    useEffect(() => {
        if (categoryToUpdate !== undefined) {
            setCategory({
                name: categoryToUpdate.name
            })
        }
    }, [categoryToUpdate])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        if (name && value !== undefined) {
            setCategory({ ...category, [name]: value })
        }
    }

    const CategorySchema: ZodType<FormData> = z.object({
        name: z
            .string()
            .trim()
            .min(3, { message: 'Name must be 3 or more characters long' })
            .max(30, { message: 'Name must be at most 30 characters long' })
    })

    const defaultValues: FormData = {
        name: categoryToUpdate?.name ?? ''
    }

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(CategorySchema),
        defaultValues
    })

    const onSubmitHandler = async (values: FormData) => {
        try {
            if (categoryToUpdate !== undefined) {
                onCategoriesChange(await HabitusAPI.updateCategory(category, categoryToUpdate.id))
            } else {
                onCategoriesChange(await HabitusAPI.postCategory(category))
            }
        } catch (e) {
            console.error(e)
        }
      }

    return (
        <div className="bg-gray-50 rounded-xl grid grid-cols-1 px-4 py-4 w-full h-full">
            <div className="flex justify-between flex-col h-max">
                <form onSubmit={handleSubmit(onSubmitHandler)} className="grid grid-cols-1 max-w-[400px] gap-y-4">
                    <div className="">
                        {errors.name && <span className=" text-sm text-red-600 mx-2 block">{ errors.name.message }</span>}
                        <input
                            type="text"
                            placeholder="Name"
                            value={category.name}
                            {...register('name')}
                            onChange={handleInputChange}
                            className="w-full h-10 border-b-2 border-gray-300 rounded-md focus:outline-none focus:border-[#D44316] indent-2"
                        />
                    </div>

                    <button
                        type="submit"
                        className={'text-lg font-bold rounded-full py-2 bg-[#E04717] text-white hover:bg-[#D44316] transition duration-300 hover:scale-90'}
                    >
                        Add
                    </button>

                </form>
            </div>
        </div>
    )
}

export default CategoryForm
