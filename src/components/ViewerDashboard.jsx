import React from 'react';

// App.jsx에서 수신한 알림(alerts) 리스트를 넘겨받습니다.
function ViewerDashboard({ alerts }) {
  // 알림이 1개라도 있으면 '위험 상태'
  const hasAlert = alerts && alerts.length > 0;

  return (
    <div className={`card glass ${hasAlert ? 'pulse-alert' : ''}`} style={hasAlert ? { borderColor: '#ef4444', animation: 'emergencyPulse 2s infinite' } : {}}>
      <h2>📡 관제탑 모니터링</h2>
      
      {hasAlert ? (
        <div style={{ color: '#ef4444', fontWeight: 'bold', marginBottom: '1rem' }}>
          🚨 긴급 상황 수신 중!
        </div>
      ) : (
        <p style={{ color: '#10b981' }}>🟢 현재 평온합니다. 수신 대기 중...</p>
      )}

      {/* 수신된 알림 목록을 하나씩 예쁘게 뽑아서 보여줍니다 */}
      <div style={{ maxHeight: '200px', overflowY: 'auto', textAlign: 'left', marginTop: '1rem' }}>
        {alerts && alerts.map((alert) => (
          <div key={alert.id} style={{
            background: 'rgba(0,0,0,0.3)', 
            padding: '10px', 
            borderRadius: '8px',
            marginBottom: '10px',
            borderLeft: '4px solid #ef4444'
          }}>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              {alert.timestamp ? new Date(alert.timestamp.toDate()).toLocaleString() : '방금 전'}
            </div>
            <div style={{ fontWeight: 'bold', margin: '5px 0' }}>{alert.message}</div>
            <div style={{ fontSize: '0.8rem', color: '#60a5fa' }}>
              위치: {alert.location?.lat.toFixed(4)}, {alert.location?.lng.toFixed(4)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default React.memo(ViewerDashboard);
