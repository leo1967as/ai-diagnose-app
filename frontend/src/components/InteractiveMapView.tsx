import React, { useEffect, useRef, useState } from 'react'

interface InteractiveMapViewProps {
  className?: string
}

const InteractiveMapView: React.FC<InteractiveMapViewProps> = ({ className = '' }) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [infoWindow, setInfoWindow] = useState<any>(null)
  const [currentLocationMarker, setCurrentLocationMarker] = useState<any>(null)
  const [searchCircle, setSearchCircle] = useState<any>(null)
  const [places, setPlaces] = useState<any[]>([])
  const [mapStatus, setMapStatus] = useState<string>('กำลังโหลดแผนที่...')
  const [isListExpanded, setIsListExpanded] = useState<boolean>(false)
  const [selectedType, setSelectedType] = useState<'hospital' | 'pharmacy'>('hospital')
  const mapMarkersRef = useRef<any[]>([])

  // Default center (Bangkok)
  const defaultCenter = { lat: 13.736717, lng: 100.523186 }

  useEffect(() => {
    console.log('InteractiveMapView: Component mounted')
    initMap()
  }, [])

  useEffect(() => {
    if (map) {
      nearbySearch()
    }
  }, [selectedType])

  const initMap = async () => {
    try {
      console.log('InteractiveMapView: Checking Google Maps availability...')

      // Wait for Google Maps to be loaded
      const checkGoogleMaps = () => {
        return new Promise<void>((resolve, reject) => {
          if ((window as any).google && (window as any).google.maps) {
            console.log('InteractiveMapView: Google Maps is available')
            resolve()
          } else {
            console.log('InteractiveMapView: Waiting for Google Maps...')
            setTimeout(() => {
              if ((window as any).google && (window as any).google.maps) {
                resolve()
              } else {
                reject(new Error('Google Maps failed to load within timeout'))
              }
            }, 5000) // Wait up to 5 seconds
          }
        })
      }

      await checkGoogleMaps()

      if (!mapRef.current) {
        console.error('InteractiveMapView: Map container not found')
        return
      }

      console.log('InteractiveMapView: Creating map instance...')
      const mapInstance = new (window as any).google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 13,
        mapTypeControl: false,
      })

      const infoWindowInstance = new (window as any).google.maps.InfoWindow()
      setMap(mapInstance)
      setInfoWindow(infoWindowInstance)

      console.log('InteractiveMapView: Map initialized successfully')

      // Get current location
      getCurrentLocation(mapInstance)
    } catch (error) {
      console.error('InteractiveMapView: Failed to initialize map:', error)
      setMapStatus('ไม่สามารถโหลดแผนที่ได้: ' + (error instanceof Error ? error.message : String(error)))
    }
  }

  const getCurrentLocation = (mapInstance: any) => {
    if (navigator.geolocation) {
      setMapStatus('กำลังหาตำแหน่ง...')
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          mapInstance.setCenter(pos)

          // Add current location marker
          if (currentLocationMarker) {
            currentLocationMarker.setMap(null)
          }
          const marker = new (window as any).google.maps.Marker({
            position: pos,
            map: mapInstance,
            title: 'ตำแหน่งปัจจุบันของคุณ',
            icon: {
              path: (window as any).google.maps.SymbolPath.CIRCLE,
              scale: 12,
              fillColor: '#4285f4',
              fillOpacity: 0.8,
              strokeColor: '#fff',
              strokeWeight: 3
            }
          })
          setCurrentLocationMarker(marker)
          setMapStatus('ตำแหน่งปัจจุบัน')

          nearbySearch()
        },
        () => {
          setMapStatus('ไม่สามารถหาตำแหน่งได้ ใช้ค่าเริ่มต้น')
          mapInstance.setCenter(defaultCenter)
          nearbySearch()
        }
      )
    } else {
      setMapStatus('เบราว์เซอร์ไม่รองรับ Geolocation ใช้ค่าเริ่มต้น')
      mapInstance.setCenter(defaultCenter)
      nearbySearch()
    }
  }

  const nearbySearch = async () => {
    if (!map) return

    try {
      const center = map.getCenter()
      const bounds = map.getBounds()
      if (!bounds) return

      const ne = bounds.getNorthEast()
      const sw = bounds.getSouthWest()
      const spherical = (window as any).google.maps.geometry.spherical
      const diameter = spherical.computeDistanceBetween(ne, sw)
      const radius = Math.min(diameter / 2, 5000)

      // Draw search circle
      if (searchCircle) {
        searchCircle.setMap(null)
      }
      const circle = new (window as any).google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.05,
        map: map,
        center: { lat: center.lat(), lng: center.lng() },
        radius: radius
      })
      setSearchCircle(circle)

      const request = {
        fields: ['displayName', 'location', 'formattedAddress', 'googleMapsURI'],
        locationRestriction: {
          center: { lat: center.lat(), lng: center.lng() },
          radius: radius,
        },
        includedPrimaryTypes: [selectedType],
        maxResultCount: 5,
        rankPreference: (window as any).google.maps.places.SearchNearbyRankPreference.POPULARITY,
      }

      const { places: searchResults } = await (window as any).google.maps.places.Place.searchNearby(request)

      if (!searchResults || !searchResults.length) {
        setPlaces([])
        return
      }

      // Clear existing markers
      mapMarkersRef.current.forEach(marker => marker.setMap(null))
      mapMarkersRef.current = []

      const newPlaces = searchResults.map((place: any) => {
        if (!place.location) return null

        // Add marker
        const marker = new (window as any).google.maps.Marker({
          map: map,
          position: place.location,
          title: place.displayName?.text || ''
        })
        mapMarkersRef.current.push(marker)

        // Calculate distance
        const distance = spherical.computeDistanceBetween(center, place.location)

        // InfoWindow on marker click
        marker.addListener('click', () => {
          const content = getInfoContent(place)
          infoWindow.setContent(content)
          infoWindow.open(map, marker)
        })

        return {
          ...place,
          distance
        }
      }).filter(Boolean)

      setPlaces(newPlaces)

      // Fit bounds to show all markers
      if (newPlaces.length > 0) {
        const boundsToFit = new (window as any).google.maps.LatLngBounds()
        newPlaces.forEach((place: any) => {
          if (place.location) {
            boundsToFit.extend(place.location)
          }
        })
        map.fitBounds(boundsToFit)
      }

    } catch (error) {
      console.error('nearbySearch error:', error)
      setPlaces([])
    }
  }

  const getInfoContent = (place: any) => {
    const content = document.createElement('div')
    const name = document.createElement('div')
    name.style.fontWeight = 'bold'
    name.textContent = place.displayName?.text || ''
    const addr = document.createElement('div')
    addr.textContent = place.formattedAddress || ''

    content.appendChild(name)
    content.appendChild(addr)

    if (place.googleMapsURI) {
      const link = document.createElement('a')
      link.href = place.googleMapsURI
      link.target = '_blank'
      link.textContent = 'ดูใน Google Maps'
      link.style.display = 'block'
      link.style.marginTop = '8px'
      link.style.color = '#4285f4'
      link.style.textDecoration = 'none'
      content.appendChild(link)
    }

    return content
  }

  const handlePlaceClick = (place: any) => {
    if (!map || !place.location) return

    map.panTo(place.location)
    const marker = mapMarkersRef.current.find(m =>
      m.getPosition().lat() === place.location.lat &&
      m.getPosition().lng() === place.location.lng
    )

    if (marker && infoWindow) {
      const content = getInfoContent(place)
      infoWindow.setContent(content)
      infoWindow.open(map, marker)
    }
  }

  const formatDistance = (distance: number) => {
    return distance > 1000 ? `${(distance / 1000).toFixed(1)} กม.` : `${Math.round(distance)} ม.`
  }

  return (
    <div className={`interactive-map-view ${className}`}>
      <div className="map-header">
        <h3>แผนที่สถานที่ใกล้เคียง</h3>
        <p className="map-status">{mapStatus}</p>
      </div>

      <div className="map-controls">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as 'hospital' | 'pharmacy')}
          className="type-select"
        >
          <option value="hospital">🏥 โรงพยาบาล</option>
          <option value="pharmacy">💊 ร้านขายยา</option>
        </select>

        <button
          onClick={() => setIsListExpanded(!isListExpanded)}
          className="toggle-list-btn"
        >
          {isListExpanded ? '🔽 ซ่อนรายการ' : '🔼 แสดงรายการ'}
        </button>
      </div>

      <div className="map-container">
        <div ref={mapRef} className="map-element" style={{ height: '300px', width: '100%' }}></div>
      </div>

      {isListExpanded && (
        <div className="places-list">
          {places.length === 0 ? (
            <div className="no-places">ไม่พบสถานที่ใกล้เคียง</div>
          ) : (
            places.map((place, index) => (
              <div
                key={index}
                className="place-card"
                onClick={() => handlePlaceClick(place)}
              >
                <h4>{place.displayName?.text || 'ไม่ระบุชื่อ'}</h4>
                <p>{place.formattedAddress || ''}</p>
                <span className="distance">ระยะทาง: {formatDistance(place.distance)}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default InteractiveMapView