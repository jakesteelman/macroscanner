'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ThumbsUp, ThumbsDown } from 'lucide-react'

interface Prediction {
    id: string
    food: string
    amount: number
    unit: string
    calories: number
    protein: number
    carbs: number
    fat: number
    imageIds: string[]
}

interface Image {
    id: string
    name: string
    url: string
}

interface PredictionReviewProps {
    prediction: Prediction
    images: Image[]
}

export function PredictionReview({ prediction, images }: PredictionReviewProps) {
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
    const [editedFood, setEditedFood] = useState(prediction.food)
    const [editedAmount, setEditedAmount] = useState(prediction.amount)
    const [editedUnit, setEditedUnit] = useState(prediction.unit)

    const handleThumbsUp = () => setIsCorrect(true)
    const handleThumbsDown = () => setIsCorrect(false)

    const handleSave = () => {
        // In a real app, you'd save the changes to your database here
        console.log('Saving changes:', { editedFood, editedAmount, editedUnit })
        setIsCorrect(true)
    }

    return (
        <div className="bg-white shadow-md rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">{prediction.food}</h3>
                <div className="space-x-2">
                    <Button
                        size="sm"
                        variant={isCorrect === true ? 'default' : 'outline'}
                        onClick={handleThumbsUp}
                    >
                        <ThumbsUp className="w-4 h-4" />
                    </Button>
                    <Button
                        size="sm"
                        variant={isCorrect === false ? 'default' : 'outline'}
                        onClick={handleThumbsDown}
                    >
                        <ThumbsDown className="w-4 h-4" />
                    </Button>
                </div>
            </div>
            <p className="text-gray-600 mb-2">
                {prediction.amount} {prediction.unit}
            </p>
            <p className="text-gray-800">
                {prediction.calories} cal | {prediction.protein}g protein | {prediction.carbs}g carbs | {prediction.fat}g fat
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
                {prediction.imageIds.map((imageId) => {
                    const image = images.find((img) => img.id === imageId)
                    return image ? (
                        <span key={imageId} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            {image.name}
                        </span>
                    ) : null
                })}
            </div>
            {isCorrect === false && (
                <div className="mt-4 space-y-2">
                    <Input
                        value={editedFood}
                        onChange={(e) => setEditedFood(e.target.value)}
                        placeholder="Correct food name"
                    />
                    <div className="flex space-x-2">
                        <Input
                            type="number"
                            value={editedAmount}
                            onChange={(e) => setEditedAmount(Number(e.target.value))}
                            placeholder="Amount"
                        />
                        <Input
                            value={editedUnit}
                            onChange={(e) => setEditedUnit(e.target.value)}
                            placeholder="Unit"
                        />
                    </div>
                    <Button onClick={handleSave}>Save Changes</Button>
                </div>
            )}
        </div>
    )
}

