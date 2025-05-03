'use client'

import { useState } from 'react'
import { FoodCard } from '@/components/FoodCard'
import { OrderForm } from '@/components/OrderForm'
import { CartItem, FoodItem } from '@/types/types'

const foodMenu = [
  {
    id: 1,
    name: 'Hamburguesa Clásica',
    price: 10000,
    description: 'Deliciosa hamburguesa con carne jugosa, queso cheddar, lechuga fresca y tomate.',
    ingredients: ['Carne', 'Queso cheddar', 'Lechuga', 'Tomate', 'Pan'],
    imageUrl: 'https://images.unsplash.com/photo-1607013251379-e6eecfffe234?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 2,
    name: 'Hamburguesa BBQ',
    price: 12500,
    description: 'Jugosa hamburguesa con queso derretido, cebolla caramelizada y salsa BBQ.',
    ingredients: ['Carne', 'Queso', 'Cebolla caramelizada', 'Salsa BBQ', 'Pan'],
    imageUrl: 'https://images.unsplash.com/photo-1728776448564-761583fc8bfb?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 3,
    name: 'Hamburguesa con huevo y aguacate',
    price: 10000,
    description: 'Hamburguesa con huevo frito, aguacate cremoso y queso fundido.',
    ingredients: ['Carne', 'Huevo', 'Aguacate', 'Queso', 'Pan'],
    imageUrl: 'https://images.unsplash.com/photo-1609796632543-65cdda96651c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 4,
    name: 'Maracumango',
    price: 6000,
    description: 'Refrescante bebida de mango y maracuyá, perfecta para el calor.',
    ingredients: ['Mango', 'Maracuyá', 'Azúcar', 'Hielo', 'Agua o soda'],
    imageUrl: 'https://images.unsplash.com/photo-1574891548685-3e13f565419a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 5,
    name: 'Fresa con leche',
    price: 7000,
    description: 'Bebida cremosa de fresa natural con leche y un toque dulce.',
    ingredients: ['Fresas', 'Leche', 'Azúcar', 'Hielo'],
    imageUrl: 'https://images.unsplash.com/photo-1611928237590-087afc90c6fd?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  }
];


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
