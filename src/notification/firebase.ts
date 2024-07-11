// Import the functions you need from the SDKs you need
// link to setup FCM project: https://console.firebase.google.com/
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';
import { getFirestore } from '@firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyB7h6zlWRVfA1DnpPyCRbNMouLyOoRrWVs",
    authDomain: "home-travel-0262.firebaseapp.com",
    projectId: "home-travel-0262",
    storageBucket: "home-travel-0262.appspot.com",
    messagingSenderId: "629045118682",
    appId: "1:629045118682:web:69042f2ea7d09754fe87e3"
  };

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
export const db = getFirestore(app);

export const generateToken = async () => {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
        const token = await getToken(messaging, {
            vapidKey:
                'BCTBP6_3523QQnJSN1GQ583NMAR4Fc4Tj4YmEcyzCbAcqUzBigabIsjeQ5BMDQfY0cBTljtqxwSRUuC6EDLBRpQ',
        });
        const tokenReturn = token
        return tokenReturn;
    }
    return ""
};
