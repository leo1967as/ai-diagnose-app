import React, { useEffect, useRef, useState } from 'react';

interface MapComponentProps {
  className?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ className = '' }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const placeListRef = useRef<HTMLDivElement>(null);
  const typeSelectRef = useRef<HTMLSelectElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);
  const [currentLocationMarker, setCurrentLocationMarker] = useState<google.maps.Marker | null>(null);
  const [searchCircle, setSearchCircle] = useState<google.maps.Circle | null>(null);
  const [places, setPlaces] = useState<any[]>([]);
  const [mapStatus, setMapStatus] = useState<string>('กำลังโหลดแผนที่...');
  const [isListExpanded, setIsListExpanded] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<'hospital' | 'pharmacy'>('hospital');
  const mapMarkersRef = useRef<google.maps.Marker[]>([]);

  // Default center (Bangkok)
  const defaultCenter = { lat: 13.736717, lng: 100.523186 };
  let innerMap: google.maps.Map | null = null;
  let infoWindowInstance: google.maps.InfoWindow | null = null;

  useEffect(() => {
    initMap();
  }, []);

  useEffect(() => {
    if (map) {
      nearbySearch();
    }
  }, [selectedType]);

  const loadGoogleMapsScript = () => {
    const key = 'AIzaSyC5Vmhpo2VJAMDU9YE0asyRdcq-NT4p2UU';
    const src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places,geometry&v=weekly`;
    if (document.querySelector(`script[src^="${src.split('?')[0]}"]`)) {
      initMap();
      return;
    }
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.defer = true;
    s.onload = initMap;
    s.onerror = () => console.error('Failed to load Google Maps script');
    document.head.appendChild(s);
  };

  const initMap = () => {
    if (!window.google || !window.google.maps) {
      setMapStatus('ไม่สามารถโหลด Google Maps');
      return;
    }

    if (!mapRef.current) return;

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: 13,
      mapTypeControl: false,
    });

    const infoWindowInstanceLocal = new window.google.maps.InfoWindow();
    setMap(mapInstance);
    setInfoWindow(infoWindowInstanceLocal);
    innerMap = mapInstance;
    infoWindowInstance = infoWindowInstanceLocal;

    // Get current location
    getCurrentLocation(mapInstance);
  };

  const getCurrentLocation = (mapInstance: google.maps.Map) => {
    if (navigator.geolocation) {
      setMapStatus('กำลังหาตำแหน่ง...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          mapInstance.setCenter(pos);

          // Add current location marker
          if (currentLocationMarker) {
            currentLocationMarker.setMap(null);
          }
          const marker = new window.google.maps.Marker({
            position: pos,
            map: mapInstance,
            title: 'ตำแหน่งปัจจุบันของคุณ',
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 12,
              fillColor: '#4285f4',
              fillOpacity: 0.8,
              strokeColor: '#fff',
              strokeWeight: 3
            }
          });
          setCurrentLocationMarker(marker);

          setMapStatus('ตำแหน่งปัจจุบัน');
          nearbySearch();
        },
        () => {
          setMapStatus('ไม่สามารถหาตำแหน่งได้ ใช้ค่าเริ่มต้น');
          mapInstance.setCenter(defaultCenter);
          nearbySearch();
        }
      );
    } else {
      setMapStatus('เบราว์เซอร์ไม่รองรับ Geolocation ใช้ค่าเริ่มต้น');
      mapInstance.setCenter(defaultCenter);
      nearbySearch();
    }
  };

  const nearbySearch = () => {
    if (!map || !infoWindowInstance) return;

    try {
      const type = selectedType;
      const center = map.getCenter();
      const bounds = map.getBounds();
      if (!bounds) return;
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();
      const spherical = window.google.maps.geometry.spherical;
      const diameter = spherical.computeDistanceBetween(ne, sw);
      const radius = Math.min((diameter / 2), 5000);

      // Draw search circle
      if (searchCircle) {
        searchCircle.setMap(null);
      }
      const circle = new window.google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.05,
        map: map,
        center: { lat: center.lat(), lng: center.lng() },
        radius: radius
      });
      setSearchCircle(circle);

      // Map old types to new includedPrimaryTypes
      const typeMapping = {
        'hospital': ['hospital'],
        'pharmacy': ['pharmacy'],
      };
      const includedPrimaryTypes = typeMapping[type] || [type];

      const request = {
        fields: ['displayName', 'location', 'formattedAddress', 'googleMapsURI'],
        locationRestriction: {
          center: { lat: center.lat(), lng: center.lng() },
          radius: radius,
        },
        includedPrimaryTypes: includedPrimaryTypes,
        maxResultCount: 5,
        rankPreference: window.google.maps.places.SearchNearbyRankPreference.POPULARITY,
      };

      const { places } = await window.google.maps.places.Place.searchNearby(request);

      if (!places || !places.length) {
        console.log('No nearby results');
        setPlaces([]);
        return;
      }

      // Clear existing markers
      mapMarkersRef.current.forEach(m => m.setMap(null));
      mapMarkersRef.current = [];

      // Clear place list
      if (placeListRef.current) {
        placeListRef.current.innerHTML = '';
      }

      const boundsToFit = new window.google.maps.LatLngBounds();
      places.forEach((place) => {
        if (!place.location) return;

        // Marker
        const marker = new window.google.maps.Marker({
          map: map,
          position: place.location,
          title: place.displayName
        });
        mapMarkersRef.current.push(marker);
        boundsToFit.extend(place.location);

        // InfoWindow on marker click
        marker.addListener('click', () => {
          const content = getContent(place);
          infoWindowInstance.setContent(content);
          infoWindowInstance.open(map, marker);
        });

        // Calculate distance
        const distance = spherical.computeDistanceBetween(center, place.location);
        const distanceText = distance > 1000 ? (distance / 1000).toFixed(1) + ' กม.' : Math.round(distance) + ' ม.';

        // Add to list as card
        const itemDiv = document.createElement('div');
        itemDiv.className = 'place-card';
        itemDiv.innerHTML = `
          <h3>${place.displayName}</h3>
          <p>${place.formattedAddress || ''}</p>
          <p style="color: #666; font-size: 12px;">ระยะทาง: ${distanceText}</p>
        `;
        itemDiv.addEventListener('click', () => {
          map.panTo(place.location);
          window.google.maps.event.trigger(marker, 'click');
          itemDiv.style.backgroundColor = '#f0f8f0';
          setTimeout(() => itemDiv.style.backgroundColor = '', 200);
        });
        if (placeListRef.current) {
          placeListRef.current.appendChild(itemDiv);
        }
      });

      map.fitBounds(boundsToFit);
      setPlaces(places.slice(0, 5)); // Limit to 5 items
    } catch (e) {
      console.error('nearbySearch error:', e);
    }
  };

  const getContent = (place: any) => {
    const content = document.createElement('div');
    const name = document.createElement('div');
    name.textContent = place.displayName || '';
    const addr = document.createElement('div');
    addr.textContent = place.formattedAddress || '';
    content.append(name, addr);
    if (place.googleMapsURI) {
      const link = document.createElement('a');
      link.href = place.googleMapsURI;
      link.target = '_blank';
      link.textContent = 'View on Google Maps';
      content.appendChild(link);
    }
    return content;
  };

  const handleTypeChange = () => {
    if (typeSelectRef.current) {
      const type = typeSelectRef.current.value as 'hospital' | 'pharmacy';
      setSelectedType(type);
    }
  };

  const toggleList = () => {
    setIsListExpanded(!isListExpanded);
  };

  return (
    <div className={`map-component ${className}`}>
      <div className="map-header">
        <h3>แผนที่สถานที่ใกล้เคียง</h3>
        <p className="map-status">{mapStatus}</p>
      </div>

      <div className="map-controls">
        <select ref={typeSelectRef} onChange={handleTypeChange} className="type-select">
          <option value="hospital">🏥 โรงพยาบาล</option>
          <option value="pharmacy">💊 ร้านขายยา</option>
        </select>
        <button onClick={toggleList} className="toggle-list-btn">
          {isListExpanded ? '🔽 ซ่อนรายการ' : '🔼 แสดงรายการ'}
        </button>
      </div>

      <div className="map-container">
        <div ref={mapRef} className="map-element" style={{ height: '300px', width: '100%' }}></div>
      </div>

      {isListExpanded && (
        <div ref={placeListRef} className="places-list">
          {places.length === 0 ? (
            <div className="no-places">ไม่พบสถานที่ใกล้เคียง</div>
          ) : (
            places.map((place, index) => (
              <div key={index} className="place-card">
                <h4>{place.displayName || 'ไม่ระบุชื่อ'}</h4>
                <p>{place.formattedAddress || ''}</p>
                <button onClick={() => window.open(place.googleMapsURI, '_blank')}>ดูใน Google Maps</button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MapComponent;