import { useState, useCallback } from 'react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api'

const containerStyle = {
    width: '400px',
    height: '400px',
}

const center = {
    lat: -3.745,
    lng: -38.523,
}

const Home = () => {
    const [selectedPosition, setSelectedPosition] = useState(center)
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY!,
    })

    const onMapClick = useCallback((event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
            setSelectedPosition({
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
            })
        }
    }, [])

    if (loadError) {
        return <div>Error loading Google Maps</div>
    }

    return (
        <div>
            <h1>Home Page</h1>
            {isLoaded ? (
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={selectedPosition}
                    zoom={10}
                    onClick={onMapClick}
                >
                    <Marker position={selectedPosition} />
                </GoogleMap>
            ) : (
                <div>Loading...</div>
            )}
            <div>
                <p>Selected Coordinates:</p>
                <p>Latitude: {selectedPosition.lat}</p>
                <p>Longitude: {selectedPosition.lng}</p>
            </div>
        </div>
    )
}

export default Home
