import React, { useState, useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface Place {
  displayName: string;
  location: google.maps.LatLng;
  formattedAddress: string;
  googleMapsURI?: string;
}

const GOOGLE_MAPS_KEY = "AIzaSyC5Vmhpo2VJAMDU9YE0asyRdcq-NT4p2UU";
const DEFAULT_CENTER = { lat: 13.736717, lng: 100.523186 }; // Bangkok

const GoogleMapsView: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);
  const [currentLocationMarker, setCurrentLocationMarker] = useState<google.maps.Marker | null>(null);
  const [searchCircle, setSearchCircle] = useState<google.maps.Circle | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [mapStatus, setMapStatus] = useState('รอการโหลดแผนที่...');
  const [selectedType, setSelectedType] = useState('hospital');
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);

  useEffect(() => {
    const loader = new Loader({
      apiKey: GOOGLE_MAPS_KEY,
      version: 'weekly',
      libraries: ['places', 'geometry'],
    });

    loader.load().then(() => {
      if (mapRef.current && !map) {
        const newMap = new google.maps.Map(mapRef.current, {
          center: mapCenter,
          zoom: 13,
          mapTypeControl: false,
        });
        const newInfoWindow = new google.maps.InfoWindow();
        setMap(newMap);
        setInfoWindow(newInfoWindow);
        initMap(newMap, newInfoWindow);
      }
    }).catch((error) => {
      console.error('Failed to load Google Maps:', error);
      setMapStatus('ไม่สามารถโหลด Google Maps');
    });
  }, []);

  const initMap = (innerMap: google.maps.Map, infoWindow: google.maps.InfoWindow) => {
    // Get current location and set as center
    if (navigator.geolocation) {
      setMapStatus('กำลังหาตำแหน่ง...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          innerMap.setCenter(pos);
          setMapCenter(pos);

          // Add current location marker
          if (currentLocationMarker) {
            currentLocationMarker.setMap(null);
          }
          const marker = new google.maps.Marker({
            position: pos,
            map: innerMap,
            title: 'ตำแหน่งปัจจุบันของคุณ',
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 12,
              fillColor: '#4285f4',
              fillOpacity: 0.8,
              strokeColor: '#fff',
              strokeWeight: 3
            }
          });
          setCurrentLocationMarker(marker);

          setMapStatus('ตำแหน่งปัจจุบัน');
          nearbySearch(innerMap, pos);
        },
        () => {
          setMapStatus('ไม่สามารถหาตำแหน่งได้ ใช้ค่าเริ่มต้น');
          innerMap.setCenter(DEFAULT_CENTER);
          nearbySearch(innerMap, DEFAULT_CENTER);
        }
      );
    } else {
      setMapStatus('เบราว์เซอร์ไม่รองรับ Geolocation ใช้ค่าเริ่มต้น');
      innerMap.setCenter(DEFAULT_CENTER);
      nearbySearch(innerMap, DEFAULT_CENTER);
    }
  };

  const nearbySearch = async (innerMap: google.maps.Map, center: { lat: number; lng: number }) => {
    try {
      const bounds = innerMap.getBounds();
      if (!bounds) return;
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();
      const spherical = google.maps.geometry.spherical;
      const diameter = spherical.computeDistanceBetween(ne, sw);
      const radius = Math.min((diameter / 2), 5000); // Radius cannot be more than 50000.

      // Draw search circle
      if (searchCircle) {
        searchCircle.setMap(null);
      }
      const circle = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.05,
        map: innerMap,
        center: center,
        radius: radius
      });
      setSearchCircle(circle);

      // Map old types to new includedPrimaryTypes
      const typeMapping: { [key: string]: string[] } = {
        'hospital': ['hospital'],
        'pharmacy': ['pharmacy'],
      };
      const includedPrimaryTypes = typeMapping[selectedType] || [selectedType];

      const request = {
        location: center,
        radius: radius,
        type: selectedType,
      };

      const service = new google.maps.places.PlacesService(innerMap);
      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          console.log('Found places:', results);
          if (!results || !results.length) {
            console.log('No nearby results');
            setPlaces([]);
            return;
          }

          // Clear existing markers
          markers.forEach(m => m.setMap(null));
          setMarkers([]);

          const newMarkers: google.maps.Marker[] = [];
          const boundsToFit = new google.maps.LatLngBounds();
          const placesData: Place[] = [];

          results.forEach((place) => {
            if (!place.geometry) return;

            // Marker
            const marker = new google.maps.Marker({
              map: innerMap,
              position: place.geometry.location,
              title: place.name || ''
            });
            newMarkers.push(marker);
            boundsToFit.extend(place.geometry.location);

            // InfoWindow on marker click
            marker.addListener('click', () => {
              const content = document.createElement('div');
              const name = document.createElement('div');
              name.textContent = place.name || '';
              const addr = document.createElement('div');
              addr.textContent = place.vicinity || '';
              content.append(name, addr);
              if (place.url) {
                const link = document.createElement('a');
                link.href = place.url;
                link.target = '_blank';
                link.textContent = 'View on Google Maps';
                content.appendChild(link);
              }
              infoWindow?.setContent(content);
              infoWindow?.open(innerMap, marker);
            });

            const distance = google.maps.geometry.spherical.computeDistanceBetween(center, place.geometry.location);
            const distanceText = distance > 1000 ? (distance / 1000).toFixed(1) + ' กม.' : Math.round(distance) + ' ม.';

            placesData.push({
              displayName: place.name || 'ไม่ระบุชื่อ',
              location: place.geometry.location,
              formattedAddress: place.vicinity || '',
              googleMapsURI: place.url
            });
          });

          setMarkers(newMarkers);
          setPlaces(placesData);
          innerMap.fitBounds(boundsToFit);
        } else {
          console.log('No nearby results');
          setPlaces([]);
        }
      });
    } catch (e) {
      console.error('nearbySearch error:', e);
    }
  };

  const useCurrentLocation = () => {
    if (navigator.geolocation && map) {
      setMapStatus('กำลังหาตำแหน่ง...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          map.setCenter(pos);
          setMapCenter(pos);
          setMapStatus('ตำแหน่งปัจจุบัน');
          nearbySearch(map, pos);
        },
        () => {
          setMapStatus('ไม่สามารถหาตำแหน่งได้');
        }
      );
    } else {
      setMapStatus('เบราว์เซอร์ไม่รองรับ Geolocation');
    }
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    if (map) {
      nearbySearch(map, mapCenter);
    }
  };

  const handlePlaceClick = (place: Place) => {
    if (map && infoWindow) {
      map.panTo(place.location);
      // Trigger marker click
      const marker = markers.find(m => m.getPosition()?.equals(place.location));
      if (marker) {
        google.maps.event.trigger(marker, 'click');
      }
    }
  };

  return (
    <div className="map-section">
      <div className="map-container" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div ref={mapRef} className="map-canvas" style={{ width: '100%', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}></div>
        <div className="map-controls" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <label htmlFor="typeSelect">เลือกประเภทสถานที่:</label>
            <select
              id="typeSelect"
              className="type-select"
              value={selectedType}
              onChange={(e) => handleTypeChange(e.target.value)}
              style={{ flex: 1, padding: '8px', fontSize: '14px' }}
            >
              <option value="hospital">โรงพยาบาล</option>
              <option value="pharmacy">ร้านขายยา</option>
            </select>
            <button
              id="useLocation"
              onClick={useCurrentLocation}
              style={{ padding: '8px 12px', whiteSpace: 'nowrap' }}
            >
              ใช้ตำแหน่งปัจจุบัน
            </button>
          </div>
          <div id="mapStatus" style={{ fontSize: '13px', color: '#333' }}>{mapStatus}</div>
          <div id="placeList" style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #e9ecef', borderRadius: '8px', padding: '5px' }}>
            {places.map((place, index) => {
              const distance = mapCenter ? google.maps.geometry.spherical.computeDistanceBetween(
                new google.maps.LatLng(mapCenter.lat, mapCenter.lng),
                place.location
              ) : 0;
              const distanceText = distance > 1000 ? (distance / 1000).toFixed(1) + ' กม.' : Math.round(distance) + ' ม.';
              return (
                <div
                  key={index}
                  className="place-card"
                  onClick={() => handlePlaceClick(place)}
                  style={{
                    background: '#fff',
                    borderRadius: '8px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                    marginBottom: '8px',
                    padding: '8px',
                    cursor: 'pointer',
                    border: '1px solid #f0f0f0'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)'}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.1)'}
                >
                  <h3 style={{ fontSize: '13px', margin: '0 0 4px 0', color: '#1B5E20', fontWeight: '600' }}>{place.displayName || 'ไม่ระบุชื่อ'}</h3>
                  <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#666' }}>{place.formattedAddress}</p>
                  <p style={{ color: '#888', fontSize: '11px', margin: '0', fontWeight: '500' }}>ระยะห่าง: {distanceText}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #e9ecef', textAlign: 'center' }}>
        <p style={{ color: '#6c757d', fontSize: '0.8rem', fontStyle: 'italic' }}>
          💡 ข้อมูลสถานที่มาจาก Google Maps • อัปเดตล่าสุด: {new Date().toLocaleString('th-TH')}
        </p>
      </div>
    </div>
  );
};

export default GoogleMapsView;