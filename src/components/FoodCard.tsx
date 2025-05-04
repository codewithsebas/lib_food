'use client'

import { Button } from "@/components/ui/button"
import { Card, CardTitle } from "@/components/ui/card"
import { formatCOP } from "@/lib/utils/formatCurrency"
import { FoodItem } from "@/types/types"
import { ShoppingCart } from "lucide-react"
import Image from "next/image"

export function FoodCard({ item, onAdd, count = 0 }: { item: FoodItem, onAdd: () => void, count?: number }) {

    return (
        <Card className="transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl cursor-pointer py-0 bg-white rounded-none overflow-hidden sm:rounded-lg border-0">

            <div className="flex flex-col justify-between h-full">
                <div className="relative overflow-hidden sm:rounded-lg sm:rounded-b-none min-h-80 max-h-80">

                    <Image
                        width={10000}
                        height={10000}
                        priority
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover transform transition-all duration-300 hover:scale-105"
                    />
                </div>
                <div className="p-0">
                    <div className="px-4 pb-0 pt-2 flex flex-col gap-1">
                        <CardTitle className="text-2xl font-semibold text-orange-600">{item.name}</CardTitle>
                        <p className="text-gray-600 text-sm mb-2">{item.description}</p>

                        <div className="text-sm font-medium text-orange-700">
                            <span className="block mb-2 font-semibold  border-b border-gray-100 pb-2">Ingredientes:</span>
                            <ul className="list-none grid grid-rows-4 grid-flow-col text-gray-600">
                                {item.ingredients.map((ingredient, index) => (
                                    <li key={index}>{ingredient}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mt-4 bg-amber-100 p-3">
                        <p className="text-xl font-bold text-orange-900 ps-2">{formatCOP(item.price)}</p>
                        <Button
                            onClick={onAdd}
                            className="bg-orange-500 cursor-pointer text-white py-2 px-6 rounded-md hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                        >
                            <ShoppingCart />
                            Agregar
                            {count > 0 && (
                                <span className="bg-white text-orange-600 font-semibold w-5 h-5 flex items-center justify-center px-2 rounded-sm text-xs">
                                    {count}
                                </span>
                            )}
                        </Button>

                    </div>
                </div>
            </div>
        </Card>
    )
}
