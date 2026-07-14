import React from 'react';
import GoogleMapsView from './GoogleMapsView';

interface NearbyLocationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NearbyLocationsModal: React.FC<NearbyLocationsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content nearby-locations-modal" onClick={(e) => e.stopPropagation()}>
        <span className="close-button" onClick={onClose}>&times;</span>
        <h2>ค้นหาร้านขายยาและโรงพยาบาลใกล้เคียง</h2>
        <div className="location-modal-body" style={{ padding: '1rem' }}>
          <GoogleMapsView />
        </div>
      </div>
    </div>
  );
};

export default NearbyLocationsModal;