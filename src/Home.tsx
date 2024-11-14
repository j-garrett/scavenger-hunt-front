import { useState, useCallback, useRef, useEffect } from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'
import LocationForm from './LocationForm'
import SearchResults from './SearchResults'

const containerStyle = {
  width: '400px',
  height: '400px',
}

const libraries: Parameters<typeof useJsApiLoader>[0]['libraries'] = [
  'marker',
  'places',
]

const denverCoords = { lat: 39.742043, lng: -104.991531 }

const Home = () => {
  const [selectedPosition, setSelectedPosition] = useState(denverCoords)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<
    google.maps.places.PlaceResult[]
  >([])
  const mapRef = useRef<google.maps.Map | null>(null)
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(
    null,
  )

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

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      navigator.geolocation.getCurrentPosition(position => {
        const userCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        setSelectedPosition(userCoords)
      })
      markerRef.current = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: selectedPosition,
      })
      mapRef.current = map
    },
    [selectedPosition, setSelectedPosition],
  )

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.position = selectedPosition
    }
  }, [selectedPosition])

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
          id="google-map-scavenger-hunt"
          center={selectedPosition}
          mapContainerStyle={containerStyle}
          options={{ mapId: import.meta.env.VITE_GOOGLE_MAPS_MAP_ID! }}
          zoom={13}
          onClick={onMapClick}
          onLoad={onLoad}
        />
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
