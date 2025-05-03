'use client'

import { Dialog } from '@headlessui/react'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { OrderFormProps } from '@/types/types'
import { MapPinHouse, Minus, Plus, ShoppingCart, Trash2, X } from 'lucide-react'
import { formatCOP } from '@/lib/utils/formatCurrency'
import { supabase } from '@/lib/supabase/supabase'
import { toast } from 'sonner'
import { LocationPicker } from './LocationPicker'

export function OrderForm({ cart, setCart }: OrderFormProps) {
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [location, setLocation] = useState('')
    const [deliveryDate, setDeliveryDate] = useState('')
    const [deliveryTime, setDeliveryTime] = useState('')

    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        if (typeof window !== 'undefined' && 'geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                ({ coords }) => setLocation(`${coords.latitude},${coords.longitude}`),
                () => toast.error('No se pudo obtener tu ubicación')
            );
        }
    }, []);

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
        if (!name || !phone || !location || !deliveryDate || !deliveryTime || cart.length === 0) {
            toast.error('Por favor completa todos los campos');
            return;
        }

        const { error } = await supabase.from('orders').insert({
            name,
            phone,
            location,
            items: cart,
            date: deliveryDate,
            time: deliveryTime
        });

        if (error) {
            toast.error('Error al enviar el pedido');
        } else {
            toast.success('¡Pedido enviado correctamente!');
            setIsModalOpen(false);
            setCart([]);
            setName('');
            setPhone('');
            setDeliveryDate('');
            setDeliveryTime('');
        }
    };


    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const FormContent = (
        <div className="relative bg-white flex flex-col gap-4 w-full p-4 sm:p-6 rounded-2xl shadow-md border border-gray-200">
            <button className='absolute top-3 right-3 flex sm:hidden text-orange-500' onClick={() => setIsModalOpen(false)}>
                <X />
            </button>
            <h2 className="text-2xl font-semibold text-orange-500 flex gap-4 items-center">
                <ShoppingCart /> Tu Pedido
            </h2>

            <div className="space-y-2">
                {cart.length === 0 ? (
                    <p className="text-gray-500 text-sm">No has agregado productos aún.</p>
                ) : (
                    <>
                        {cart.map((item, index) => (
                            <div
                                key={item.id}
                                className="flex flex-col gap-2 border border-orange-100 bg-orange-50 rounded-lg px-2 sm:px-4 py-2"
                            >
                                <div className="flex justify-between items-center w-full">
                                    <span className="font-medium text-orange-800 truncate min-w-10 max-w-36">
                                        {item.name}
                                    </span>
                                    <span className="text-orange-700 font-semibold text-nowrap">
                                        {formatCOP(item.price * item.quantity)} x{item.quantity}
                                    </span>
                                </div>




                                {item.showNotes && (
                                    <input
                                        type="text"
                                        placeholder="Ej: sin cebolla"
                                        value={item.notes || ''}
                                        onChange={(e) => {
                                            const updatedCart = [...cart]
                                            updatedCart[index] = { ...item, notes: e.target.value }
                                            setCart(updatedCart)
                                        }}
                                        className="w-full text-sm text-orange-800 bg-white border border-orange-300 rounded-md px-3 py-2"
                                    />
                                )}

                                <div className="flex  items-center justify-end gap-1 w-full">
                                    <div className="flex justify-between border w-full border-orange-300 rounded-md overflow-hidden">
                                        <Button
                                            onClick={() => {
                                                const updatedCart = [...cart];
                                                updatedCart[index] = item.showNotes
                                                    ? { ...item, showNotes: false, notes: '' } // cerrar y borrar nota
                                                    : { ...item, showNotes: true };             // abrir nota
                                                setCart(updatedCart);
                                            }}
                                            className="rounded-none border-r border-orange-300 shadow-none text-xs text-orange-600 bg-orange-100 hover:bg-orange-200"
                                        >
                                            {item.showNotes ? 'Borrar nota' : 'Añadir nota'}
                                        </Button>

                                        <div>
                                            <Button
                                                onClick={() => updateCartItem(item.id, -1)}
                                                className="rounded-none shadow-none py-1 cursor-pointer text-sm bg-orange-50 hover:bg-orange-100 text-orange-700"
                                            >
                                                <Minus />
                                            </Button>
                                            <Button
                                                onClick={() => updateCartItem(item.id, 1)}
                                                className="rounded-none shadow-none py-1 cursor-pointer text-sm bg-orange-50 hover:bg-orange-100 text-orange-700"
                                            >
                                                <Plus />
                                            </Button>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => removeItem(item.id)}
                                        className="cursor-pointer bg-red-500 hover:bg-red-600 text-white text-xs"
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
                <div className="space-y-3">
                    <div className="space-y-2">
                        <label className="text-sm text-gray-600">Nombres completos</label>
                        <Input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-orange-50"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-600">Número de Celular</label>
                        <Input
                            type="number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="bg-orange-50"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-600">Fecha de entrega</label>
                        <Input
                            type="date"
                            value={deliveryDate}
                            onChange={(e) => setDeliveryDate(e.target.value)}
                            className="bg-orange-50"
                            min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-600">Hora de entrega</label>
                        <Input
                            type="time"
                            value={deliveryTime}
                            onChange={(e) => setDeliveryTime(e.target.value)}
                            className="bg-orange-50"
                        />
                    </div>
                </div>



                <LocationPicker location={location} setLocation={setLocation} />

                {!location && (
                    <Button
                        type="button"
                        onClick={() => {
                            navigator.geolocation.getCurrentPosition(
                                ({ coords }) => {
                                    setLocation(`${coords.latitude},${coords.longitude}`);
                                    toast.success('Ubicación actualizada');
                                },
                                () => toast.error('No se pudo obtener tu ubicación. Asegúrate de dar permisos.')
                            );
                        }}
                        className="w-full bg-orange-100 hover:bg-orange-200 text-orange-600 font-semibold"
                    >
                        Activar ubicación
                    </Button>
                )}


                <Button
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold"
                    onClick={handleSubmit}
                    disabled={!name || !phone || !location || !deliveryDate || !deliveryTime || cart.length === 0}
                >
                    Confirmar pedido
                </Button>

            </div>
        </div>
    )

    const [isBottom, setIsBottom] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const nearBottom =
                window.innerHeight + window.scrollY >= document.body.offsetHeight - 10;
            setIsBottom(nearBottom);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            {/* Móvil: Botón flotante y modal */}
            <div className={`sm:hidden fixed duration-300 ${isBottom ? "bottom-16" : "bottom-4"} right-4 z-50`}>
                <Button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-orange-400 hover:bg-orange-600 text-white font-bold rounded-md px-6 py-3 shadow-lg"
                >
                    <ShoppingCart /> {cart.length !== 1 ? 'Mis Pedidos' : 'Mi Pedido'} {cart.length > 0 ? cart.length : ''}
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