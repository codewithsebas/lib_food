export interface FoodItem {
    id: number
    name: string
    price: number
    description: string
    ingredients: string[]
    imageUrl: string
    notes: string
  }
  
  export type CartItem = FoodItem & {
    quantity: number
    showNotes: boolean
  }

 export interface OrderFormProps {
      cart: CartItem[]
      setCart: React.Dispatch<React.SetStateAction<CartItem[]>>
  }