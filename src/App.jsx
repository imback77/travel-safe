import { useState, useEffect } from 'react'
import Map from './components/Map'

function App() {
  // 위치 정보를 저장할 '상자' (기본값은 아직 못 찾음 'null')
  const [currentLocation, setCurrentLocation] = useState(null)
  const [locationError, setLocationError] = useState('')

  // 앱이 처음 켜질 때 한 번만 실행되는 마법의 주문 (useEffect)
  useEffect(() => {
    // 1. 브라우저가 위치 탐지기를 지원하는지 확인
    if (navigator.geolocation) {
      // 2. 현재 내 위치를 파악해 줘!
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // 성공: 내 진짜 위도(lat), 경도(lng)를 찾아서 상자(currentLocation)에 넣음!
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          // 실패: 위치 접근을 거부했거나 오류가 났을 때
          setLocationError('위치 정보를 가져올 수 없습니다. 권한을 허용해 주세요.')
          console.error(error)
        }
      )
    } else {
      setLocationError('이 브라우저는 위치 추적을 지원하지 않습니다.')
    }
  }, []) // 빈 괄호 []는 "처음 켜질 때 딱 한 번만!"이라는 뜻입니다.

  return (
    <div className="app-container">
      {/* 지도 계층 (배경) */}
      <div className="map-layer">
        {/* 찾아낸 진짜 위치(currentLocation)를 Map 컴포넌트에게 넘겨줍니다! */}
        <Map currentLocation={currentLocation} />
      </div>

      {/* UI 계층 (지도 위에 떠 있는 메뉴들) */}
      <div className="ui-layer">
        <header className="main-header glass-header">
          <h1>🛡️ Travel Safe</h1>
          <p>가족 안심 모니터링 중</p>
        </header>

        <main className="content bottom-pane">
          <div className="card glass">
            <h2>🌍 위치 추적 시작</h2>
            {/* 위치를 못 찾았을 때 나오는 경고창 */}
            {locationError ? (
              <p style={{ color: '#ef4444' }}>{locationError}</p>
            ) : currentLocation ? (
              <p>내 진짜 위치를 찾았습니다! 지도가 이동방향을 설정합니다.</p>
            ) : (
              <p>위치를 탐색 중입니다... 📡</p>
            )}
            
            <button className="sos-button" onClick={() => alert('긴급 상황 버튼이 곧 연동됩니다!')}>
              🆘 SOS (긴급 알림)
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
