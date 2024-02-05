import { useEffect, useState } from 'react'
import { CategoriesTable } from '../components/CategoriesTable'
import CategoryForm from '../components/forms/CategoryForm'
import Modal from '../components/Modal'
import HabitusAPI from '../api/API'
import { type Category } from '../types/habitus-types'
import { ColorRing } from 'react-loader-spinner'

export const Categories = () => {
    const [categories, setCategories] = useState<Category[]>([])
    const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(undefined)

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const onCategoriesChange = (newCategory: Category) => {
        const existingHabitIndex = categories.findIndex((cat) => cat.id === newCategory.id)
        if (existingHabitIndex === -1) {
            setCategories([...categories, newCategory])
        } else {
            categories[existingHabitIndex] = newCategory
            setCategories(categories)
        }
        setIsModalOpen(false)
    }

    const handleAddButtonClick = () => {
        setIsModalOpen(true)
    }

    const handleEditButtonClick = (category: Category) => {
        setSelectedCategory(category)
        setIsModalOpen(true)
    }

    const handleDeleteButtonClick = async (category: Category) => {
        setIsLoading(true)
        try {
            await HabitusAPI.deleteCategory(category.id)
            setCategories((prevCategories) => {
                const updatedCategories = prevCategories.filter((cat) => cat.id !== category.id)
                return updatedCategories
            })
        } catch (error) {
            console.error('Error deleting category:', error)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        void getCategories()
      }, [])

    const getCategories = async () => {
        setIsLoading(true)
        try {
            const categoriesData = (await HabitusAPI.getCategories())
            setCategories(categoriesData)
        } catch (error) {
            console.error('Error fetching categories:', error)
        }
        setIsLoading(false)
    }

    const renderModalContent = (children: React.ReactNode) => {
        return (
            <Modal open={true} onClose={closeModal}>
                {children}
            </Modal>
        )
    }

    const closeModal = () => {
        setIsModalOpen(false)
    }

    return (
        <div className='mx-16 my-16'>
            {isLoading
            ? <div className='fixed top-0 left-0 w-full h-full bg-[rgba(255, 255, 255, 0.7)] flex items-center justify-center z-999'>
                    <ColorRing width={100} height={100}/>
                </div>
                : ''
            }
            <CategoriesTable categories={categories}
                             onAddButtonClick={handleAddButtonClick}
                             onEditButtonClick={handleEditButtonClick}
                             onDeleteButtonClick={() => handleDeleteButtonClick}
            />
            {isModalOpen && renderModalContent(
                <CategoryForm categoryToUpdate={selectedCategory}
                              onCategoriesChange={onCategoriesChange}/>
            ) }
        </div>
    )
}

export default Categories
