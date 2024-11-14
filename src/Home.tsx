import { useState, useCallback, useRef } from 'react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api'
import LocationForm from './LocationForm'
import SearchResults from './SearchResults'

const containerStyle = {
  width: '400px',
  height: '400px',
}

const center = {
  lat: -3.745,
  lng: -38.523,
}

const libraries: Parameters<typeof useJsApiLoader>[0]['libraries'] = ['places']

const Home = () => {
  const [selectedPosition, setSelectedPosition] = useState(center)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<
    google.maps.places.PlaceResult[]
  >([])
  const mapRef = useRef<google.maps.Map | null>(null)

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY!,
    libraries,
  })

  const onMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      setSelectedPosition({
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      })
    }
  }, [])

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map
  }, [])

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault()
    if (!mapRef.current) return

    const service = new google.maps.places.PlacesService(mapRef.current)

    const request = {
      query: searchQuery,
      fields: ['name', 'geometry'],
    }

    service.textSearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        setSearchResults(results)
      }
    })
  }

  const handleSelectResult = (location: { lat: number; lng: number }) => {
    setSelectedPosition(location)
    mapRef.current?.panTo(location)
  }

  const onSubmit = (data: {
    location: string
    clue: string
    solution: string
  }) => {
    console.log('Form Data:', data)
    console.log('Selected Coordinates:', selectedPosition)
  }

  if (loadError) {
    return <div>Error loading Google Maps</div>
  }

  return (
    <div>
      <h1>Home Page</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search for places"
        />
        <button type="submit">Search</button>
      </form>
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={selectedPosition}
          zoom={10}
          onClick={onMapClick}
          onLoad={onLoad}
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
      <LocationForm onSubmit={onSubmit} />
      <SearchResults results={searchResults} onSelect={handleSelectResult} />
    </div>
  )
}

export default Home
