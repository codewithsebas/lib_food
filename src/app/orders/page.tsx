"use client"
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/supabase';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { formatCOP } from '@/lib/utils/formatCurrency';
import { ChefHat, ClockArrowUp, CornerDownLeft, Hamburger, PackageCheck, UserRound } from 'lucide-react';
import { Logo } from '@/components/Logo';

export interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    ingredients: string[];
    imageUrl: string;
    notes: string;
    quantity: number;
    showNotes: boolean;
}

export interface Order {
    id: number;
    address: string;
    time: string;
    date: string;
    name: string;
    phone: string;
    location: string;
    items: Product[];
}

const Orders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [orderStatus, setOrderStatus] = useState<Map<number, string>>(new Map()); // Track order statuses

    useEffect(() => {
        const fetchOrders = async () => {
            const { data, error } = await supabase
                .from('orders')
                .select('address, time, date, name, phone, location, items, id');

            if (error) {
                setError('Error fetching data: ' + error.message);
            } else {
                setOrders(data ?? []);
                // Establecer el estado de los pedidos si no existe
                const updatedStatus = new Map();
                data.forEach(order => {
                    // Asignar un estado "Pendiente" si no existe un estado guardado
                    if (!orderStatus.has(order.id)) {
                        updatedStatus.set(order.id, 'Pendiente');
                    }
                });
                setOrderStatus(updatedStatus);
            }
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        };

        const storedStatus = localStorage.getItem('orderStatus');
        if (storedStatus) {
            setOrderStatus(new Map(JSON.parse(storedStatus)));
        }

        fetchOrders();
    }, []);


    const toggleStatus = (orderId: number) => {
        const updatedStatus = new Map(orderStatus);
        const currentStatus = updatedStatus.get(orderId);
        // Cycle through statuses: Pending -> Cooking -> Delivered -> Pending
        if (currentStatus === 'Pendiente') {
            updatedStatus.set(orderId, 'Cocinando');
        } else if (currentStatus === 'Cocinando') {
            updatedStatus.set(orderId, 'Entregado');
        } else {
            updatedStatus.set(orderId, 'Pendiente');
        }
        localStorage.setItem('orderStatus', JSON.stringify(Array.from(updatedStatus.entries())));
        setOrderStatus(updatedStatus);
    };

    const calculateTotal = (items: Product[]) =>
        items.reduce((total, item) => total + item.price * item.quantity, 0);

    const sortedOrders = orders.sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);
        return dateA.getTime() - dateB.getTime();
    });

    const pendingOrders = sortedOrders.filter((o) => orderStatus.get(o.id) === 'Pendiente');
    const cookingOrders = sortedOrders.filter((o) => orderStatus.get(o.id) === 'Cocinando');
    const completedOrders = sortedOrders.filter((o) => orderStatus.get(o.id) === 'Entregado');

    const totalCollected = completedOrders.reduce(
        (sum, order) => sum + calculateTotal(order.items),
        0
    );

    const renderOrderCard = (order: Order, status: string) => (
        <Card
            key={order.id}
            className={`p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-opacity-60 ${status === 'Entregado'
                ? 'border-green-200 bg-white/70 backdrop-blur-sm'
                : status === 'Cocinando'
                    ? 'border-yellow-200 bg-white/70 backdrop-blur-sm'
                    : 'border-orange-200 bg-white/80 backdrop-blur-sm'
                }`}
        >
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <UserRound size={30} className="text-gray-600" />
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">
                        {order.name}
                    </h3>
                </div>
                <span
                    className={`text-xs sm:text-sm px-3 py-1 rounded-full font-medium transition ${status === 'Entregado'
                        ? 'bg-green-200/50 text-green-700 border border-green-300'
                        : status === 'Cocinando'
                            ? 'bg-yellow-200/50 text-yellow-800 border border-yellow-300'
                            : 'bg-orange-200/50 text-orange-800 border border-orange-300'
                        }`}
                >
                    {status}
                </span>
            </div>

            {/* Info básica */}
            <div className="text-sm sm:text-base text-gray-600 space-y-1">
                <div>
                    <span className="font-medium">📍 Dirección:</span> {order.address}
                </div>
                <div>
                    <span className="font-medium">📞 Tel:</span> {order.phone}
                </div>
                <div>
                    <span className="font-medium">🕒 Hora:</span> {order.time} | {order.date}
                </div>
            </div>

            {/* Productos */}
            <div className="divide-y divide-gray-200 border-t pt-3">
                {order.items.map((item) => (
                    <div
                        key={item.id}
                        className="flex py-4 items-start gap-4 border-b last:border-b-0"
                    >
                        <Image
                            src={item.imageUrl}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="rounded-lg object-cover h-16 w-16 flex-shrink-0"
                        />
                        <div className="flex-1 text-sm text-gray-800 space-y-1">
                            <div className="font-medium text-base">{item.name}</div>
                            <div className="text-gray-500 text-sm">{item.description}</div>
                            <div className="flex justify-between items-center text-sm text-gray-600">
                                <span>
                                    Cantidad: <b>{item.quantity}</b>
                                </span>
                                <span className="text-orange-600 font-semibold">
                                    {formatCOP(item.price)}
                                </span>
                            </div>
                            {item.notes && (
                                <div className="text-sm text-gray-700 bg-red-100 px-2 py-1 rounded-md w-fit">
                                    <strong>Notas:</strong> {item.notes}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Total y botón */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-lg font-bold text-gray-800 flex gap-2 items-center">
                    <span>Total:</span>
                    <span className="bg-orange-100 text-orange-600 text-xl px-3 py-1 rounded-lg">
                        {formatCOP(calculateTotal(order.items))}
                    </span>
                </div>
                <button
                    onClick={() => toggleStatus(order.id)}
                    className={`rounded-full cursor-pointer px-5 py-2 flex items-center gap-2 text-white text-sm font-semibold shadow-md hover:scale-105 transition-transform duration-200 ${status === 'Entregado'
                        ? 'bg-red-500 hover:bg-red-600'
                        : status === 'Cocinando'
                            ? 'bg-yellow-500 hover:bg-yellow-600'
                            : 'bg-orange-500 hover:bg-orange-600'
                        }`}
                >
                    {status === 'Entregado' ? (
                        <>
                            <CornerDownLeft />
                            Desmarcar entrega
                        </>
                    ) : status === 'Cocinando' ? (
                        <>
                            <PackageCheck />
                            Marcar como entregado
                        </>
                    ) : (
                        <>
                            <ChefHat />
                            Marcar como cocinando
                        </>
                    )}
                </button>

            </div>
        </Card>
    );

    if (loading) return (
        <div className="loading-container">
            <div className="loading-text">Cargando pedidos...</div>
            <div className="hamburger-container">
                <Hamburger size={60} className="hamburger-icon animate-pulse" />
            </div>
        </div>
    );

    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <main>
            <Logo />
            <div className="fixed bottom-4 right-4 rounded-md z-30 border border-green-300 shadow text-xl text-end text-green-700 bg-green-100 px-4 py-2 font-semibold">
                Total recogido: {formatCOP(totalCollected)}
            </div>
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 px-6 py-12 pt-5">

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Pendientes */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-5 h-5 rounded-sm bg-orange-400 animate-pulse" />
                            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                                Pendientes <ClockArrowUp />
                            </h2>
                        </div>
                        <div className="space-y-6 border-2 border-orange-300 border-dashed p-3 rounded-2xl">
                            {pendingOrders.length > 0 ? (
                                pendingOrders.map((order) => renderOrderCard(order, 'Pendiente'))
                            ) : (
                                <div className="flex flex-col gap-3 justify-center items-center py-20">
                                    <p className="text-gray-400 text-xl">No hay pedidos pendientes.</p>
                                    <Hamburger size={40} className="text-gray-400" />
                                </div>
                            )}
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-5 h-5 rounded-sm bg-yellow-400 animate-pulse" />
                            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                                Cocinando <ChefHat />
                            </h2>
                        </div>
                        <div className="space-y-6 border-2 border-yellow-300 border-dashed p-3 rounded-2xl">
                            {cookingOrders.length > 0 ? (
                                cookingOrders.map((order) => renderOrderCard(order, 'Cocinando'))
                            ) : (
                                <div className="flex flex-col gap-3 justify-center items-center py-20">
                                    <p className="text-gray-400 text-xl">No hay pedidos en proceso.</p>
                                    <Hamburger size={40} className="text-gray-400" />
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Entregados */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-sm bg-green-500 animate-pulse" />
                                <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                                    Entregados <PackageCheck />
                                </h2>
                            </div>
                        </div>

                        <div className="space-y-6 border-2 border-green-300 border-dashed p-3 rounded-2xl">
                            {completedOrders.length > 0 ? (
                                completedOrders.map((order) => renderOrderCard(order, 'Entregado'))
                            ) : (
                                <div className="flex flex-col gap-3 justify-center items-center py-20">
                                    <p className="text-gray-400 text-xl">Aún no se han marcado pedidos como entregados.</p>
                                    <Hamburger size={40} className="text-gray-400" />
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
};

export default Orders;
