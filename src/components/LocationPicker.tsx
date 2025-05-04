import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoaderCircle, MapPinHouse, MapPinPlus } from 'lucide-react'
import { toast } from 'sonner'

const containerStyle = {
    width: '100%',
    height: '300px',
}

const defaultCenter = {
    lat: 4.9214,
    lng: -75.0626,
}

// Utility function to parse location string into latitude and longitude
const parseLocation = (location: string) => {
    const [lat, lng] = location.split(',').map(Number)
    return { lat, lng }
}

export function LocationPicker({
    location,
    setLocation,
}: {
    location: string
    setLocation: (value: string) => void
}) {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    })

    const [position, setPosition] = useState<{ lat: number; lng: number }>(
        location ? parseLocation(location) : defaultCenter
    )

    const [address, setAddress] = useState('')
    const [showMap, setShowMap] = useState(false)
    const [showManualButton, setShowManualButton] = useState(true)


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
                }
            } else {
                console.warn('No se encontró dirección para las coordenadas.')
            }
        } catch (err) {
            console.error('Error al obtener dirección:', err)
        }
    }

    const fetchUserLocation = useCallback(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords
                const newPos = { lat: latitude, lng: longitude }
                setPosition(newPos)
                const newLocation = `${latitude},${longitude}`
                setLocation(newLocation)
                localStorage.setItem('userLocation', newLocation)
                fetchAddress(latitude, longitude)
            },
            (error) => {
                toast.error(error?.message || 'No se pudo obtener tu ubicación')
            }
        )
    }, [setLocation])

    useEffect(() => {
        const savedLocation = localStorage.getItem('userLocation')
        if (savedLocation) {
            const parsed = parseLocation(savedLocation)
            setLocation(savedLocation)
            setPosition(parsed)
            fetchAddress(parsed.lat, parsed.lng)
        } else if (isLoaded && !location) {
            fetchUserLocation()
        }
    }, [isLoaded, location, fetchUserLocation, setLocation])

    const handleOpenMap = () => {
        setShowMap(true)
    }

    const onDragEnd = useCallback(
        (e: google.maps.MapMouseEvent) => {
            const newLat = e.latLng?.lat()
            const newLng = e.latLng?.lng()
            if (newLat && newLng) {
                const newLoc = `${newLat},${newLng}`
                setPosition({ lat: newLat, lng: newLng })
                setLocation(newLoc)
                localStorage.setItem('userLocation', newLoc)
                fetchAddress(newLat, newLng)
            }
        },
        [setLocation]
    )

    const handleManualAddressSubmit = async () => {
        if (!address) return
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)},+Lebanon&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
            )
            const data = await response.json()
            if (data.status === 'OK') {
                const loc = data.results[0].geometry.location
                const newLoc = `${loc.lat},${loc.lng}`
                setPosition(loc)
                setLocation(newLoc)
                localStorage.setItem('userLocation', newLoc)
                setShowManualButton(false) // Oculta el botón
            } else {
                toast.error('No se pudo encontrar esa dirección.')
            }
        } catch (err) {
            console.error('Error al geocodificar dirección:', err)
            toast.error('Error al buscar dirección.')
        }
    }


    if (!isLoaded)
        return (
            <div className="bg-orange-50 rounded-xl w-full h-60 flex flex-col gap-3 justify-center items-center text-orange-500">
                Cargando mapa... <LoaderCircle className="animate-spin" />
            </div>
        )

    return (
        <div className="space-y-4">
            {!showMap && (
                <>
                    <div className="space-y-2">
                        <label className="text-sm text-gray-600">Dirección</label>
                        <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded-md border border-gray-200 flex gap-2">
                            <MapPinHouse /> <strong>{address}</strong>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="manual-address" className="text-sm font-medium text-gray-700">
                            O escribe tu dirección manualmente:
                        </label>
                        <div className='flex items-center gap-1'>
                            <Input
                                id="manual-address"
                                value={address}
                                onChange={(e) => {
                                    setAddress(e.target.value)
                                    setShowManualButton(true)
                                }}
                                placeholder="Ej. Centro, El triunfo"
                                className="w-full"
                            />
                            <Button
                                onClick={handleOpenMap}
                                className="bg-blue-400 cursor-pointer text-white font-bold hover:bg-blue-500"
                            >
                                <MapPinPlus />
                            </Button>
                        </div>
                        {showManualButton && (
                            <Button
                                onClick={handleManualAddressSubmit}
                                className="cursor-pointer bg-green-500 text-white hover:bg-green-600"
                            >
                                Usar esta dirección
                            </Button>
                        )}
                    </div>


                </>
            )}

            {showMap && (
                <div className="flex flex-col gap-3">
                    <div className="overflow-hidden rounded-xl">
                        <GoogleMap mapContainerStyle={containerStyle} center={position} zoom={15}>
                            <Marker position={position} draggable onDragEnd={onDragEnd} />
                        </GoogleMap>
                    </div>

                    {address && (
                        <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-xl">
                            📍 Dirección: <strong>{address}</strong>
                        </div>
                    )}

                    <Button
                        onClick={() => setShowMap(false)}
                        className="bg-green-600 cursor-pointer text-white font-bold hover:bg-green-700"
                    >
                        Confirmar dirección
                    </Button>
                </div>
            )}
        </div>
    )
}
