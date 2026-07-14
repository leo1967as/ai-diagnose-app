import { Location } from '../types'

// Type declarations for Google Maps
declare global {
  interface Window {
    google: any
    googleMapsCallback: () => void
    googleMapsLoaded: boolean
  }
}

class LocationService {

  // แคชข้อมูลเพื่อประสิทธิภาพ - เก็บใน memory และ localStorage
  private cache: Map<string, { data: Location[], timestamp: number }> = new Map()
  private readonly CACHE_DURATION = 30 * 60 * 1000 // 30 นาที

  /**
   * คำนวณระยะทางระหว่างสองจุดโดยใช้ Haversine formula
   */
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371 // รัศมีโลกในกิโลเมตร
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  /**
   * โหลด Google Maps Places Library
   */
  private async loadPlacesLibrary(): Promise<any> {
    try {
      // โหลดทั้ง places และ geometry libraries
      await (window as any).google.maps.importLibrary("geometry");
      const { Place } = await (window as any).google.maps.importLibrary("places");
      return Place;
    } catch (error) {
      throw new Error('Failed to load Google Maps Places library: ' + error);
    }
  }


  /**
   * แปลงข้อมูลจาก Google Places API เป็น Location objects
   */
  private parsePlacesResponse(data: any, userLat: number, userLng: number, type: 'hospital' | 'pharmacy'): Location[] {
    const locations: Location[] = []

    if (data.places && Array.isArray(data.places)) {
      data.places.forEach((place: any) => {
        const lat = place.location?.latitude
        const lng = place.location?.longitude

        if (!lat || !lng) return

        const name = place.displayName?.text || 'ไม่ระบุชื่อ'
        const address = place.formattedAddress || 'ไม่ระบุที่อยู่'
        const phone = place.internationalPhoneNumber || place.nationalPhoneNumber

        const distance = this.calculateDistance(userLat, userLng, lat, lng)

        locations.push({
          name,
          address,
          lat,
          lng,
          phone,
          distance,
          type
        })
      })
    }

    return locations
  }

  /**
   * ตรวจสอบและโหลดข้อมูลจากแคช
   */
  private getCachedData(cacheKey: string): Location[] | null {
    // ตรวจสอบ memory cache
    const memoryCache = this.cache.get(cacheKey)
    if (memoryCache && Date.now() - memoryCache.timestamp < this.CACHE_DURATION) {
      return memoryCache.data
    }

    // ตรวจสอบ localStorage cache
    try {
      const stored = localStorage.getItem(`location_cache_${cacheKey}`)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Date.now() - parsed.timestamp < this.CACHE_DURATION) {
          // อัปเดต memory cache
          this.cache.set(cacheKey, parsed)
          return parsed.data
        } else {
          // ลบแคชที่หมดอายุ
          localStorage.removeItem(`location_cache_${cacheKey}`)
        }
      }
    } catch (error) {
      console.warn('Error reading location cache:', error)
    }

    return null
  }

  /**
   * บันทึกข้อมูลลงแคช
   */
  private setCachedData(cacheKey: string, data: Location[]): void {
    const cacheData = { data, timestamp: Date.now() }

    // บันทึก memory cache
    this.cache.set(cacheKey, cacheData)

    // บันทึก localStorage cache
    try {
      localStorage.setItem(`location_cache_${cacheKey}`, JSON.stringify(cacheData))
    } catch (error) {
      console.warn('Error saving location cache:', error)
    }
  }

  /**
   * ดึงข้อมูลตำแหน่งโรงพยาบาลและร้านขายยาใกล้เคียง
   */
  async getNearbyLocations(lat: number, lng: number, radius: number = 5000): Promise<Location[]> {
    const cacheKey = `${lat.toFixed(4)}_${lng.toFixed(4)}_${radius}`

    // ตรวจสอบแคชก่อน
    const cached = this.getCachedData(cacheKey)
    if (cached) {
      console.log('Using cached location data')
      return cached
    }

    try {
      const allLocations: Location[] = []

      // ดึงโรงพยาบาล
      const hospitalLocations = await this.searchNearbyPlaces(lat, lng, radius, 'hospital')
      allLocations.push(...hospitalLocations)

      // ดึงร้านขายยา
      const pharmacyLocations = await this.searchNearbyPlaces(lat, lng, radius, 'pharmacy')
      allLocations.push(...pharmacyLocations)

      // เรียงตามระยะทางและจำกัดจำนวน
      const sortedLocations = allLocations
        .sort((a: Location, b: Location) => a.distance - b.distance)
        .slice(0, 10)

      // บันทึกแคช
      this.setCachedData(cacheKey, sortedLocations)

      return sortedLocations
    } catch (error) {
      console.error('Error fetching locations:', error)
      // ส่งคืนข้อมูลว่างแทนที่จะโยน error เพื่อไม่ให้ UI หยุดทำงาน
      return []
    }
  }

  /**
   * ค้นหาสถานที่ใกล้เคียงด้วย Google Places Library
   */
  private async searchNearbyPlaces(lat: number, lng: number, radius: number, type: 'hospital' | 'pharmacy'): Promise<Location[]> {
    try {
      // โหลด Places library แบบ dynamic
      const Place = await this.loadPlacesLibrary()

      const center = { lat, lng }
      const diameter = radius * 2 // คำนวณ diameter จาก radius
      const constrainedRadius = Math.min(diameter / 2, 50000) // ไม่เกิน 50000 เมตร

      const request = {
        fields: ['displayName', 'location', 'formattedAddress', 'internationalPhoneNumber', 'nationalPhoneNumber'],
        locationRestriction: {
          center,
          radius: constrainedRadius,
        },
        includedTypes: [type],
        maxResultCount: 5,
        rankPreference: 'DISTANCE', // ใช้ DISTANCE แทน POPULARITY เพื่อให้ได้ผลที่ดีกว่า
      }

      const { places } = await Place.searchNearby(request)

      if (places && places.length > 0) {
        const locations = this.parsePlacesResults(places, lat, lng, type)
        return locations
      } else {
        console.warn(`No places found for ${type}`)
        return []
      }
    } catch (error) {
      console.error(`Places search failed for ${type}:`, error)
      return [] // ส่งคืน array ว่างแทน error
    }
  }

  /**
   * แปลงผลลัพธ์จาก Google Places เป็น Location objects
   */
  private parsePlacesResults(results: any[], userLat: number, userLng: number, type: 'hospital' | 'pharmacy'): Location[] {
    return results.map((place: any) => {
      const location = place.location
      const lat = typeof location?.lat === 'function' ? location.lat() : location?.lat || 0
      const lng = typeof location?.lng === 'function' ? location.lng() : location?.lng || 0

      const distance = this.calculateDistance(userLat, userLng, lat, lng)

      return {
        name: place.displayName?.text || 'ไม่ระบุชื่อ',
        address: place.formattedAddress || 'ไม่ระบุที่อยู่',
        lat,
        lng,
        phone: place.internationalPhoneNumber || place.nationalPhoneNumber,
        distance,
        type
      }
    })
  }

  /**
   * ดึงตำแหน่งปัจจุบันของผู้ใช้
   */
  async getCurrentPosition(): Promise<{ lat: number, lng: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`))
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // ใช้ข้อมูลที่ได้ใน 5 นาทีที่ผ่านมา
        }
      )
    })
  }
}

export const locationService = new LocationService()