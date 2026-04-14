import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// .env.local 파일에 적어둔 열쇠(환경변수)들을 불러옵니다.
// 빈 칸으로 두면 에러가 날 수 있으니 일단 기본 구조만 연결해둡니다.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// 열쇠가 입력되어 있을 때만 Firebase를 초기화하도록 안전장치 추가!
let app;
let db;

try {
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== '여기에_입력하세요') {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("Firebase 연결 준비 완료! 🔗");
  } else {
    console.warn("⚠️ Firebase 키가 아직 입력되지 않았습니다. .env.local 파일을 확인해주세요.");
  }
} catch (error) {
  console.error("Firebase 초기화 중 에러 발생:", error);
}

// 다른 파일에서 db(데이터베이스)를 꺼내 쓸 수 있게 수출(export)합니다.
export { db };
