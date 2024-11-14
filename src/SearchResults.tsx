import React from 'react'

type SearchResult = {
  name: string
  geometry: {
    location: {
      lat: () => number
      lng: () => number
    }
  }
}

type SearchResultsProps = {
  results: SearchResult[]
  onSelect: (location: { lat: number; lng: number }) => void
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, onSelect }) => {
  return (
    <div>
      <h2>Search Results</h2>
      <ul>
        {results.map((result, index) => (
          <button
            key={index}
            onClick={() =>
              onSelect({
                lat: result.geometry.location.lat(),
                lng: result.geometry.location.lng(),
              })
            }
            style={{
              cursor: 'pointer',
              display: 'block',
              width: '100%',
              textAlign: 'left',
              background: 'none',
              border: 'none',
              padding: '0',
              margin: '0',
            }}
          >
            {result.name}
          </button>
        ))}
      </ul>
    </div>
  )
}

export default SearchResults
