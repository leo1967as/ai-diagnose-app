import { HealthProfile } from '../types'

const PROFILE_KEY = 'userHealthProfile'

class ProfileService {
  saveProfile(profileData: HealthProfile): void {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profileData))
    // Silent save - no alert, can be handled by UI component if needed
  }

  loadProfile(): HealthProfile | null {
    const profile = localStorage.getItem(PROFILE_KEY)
    return profile ? JSON.parse(profile) : null
  }
}

export const profileService = new ProfileService()