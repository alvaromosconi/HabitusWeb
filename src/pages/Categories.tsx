import { useEffect, useState } from 'react'
import { CategoriesTable } from '../components/CategoriesTable'
import CategoryForm from '../components/forms/CategoryForm'
import Modal from '../components/Modal'
import HabitusAPI from '../api/API'
import { type Category } from '../types/habitus-types'

export const Categories = () => {
    const [categories, setCategories] = useState<Category[]>([])
    const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(undefined)

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

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
        try {
            await HabitusAPI.deleteCategory(category.id)
            setCategories((prevCategories) => {
                const updatedCategories = prevCategories.filter((cat) => cat.id !== category.id)
                return updatedCategories
            })
        } catch (error) {
            console.error('Error deleting category:', error)
        }
    }

    useEffect(() => {
        void getCategories()
      }, [])

    const getCategories = async () => {
        try {
            const categoriesData = (await HabitusAPI.getCategories())
            setCategories(categoriesData)
        } catch (error) {
            console.error('Error fetching categories:', error)
        }
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
        <div className='mx-32 my-32'>

            <CategoriesTable categories={categories}
                             onAddButtonClick={handleAddButtonClick}
                             onEditButtonClick={handleEditButtonClick}
                             onDeleteButtonClick={handleDeleteButtonClick}
            />
            {isModalOpen && renderModalContent(
                <CategoryForm categoryToUpdate={selectedCategory}
                              onCategoriesChange={onCategoriesChange}/>
            ) }
        </div>
    )
}

export default Categories
