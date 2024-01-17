import { Card, Typography } from '@material-tailwind/react'
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/solid'
import { type Category } from '../types/habitus-types'

interface Props {
    categories: Category[]
    onAddButtonClick: () => void
    onEditButtonClick: (category: Category) => void
    onDeleteButtonClick: (category: Category) => void
}

const TABLE_HEAD = ['Name', '']

export function CategoriesTable ({ categories, onAddButtonClick, onEditButtonClick, onDeleteButtonClick }: Props) {
    return (
        <div>
            <button onClick={onAddButtonClick} className="bg-[#ade017] hover:bg-[#cdee6a] text-white font-bold py-2 px-4 rounded-full flex items-center mb-8  whitespace-nowrap min-w-fit">
                <PlusIcon stroke='currentColor' fill='none' viewBox="0 0 24 24" className='w-8 h-8 text-sm'/>
                Add Category
            </button>
            <Card className="h-full min-w-fit overflow-auto items-center rounded-3xl border-2" placeholder={''}>
                <table className="w-full table-auto text-left">
                    <thead className='rounded-3xl'>
                        <tr className='rounded-3xl'>
                            {TABLE_HEAD.map((head) => (
                                <th
                                    key={head}
                                    className="border-b border-blue-gray-100 bg-blue-gray-100 p-4 w-full"
                                >
                                    <Typography
                                        placeholder={''}
                                        variant="small"
                                        color="blue-gray"
                                        className="font-bold leading-none opacity-70"
                                    >
                                        {head}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((cat, index) => {
                            const isLast = index === categories.length - 1
                            const classes = isLast ? 'p-4' : 'p-4 border-b border-blue-gray-50'

                            return (
                                <tr key={cat.name} className='even:bg-blue-gray-50/50'>
                                    <td className={classes}>
                                        <Typography
                                            placeholder={''}
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal"
                                        >
                                        {cat.name}
                                        </Typography>
                                    </td>
                                    <td className={classes}>
                                        <Typography
                                            placeholder={''}
                                            as="a"
                                            href="#"
                                            variant="small"
                                            color="blue-gray"
                                            className="font-medium"
                                        >
                                            <div className='flex'>
                                                <button type="button" onClick={ () => { onEditButtonClick(cat) } } className='self-end mx-2 animate-scaleButton'>
                                                    <PencilIcon className='w-6 h-6'/>
                                                </button>
                                                <button type="button" onClick={() => { onDeleteButtonClick(cat) }} className='self-end mx-2 animate-scaleButton'>
                                                    <TrashIcon className='w-6 h-6'/>
                                                </button>
                                            </div>
                                        </Typography>
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                </table>
            </Card>
        </div>
    )
  }
