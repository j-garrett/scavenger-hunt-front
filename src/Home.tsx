import React, { useState, useCallback } from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'

const containerStyle = {
    width: '100%',
    height: '400px',
}

const center = {
    lat: -3.745,
    lng: -38.523,
}

const Home = () => {
    const [selectedPosition, setSelectedPosition] = useState(center)

    const onMapClick = useCallback((event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
            setSelectedPosition({
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
            })
        }
    }, [])

    return (
        <div>
            <h1>Home Page</h1>
            <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={selectedPosition}
                    zoom={10}
                    onClick={onMapClick}
                >
                    <Marker position={selectedPosition} />
                </GoogleMap>
            </LoadScript>
            <div>
                <p>Selected Coordinates:</p>
                <p>Latitude: {selectedPosition.lat}</p>
                <p>Longitude: {selectedPosition.lng}</p>
            </div>
        </div>
    )
}

export default Home
