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
    name: 'Salpicón de Frutas - Mini',
    price: 9000,
    description: 'Una explosión de frescura en tamaño mini 🍍🍓 Ideal para calmar el antojo.',
    ingredients: [],
    imageUrl: 'https://carolisterchefandgardener.com/wp-content/uploads/2023/06/salpicon-colombiano-scaled.jpg',
    showNotes: false,
    notes: ''
  },
  {
    id: 2,
    name: 'Salpicón de Frutas 10oz',
    price: 11000,
    description: 'El equilibrio perfecto entre sabor y frescura 🍓🥭 Nuestro tamaño clásico para disfrutar una mezcla vibrante de frutas tropicales.',
    ingredients: [],
    imageUrl: '',
    showNotes: false,
    notes: ''
  },
  {
    id: 3,
    name: 'Salpicón con Helado - Mini',
    price: 14000,
    description: '¡El favorito para compartir o para los más fruteros! 🍉🍌 Una porción generosa llena de sabor, energía y frescura en cada cucharada.',
    ingredients: [],
    imageUrl: '',
    showNotes: false,
    notes: ''
  },
  {
    id: 4,
    name: 'Salpicón con Helado 10oz',
    price: 14000,
    description: '¡El favorito para compartir o para los más fruteros! 🍉🍌 Una porción generosa llena de sabor, energía y frescura en cada cucharada.',
    ingredients: ['Piña', 'Papaya', 'Sandía', 'Mango', 'Manzana', 'Banano', 'Fresas', 'Uvas', 'Jugo de Sandía', 'Helado de Vainilla'],
    imageUrl: '',
    showNotes: false,
    notes: ''
  },
  {
    id: 5,
    name: 'Salpicón con Helado y Gomitas Mini',
    price: 14000,
    description: '¡Frescura y sabor en cada cucharada! Frutas, helado y gomitas, la combinación perfecta para disfrutar al máximo.🍉',
    ingredients: [],
    imageUrl: '',
    showNotes: false,
    notes: ''
  },
  {
    id: 6,
    name: 'Salpicón con Helado y Gomitas 10oz',
    price: 14000,
    description: 'El sabor de la frescura en cada bocado. Frutas, helado cremoso y gomitas en una porción ideal para compartir. 🍉',
    ingredients: [],
    imageUrl: '',
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
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 w-full mx-auto">
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
