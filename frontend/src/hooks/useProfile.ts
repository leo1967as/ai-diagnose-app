import { useState, useEffect } from 'react';
import { profileService } from '../services/profileService';
import { HealthProfile } from '../types';

export const useProfile = () => {
  const [profile, setProfile] = useState<HealthProfile | null>(null);

  useEffect(() => {
    const loadedProfile = profileService.loadProfile();
    if (loadedProfile) {
      setProfile(loadedProfile);
    }
  }, []);

  const saveProfile = (data: HealthProfile) => {
    profileService.saveProfile(data);
    setProfile(data);
  };

  const loadProfile = () => {
    const loaded = profileService.loadProfile();
    if (loaded) {
      setProfile(loaded);
    }
    return loaded;
  };

  return { profile, saveProfile, loadProfile };
};