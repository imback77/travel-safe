import React from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100vw',
  height: '100vh',
};

// 위치를 못 찾았을 때 기본값 (서울 시청)
const defaultCenter = {
  lat: 37.5665,
  lng: 126.9780,
};

// App.jsx에서 'currentLocation' 상자를 통째로 넘겨받았어요!
function Map({ currentLocation }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  // currentLocation 값이 있으면 내 현재 위치를, 없으면 기본값(서울)을 지도 중심으로 설정
  const mapCenter = currentLocation || defaultCenter;

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={mapCenter}
      zoom={16} // 조금 더 가까이 확대 (14 -> 16)
      options={{
        disableDefaultUI: true, 
        zoomControl: true,      
      }}
    >
      {/* 내 현재 위치 상자에 값이 담겨있다면, 지도 위에 예쁜 마커를 콕! 찍어 줍니다 */}
      {currentLocation && (
        <Marker 
          position={currentLocation} 
          icon={{
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" // 파란색 안심 마커
          }}
        />
      )}
    </GoogleMap>
  ) : (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>
      지도 로딩 중... 🗺️
    </div>
  );
}

export default React.memo(Map);
