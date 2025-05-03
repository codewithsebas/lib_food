import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { LoaderCircle } from 'lucide-react'

const containerStyle = {
    width: '100%',
    height: '300px',
}

const defaultCenter = {
    lat: 4.60971,
    lng: -74.08175,
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

    // Initialize position based on location or default values
    const [position, setPosition] = useState<{ lat: number; lng: number }>(
        location ? parseLocation(location) : defaultCenter
    )

    const [address, setAddress] = useState('')
    const [showMap, setShowMap] = useState(false)

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

    // Memoized version of fetchUserLocation to prevent redefinition
    const fetchUserLocation = useCallback(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords
                const newPos = { lat: latitude, lng: longitude }
                setPosition(newPos)
                const newLocation = `${latitude},${longitude}`
                setLocation(newLocation)
                localStorage.setItem('userLocation', newLocation) // Save to localStorage
                fetchAddress(latitude, longitude)
            },
            (error) => {
                console.error('No se pudo obtener la ubicación:', error)
            }
        )
    }, [setLocation]) // Only recreate the function if setLocation changes

    useEffect(() => {
        // Check if location exists in localStorage and use it if available
        const savedLocation = localStorage.getItem('userLocation')
        if (savedLocation) {
            const parsed = parseLocation(savedLocation)
            setLocation(savedLocation)
            setPosition(parsed)
            fetchAddress(parsed.lat, parsed.lng)
        } else if (isLoaded && !location) {
            fetchUserLocation() // Fallback to fetching the user location
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
                localStorage.setItem('userLocation', newLoc) // Update localStorage
                fetchAddress(newLat, newLng)
            }
        },
        [setLocation]
    )

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
                    <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md rounded-t-none">
                        📍 Dirección: <strong>{address}</strong>
                    </div>

                    <Button
                        onClick={handleOpenMap}
                        className="bg-orange-400 cursor-pointer text-white font-bold hover:bg-orange-500"
                    >
                        Cambiar ubicación
                    </Button>
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
