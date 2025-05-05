import { useState, useCallback, useEffect } from 'react'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoaderCircle, MapPinHouse, MapPinPlus } from 'lucide-react'

const containerStyle = { width: '100%', height: '300px' }
const defaultCenter = { lat: 4.9214, lng: -75.0626 }

const parseLocation = (location: string) => {
    const [lat, lng] = location.split(',').map(Number)
    return { lat, lng }
}

export function LocationPicker({
    location,
    setLocation,
    setManualAddress,
}: {
    location: string
    setLocation: (value: string) => void
    setManualAddress: (value: string) => void
}) {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    })

    const [position, setPosition] = useState(() =>
        location ? parseLocation(location) : defaultCenter
    )
    const [address, setAddress] = useState('')

    const [showMap, setShowMap] = useState(false)

    // Recuperamos la dirección almacenada en localStorage al montar el componente
    useEffect(() => {
        const savedAddress = localStorage.getItem('address')
        if (savedAddress) {
            setAddress(savedAddress)
            setManualAddress(savedAddress)
        }
    }, [setManualAddress])

    // Guardamos la dirección en localStorage cada vez que cambia
    useEffect(() => {
        if (address) {
            localStorage.setItem('address', address)
        }
    }, [address])

    const updateLocation = (lat: number, lng: number) => {
        const locString = `${lat},${lng}`
        const newPosition = { lat, lng }

        setPosition(newPosition)
        setLocation(locString)
        fetchAddress(lat, lng)
    }

    const fetchAddress = async (lat: number, lng: number) => {
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
            )
            const data = await response.json()
            if (data.status === 'OK') {
                const formatted = data.results[0]?.formatted_address
                if (formatted) {
                    setAddress(formatted)
                    setManualAddress(formatted)
                }
            } else {
                console.warn('No se encontró dirección para las coordenadas.')
            }
        } catch (err) {
            console.error('Error al obtener dirección:', err)
        }
    }

    const handleManualAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddress(e.target.value)
    }

    const handleMapConfirmation = () => setShowMap(false)
    const handleOpenMap = () => setShowMap(true)

    const handleMarkerDragEnd = useCallback(
        (e: google.maps.MapMouseEvent) => {
            const lat = e.latLng?.lat()
            const lng = e.latLng?.lng()
            if (lat && lng) updateLocation(lat, lng)
        },
        [setLocation]
    )

    if (!isLoaded) {
        return (
            <div className="bg-orange-50 rounded-xl w-full h-60 flex flex-col gap-3 justify-center items-center text-orange-500">
                Cargando mapa... <LoaderCircle className="animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {!showMap ? (
                <>
                    <div className="space-y-2">
                        <label className="text-sm text-gray-800">Dirección</label>
                        <div className='flex items-center gap-1 w-full'>
                            <div className="w-full text-xs text-gray-700 bg-gray-50 p-2  rounded-md border border-gray-200 flex gap-2">
                                <MapPinHouse size={20} /> <strong>{address}</strong>
                            </div>
                            <Button
                                onClick={handleOpenMap}
                                className="bg-blue-400 cursor-pointer m-0 text-white font-bold hover:bg-blue-500 border border-blue-500"
                            >
                                <MapPinPlus />
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="manual-address" className="text-sm font-medium text-gray-700">
                            O escribe tu dirección manualmente:
                        </label>
                        <Input
                            id="manual-address"
                            value={address}
                            onChange={handleManualAddressChange}
                            placeholder="Ej. Centro, El triunfo"
                            className="w-full"
                        />
                    </div>
                </>
            ) : (
                <div className="flex flex-col gap-3">
                    <div className="overflow-hidden rounded-xl">
                        <GoogleMap mapContainerStyle={containerStyle} center={position} zoom={15}>
                            <Marker position={position} draggable onDragEnd={handleMarkerDragEnd} />
                        </GoogleMap>
                    </div>

                    {address && (
                        <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-xl">
                            📍 Dirección: <strong>{address}</strong>
                        </div>
                    )}

                    <Button
                        onClick={handleMapConfirmation}
                        className="bg-green-600 text-white font-bold hover:bg-green-700"
                    >
                        Confirmar dirección
                    </Button>
                </div>
            )}
        </div>
    )
}
