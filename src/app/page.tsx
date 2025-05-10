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
    price: 7500,
    description: 'Una explosión de frescura en tamaño mini 🍍🍓 Ideal para calmar el antojo.',
    ingredients: [],
    imageUrl: 'https://carolisterchefandgardener.com/wp-content/uploads/2023/06/salpicon-colombiano-scaled.jpg',
    showNotes: false,
    notes: ''
  },
  {
    id: 2,
    name: 'Salpicón de Frutas - Grande',
    price: 9500,
    description: 'El equilibrio perfecto entre sabor y frescura 🍓🥭 Nuestro tamaño clásico para disfrutar una mezcla vibrante de frutas tropicales.',
    ingredients: [],
    imageUrl: 'https://res.cloudinary.com/dovavvnjx/image/upload/v1746899158/ChatGPT_Image_May_10_2025_12_45_37_PM_ctyhpn.png',
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
