'use client'

import { useState } from 'react'
import { FoodCard } from '@/components/FoodCard'
import { OrderForm } from '@/components/OrderForm'
import { CartItem, FoodItem } from '@/types/types'

const foodMenu: FoodItem[] = [
  {
    id: 1,
    name: 'Hamburguesa',
    price: 8000,
    description: 'Deliciosa hamburguesa con carne jugosa, queso derretido, lechuga fresca y tomate.',
    ingredients: ['Carne', 'Queso', 'Lechuga', 'Tomate', 'Pan'],
    imageUrl: 'https://images.unsplash.com/photo-1607013251379-e6eecfffe234?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 2,
    name: 'Pizza',
    price: 10000,
    description: 'Pizza de masa fina con salsa de tomate, queso mozzarella y toppings a elección.',
    ingredients: ['Masa', 'Salsa de tomate', 'Queso mozzarella', 'Pepperoni'],
    imageUrl: 'https://images.unsplash.com/photo-1607013251379-e6eecfffe234?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 3,
    name: 'Taco',
    price: 5000,
    description: 'Taco relleno de carne asada con cebolla, cilantro y salsa de guacamole.',
    ingredients: ['Carne asada', 'Cebolla', 'Cilantro', 'Guacamole', 'Tortilla'],
    imageUrl: 'https://images.unsplash.com/photo-1607013251379-e6eecfffe234?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 4,
    name: 'Hamburguesa',
    price: 8000,
    description: 'Deliciosa hamburguesa con carne jugosa, queso derretido, lechuga fresca y tomate.',
    ingredients: ['Carne', 'Queso', 'Lechuga', 'Tomate', 'Pan'],
    imageUrl: 'https://images.unsplash.com/photo-1607013251379-e6eecfffe234?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 5,
    name: 'Pizza',
    price: 10000,
    description: 'Pizza de masa fina con salsa de tomate, queso mozzarella y toppings a elección.',
    ingredients: ['Masa', 'Salsa de tomate', 'Queso mozzarella', 'Pepperoni'],
    imageUrl: 'https://images.unsplash.com/photo-1607013251379-e6eecfffe234?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 6,
    name: 'Taco',
    price: 5000,
    description: 'Taco relleno de carne asada con cebolla, cilantro y salsa de guacamole.',
    ingredients: ['Carne asada', 'Cebolla', 'Cilantro', 'Guacamole', 'Tortilla'],
    imageUrl: 'https://images.unsplash.com/photo-1607013251379-e6eecfffe234?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
]

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([])

  const addToCart = (item: FoodItem) => {
    setCart(prev => {
      const found = prev.find(i => i.id === item.id)
      if (found) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  return (
    <main className="min-h-screen bg-gradient-to-r from-orange-200 to-orange-100 sm:p-6 w-full mx-auto">
      <div className='flex flex-col-reverse md:flex-row gap-6 justify-between'>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 sm:gap-6 md:w-[80%]">
          {foodMenu.map(item => (
            <FoodCard key={item.id} item={item} onAdd={() => addToCart(item)} />
          ))}
        </div>

        <OrderForm cart={cart} setCart={setCart} />
      </div>
    </main>
  )
}
