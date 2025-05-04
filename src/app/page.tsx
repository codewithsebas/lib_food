'use client'

import { useState } from 'react'
import { FoodCard } from '@/components/FoodCard'
import { OrderForm } from '@/components/OrderForm'
import { CartItem, FoodItem } from '@/types/types'
import { toast } from 'sonner'
import { Logo } from '@/components/Logo'

const foodMenu = [
  {
    id: 1,
    name: 'Hamburguesa Clásica',
    price: 11000,
    description: 'Deliciosa hamburguesa con carne jugosa, queso cheddar, lechuga fresca y tomate.',
    ingredients: ['Carne artesanal', 'Queso cheddar', 'Lechuga', 'Tomate', 'Mayonesa', 'Pepinillos', 'Pan artesanal', 'Pimienta'],
    imageUrl: 'https://images.unsplash.com/photo-1607013251379-e6eecfffe234?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    showNotes: false,
    notes: ''
  },
  {
    id: 2,
    name: 'Hamburguesa BBQ',
    price: 13500,
    description: 'Jugosa hamburguesa con queso derretido, cebolla caramelizada y salsa BBQ.',
    ingredients: ['Carne artesanal', 'Queso', 'Cebolla caramelizada', 'Salsa BBQ', 'Kétchup', 'Pepinillos', 'Pan artesanal', 'Pimienta'],
    imageUrl: 'https://images.unsplash.com/photo-1728776448564-761583fc8bfb?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    showNotes: false,
    notes: ''
  },
  {
    id: 3,
    name: 'Hamburguer huevo y aguacate',
    price: 11000,
    description: 'Hamburguesa con huevo frito, aguacate cremoso y queso fundido.',
    ingredients: ['Carne artesanal', 'Huevo', 'Aguacate', 'Queso', 'Kétchup', 'Pepinillos', 'Pan artesanal', 'Pimienta'],
    imageUrl: 'https://images.unsplash.com/photo-1609796632543-65cdda96651c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    showNotes: false,
    notes: ''
  },
  {
    id: 4,
    name: 'Maracumango',
    price: 8000,
    description: 'Refrescante bebida de mango y maracuyá, perfecta para el calor.',
    ingredients: ['Mango', 'Maracuyá', 'Azúcar', 'Hielo', 'Agua o soda', 'Limón', 'Leche condensada'],
    imageUrl: 'https://images.unsplash.com/photo-1589581881796-05e8b66b8259?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    showNotes: false,
    notes: ''
  },
  {
    id: 5,
    name: 'Jugo Tropical',
    price: 8500,
    description: 'Refrescante jugo tropical con una mezcla de piña, mango y un toque de maracuyá.',
    ingredients: ['Piña', 'Mango', 'Papaya', 'Naranja Natural', 'Maracuyá', 'Azúcar', 'Agua', 'Hielo picado'],
    imageUrl: 'https://images.unsplash.com/photo-1576525384682-da7beb2be702?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    showNotes: false,
    notes: ''
  },
  {
    id: 6,
    name: 'Licuado de Naranja',
    price: 8000,
    description: 'Delicioso licuado cremoso de naranja natural con leche, una mezcla suave y refrescante.',
    ingredients: ['Naranja', 'Taza de Leche', 'Azúcar', 'Hielo'],
    imageUrl: 'https://images.unsplash.com/photo-1531127989214-8739ff1b550e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    showNotes: false,
    notes: ''
  }
];


export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([])

  const addToCart = (item: FoodItem) => {
    toast.success(`Pedido agregado - ${item.name}`);
    setCart((prev) => {
      const found = prev.find((i) => i.id === item.id);
      if (found) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          ...item,
          quantity: 1,
          notes: '',
          showNotes: false,
        },
      ];
    });
  };


  return (
    <main className="min-h-screen bg-gradient-to-r from-orange-200 to-orange-100 w-full mx-auto">
      <Logo />
      <div className='flex flex-col-reverse md:flex-row gap-6 justify-between  sm:p-6'>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 sm:gap-6 md:w-[80%]">
          {foodMenu.map(item => (
            <FoodCard
              key={item.id}
              item={item}
              onAdd={() => addToCart(item)}
              count={cart.find(i => i.id === item.id)?.quantity || 0}
            />

          ))}
        </div>

        <OrderForm cart={cart} setCart={setCart} />
      </div>
    </main>
  )
}
