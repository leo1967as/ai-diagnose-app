import React, { useState, useEffect } from 'react'
import { Location } from '../types'
import { locationService } from '../services/locationService'

interface LocationViewProps {
  className?: string
}

const LocationView: React.FC<LocationViewProps> = ({ className = '' }) => {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null)

  useEffect(() => {
    // ไม่เรียก loadLocations อัตโนมัติ เพื่อป้องกัน geolocation violation
    // จะเรียกเมื่อผู้ใช้คลิกปุ่มอนุญาตตำแหน่ง
  }, [])

  const loadLocations = async () => {
    try {
      setLoading(true)
      setError(null)

      // 1. ได้ตำแหน่งผู้ใช้ก่อน
      console.log('LocationView: Getting user location...')
      const position = await locationService.getCurrentPosition()
      setUserLocation(position)

      // 2. ดึงข้อมูลสถานที่ใกล้เคียง
      console.log('LocationView: Fetching nearby locations...')
      const nearbyLocations = await locationService.getNearbyLocations(position.lat, position.lng)

      setLocations(nearbyLocations)
      console.log('LocationView: Loaded', nearbyLocations.length, 'locations')
    } catch (err) {
      console.error('LocationView: Error loading locations:', err)
      const errorMessage = err instanceof Error ? err.message : 'ไม่สามารถโหลดข้อมูลตำแหน่งได้'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const openInMaps = (location: Location) => {
    // สร้าง URL สำหรับเปิดใน Google Maps
    const url = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}&destination_place_id=${location.name}`
    window.open(url, '_blank')
  }

  const hospitals = locations.filter(loc => loc.type === 'hospital')
  const pharmacies = locations.filter(loc => loc.type === 'pharmacy')


  // ถ้ายังไม่มีตำแหน่งผู้ใช้ แสดงปุ่มขอตำแหน่ง
  if (!userLocation && !error) {
    return (
      <div className={`location-permission ${className}`}>
        <div className="permission-icon">📍</div>
        <h4>ค้นหาสถานที่ใกล้เคียง</h4>
        <p>เพื่อแสดงโรงพยาบาลและร้านขายยาที่อยู่ใกล้คุณ</p>
        <button className="permission-button" onClick={loadLocations}>
          อนุญาตเข้าถึงตำแหน่ง
        </button>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`location-error ${className}`}>
        <div className="error-icon">⚠️</div>
        <p>{error}</p>
        <button className="retry-button" onClick={loadLocations}>
          ลองใหม่
        </button>
      </div>
    )
  }

  return (
    <div className={`location-view ${className}`}>
      <div className="location-header">
        <h3>สถานที่ใกล้เคียง</h3>
        <p className="location-subtitle">
          ค้นพบโรงพยาบาลและร้านขายยาที่อยู่ใกล้คุณ
          {userLocation && (
            <span className="location-coords">
              (ตำแหน่งปัจจุบัน: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)})
            </span>
          )}
        </p>
      </div>

      {locations.length === 0 ? (
        <div className="no-locations">
          <p>ไม่พบสถานที่ใกล้เคียงในบริเวณนี้</p>
        </div>
      ) : (
        <div className="locations-container">
          {/* โรงพยาบาล */}
          {hospitals.length > 0 && (
            <div className="location-section">
              <h4 className="section-title hospital-title">
                🏥 โรงพยาบาลและคลินิก ({hospitals.length} แห่ง)
              </h4>
              <div className="location-list">
                {hospitals.map((location, index) => (
                  <div key={`hospital-${index}`} className="location-card hospital-card">
                    <div className="location-info">
                      <div className="location-name">{location.name}</div>
                      <div className="location-address">{location.address}</div>
                      {location.phone && (
                        <div className="location-phone">📞 {location.phone}</div>
                      )}
                      <div className="location-distance">
                        📍 ระยะทาง: {location.distance.toFixed(1)} กม.
                      </div>
                    </div>
                    <button
                      className="maps-button"
                      onClick={() => openInMaps(location)}
                      title="เปิดใน Google Maps"
                    >
                      🗺️ เส้นทาง
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ร้านขายยา */}
          {pharmacies.length > 0 && (
            <div className="location-section">
              <h4 className="section-title pharmacy-title">
                💊 ร้านขายยา ({pharmacies.length} แห่ง)
              </h4>
              <div className="location-list">
                {pharmacies.map((location, index) => (
                  <div key={`pharmacy-${index}`} className="location-card pharmacy-card">
                    <div className="location-info">
                      <div className="location-name">{location.name}</div>
                      <div className="location-address">{location.address}</div>
                      {location.phone && (
                        <div className="location-phone">📞 {location.phone}</div>
                      )}
                      <div className="location-distance">
                        📍 ระยะทาง: {location.distance.toFixed(1)} กม.
                      </div>
                    </div>
                    <button
                      className="maps-button"
                      onClick={() => openInMaps(location)}
                      title="เปิดใน Google Maps"
                    >
                      🗺️ เส้นทาง
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="location-footer">
        <p className="location-note">
          💡 ข้อมูลสถานที่มาจาก OpenStreetMap • อัปเดตล่าสุด: {new Date().toLocaleString('th-TH')}
        </p>
      </div>
    </div>
  )
}

export default LocationView