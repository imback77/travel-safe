import { useState, useEffect } from 'react'
import Map from './components/Map'
import ViewerDashboard from './components/ViewerDashboard'
import { db } from './firebase'
// onSnapshot, query, orderBy 추가
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from 'firebase/firestore'

function App() {
  const [currentLocation, setCurrentLocation] = useState(null)
  const [locationError, setLocationError] = useState('')
  const [isSending, setIsSending] = useState(false)
  
  // 🔘 모드 스위치: 'traveler' (여행자) 또는 'viewer' (관제탑)
  const [appMode, setAppMode] = useState('traveler')
  // 📩 수신된 알람 데이터를 담을 빈 상자
  const [alerts, setAlerts] = useState([])

  // 위치 수집 useEffect (기존 동일)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          setLocationError('위치 정보를 가져올 수 없습니다. 권한을 허용해 주세요.')
          console.error(error)
        }
      )
    } else {
      setLocationError('이 브라우저는 위치 추적을 지원하지 않습니다.')
    }
  }, [])

  // 📡 [신규] 실시간 알람 감지기 (Viewer 모드일 때와 상관없이 항상 귀를 열어둠)
  useEffect(() => {
    if (!db) return; // 서버 키가 없으면 패스

    // sos_alerts 폴더 안의 내용들을 시간 역순(최신순)으로 가져옵니다
    const q = query(collection(db, "sos_alerts"), orderBy("timestamp", "desc"));
    
    // onSnapshot: 폴더 내용이 바뀔 때마다 실시간으로 알려주는 마법의 기능!
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newAlerts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAlerts(newAlerts);
    });

    // 앱이 꺼지면 귀를 닫습니다.
    return () => unsubscribe();
  }, [])

  // SOS 발송 버튼 동작 (기존과 동일)
  const handleSOSButtonClick = async () => {
    if (!currentLocation) {
      alert("⚠️ 내 위치를 아직 찾지 못해 알람을 보낼 수 없습니다.");
      return;
    }
    if (!db) {
      alert("🛑 서버 키(API Key)가 아직 장착되지 않았습니다.\nFirebase 설정 후 다시 눌러보세요!");
      return;
    }

    setIsSending(true);
    try {
      await addDoc(collection(db, "sos_alerts"), {
        location: currentLocation,
        timestamp: serverTimestamp(),
        message: "긴급 상황 발생! 현재 위치를 확인해 주세요."
      });
      // (알림창 주석 처리: 실시간 반영을 화면으로 바로 보게 하기 위함)
      // alert("🚨 가족들에게 긴급 구조 신호와 실시간 위치가 전송되었습니다!");
    } catch (e) {
      console.error("에러 발생: ", e);
      alert("전송 중 문제가 발생했습니다. 관리자에게 문의하세요.");
    } finally {
      setIsSending(false);
    }
  }

  // 화면 위쪽에 띄울 '토글 스위치' 디자인
  const toggleStyle = {
    background: 'rgba(0,0,0,0.5)',
    borderRadius: '30px',
    padding: '5px',
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '1rem',
    pointerEvents: 'auto'
  }

  const btnStyle = (mode) => ({
    padding: '8px 20px',
    borderRadius: '25px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    background: appMode === mode ? '#3b82f6' : 'transparent',
    color: appMode === mode ? 'white' : '#94a3b8',
    transition: 'all 0.3s ease'
  })

  // 관제탑에 알람이 들어왔을 때 중심 좌표를 여행자 쪽으로 땡겨볼까요?
  // 알람이 있으면 최신 알람 위치를, 없으면 내 폰의 위치를 지도 중앙으로!
  const mapCenterToRender = appMode === 'viewer' && alerts.length > 0 
    ? alerts[0].location 
    : currentLocation;

  return (
    <div className="app-container">
      <div className="map-layer">
        {/* 지도의 중심점이 상황에 따라 바뀝니다! */}
        <Map currentLocation={mapCenterToRender} />
      </div>

      <div className="ui-layer">
        <header className="main-header glass-header" style={{ position: 'relative' }}>
          
          {/* 🔘 모드 전환 토글 스위치 */}
          <div style={toggleStyle}>
            <button style={btnStyle('traveler')} onClick={() => setAppMode('traveler')}>
              🧳 여행자 모드
            </button>
            <button style={btnStyle('viewer')} onClick={() => setAppMode('viewer')}>
              📡 모니터링 모드
            </button>
          </div>

          <h1>🛡️ Travel Safe</h1>
          <p>{appMode === 'traveler' ? '가족 안심 모니터링 중' : '여행자 위치 관제 중'}</p>
        </header>

        <main className="content bottom-pane">
          {appMode === 'traveler' ? (
            // ================= [여행자 화면] =================
            <div className="card glass">
              <h2>🌍 위치 추적 시작</h2>
              {locationError ? (
                <p style={{ color: '#ef4444' }}>{locationError}</p>
              ) : currentLocation ? (
                <p>내 진짜 위치를 찾았습니다! 지도가 이동방향을 설정합니다.</p>
              ) : (
                <p>위치를 탐색 중입니다... 📡</p>
              )}
              
              <button 
                className="sos-button" 
                onClick={handleSOSButtonClick}
                disabled={isSending}
              >
                {isSending ? "전송 중... 📡" : "🆘 SOS (긴급 알림 발사)"}
              </button>
            </div>
          ) : (
            // ================= [관제탑 화면] =================
            <ViewerDashboard alerts={alerts} />
          )}
        </main>
      </div>
    </div>
  )
}

export default App

