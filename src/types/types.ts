export interface FoodItem {
    id: number
    name: string
    price: number
    description: string
    ingredients: string[]
    imageUrl: string
  }
  
  
  export type CartItem = FoodItem & {
    quantity: number
  }

 export interface OrderFormProps {
      cart: CartItem[]
      setCart: React.Dispatch<React.SetStateAction<CartItem[]>>
  }