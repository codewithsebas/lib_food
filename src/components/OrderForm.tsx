'use client'

import { Dialog } from '@headlessui/react'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { OrderFormProps } from '@/types/types'
import { MapPinHouse, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react'
import { formatCOP } from '@/lib/utils/formatCurrency'
import { supabase } from '@/lib/supabase/supabase'
import { toast } from 'sonner'
import { LocationPicker } from './LocationPicker'

export function OrderForm({ cart, setCart }: OrderFormProps) {
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [location, setLocation] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => setLocation(`${coords.latitude},${coords.longitude}`),
            () => toast.error('No se pudo obtener tu ubicación')
        )
    }, [])

    const updateCartItem = (itemId: number, delta: number) => {
        setCart((prev) =>
            prev.map((item) =>
                item.id === itemId
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                    : item
            )
        )
    }

    const removeItem = (itemId: number) => {
        setCart((prev) => prev.filter((item) => item.id !== itemId))
    }

    const handleSubmit = async () => {
        const { error } = await supabase.from('orders').insert({
            name,
            phone,
            location,
            items: cart,
        })

        if (error) {
            toast.error('Error al enviar el pedido')
        } else {
            toast.success('¡Pedido enviado correctamente!')
            setIsModalOpen(false)
        }
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const FormContent = (
        <div className="bg-white flex flex-col gap-4 w-full p-4 sm:p-6 rounded-2xl shadow-md border border-gray-200">
            <h2 className="text-2xl font-semibold text-orange-500 flex gap-4 items-center">
                <ShoppingCart /> Tu Pedido
            </h2>

            <div className="space-y-2">
                {cart.length === 0 ? (
                    <p className="text-gray-500 text-sm">No has agregado productos aún.</p>
                ) : (
                    <>
                        {cart.map((item) => (
                            <div
                                key={item.id}
                                className="flex justify-between items-center sm:gap-3 text-sm border border-orange-100 bg-orange-50 rounded-lg px-2 sm:px-4 py-2"
                            >
                                <span className="font-medium text-orange-800 truncate min-w-10 max-w-24">
                                    {item.name}
                                </span>
                                <span className="text-orange-700 font-semibold text-nowrap">
                                    {formatCOP(item.price * item.quantity)} x{item.quantity}
                                </span>
                                <div className="flex gap-1">
                                    <div className="flex border border-orange-300 rounded-md overflow-hidden">
                                        <Button
                                            onClick={() => updateCartItem(item.id, -1)}
                                            className="py-1 text-sm bg-orange-50 hover:bg-orange-100 text-orange-700"
                                        >
                                            <Minus />
                                        </Button>
                                        <Button
                                            onClick={() => updateCartItem(item.id, 1)}
                                            className="py-1 text-sm bg-orange-50 hover:bg-orange-100 text-orange-700"
                                        >
                                            <Plus />
                                        </Button>
                                    </div>
                                    <Button
                                        onClick={() => removeItem(item.id)}
                                        className="bg-red-500 hover:bg-red-600 text-white text-xs"
                                    >
                                        <Trash2 />
                                    </Button>
                                </div>
                            </div>
                        ))}
                        <div className="flex justify-between items-center text-base font-semibold text-orange-700 border-t pt-3 mt-3">
                            <span>Total:</span>
                            <span>{formatCOP(total)}</span>
                        </div>
                    </>
                )}
            </div>

            <h2 className="text-xl font-semibold text-orange-500 flex gap-4 items-center">
                <MapPinHouse /> Tus datos
            </h2>

            <div className="space-y-3">
                <Input
                    type='text'
                    placeholder="Nombres completos"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-orange-50"
                />
                <Input
                    type='number'
                    placeholder="Número de Celular"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-orange-50"
                />
                <LocationPicker location={location} setLocation={setLocation} />

                <Button
                    className="w-full bg-orange-500 cursor-pointer hover:bg-orange-600 text-white font-bold"
                    onClick={handleSubmit}
                    disabled={cart.length === 0 || !name || !phone}
                >
                    Confirmar pedido
                </Button>
            </div>
        </div>
    )

    return (
        <>
            {/* Móvil: Botón flotante y modal */}
            <div className="sm:hidden fixed bottom-4 right-4 z-50">
                <Button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full px-6 py-3 shadow-lg"
                >
                    <ShoppingCart /> Mi Pedido {cart.length > 0 ? cart.length : ''}
                </Button>
            </div>

            <Dialog
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                className="sm:hidden fixed inset-0 z-50 flex items-center justify-center bg-black/20"
            >
                <Dialog.Panel className="bg-white w-[95%] max-h-[95%] overflow-y-auto rounded-2xl">
                    {FormContent}
                </Dialog.Panel>
            </Dialog>

            {/* Escritorio y tablet */}
            <div className="hidden sm:flex sticky top-5 h-fit sm:min-w-[50%] md:min-w-[40%] lg:min-w-[22%]">
                {FormContent}
            </div>
        </>
    )
}