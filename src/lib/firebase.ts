import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserSessionPersistence } from 'firebase/auth';

const firebaseConfig = {
	apiKey: 'AIzaSyAznUaMlh9nYQEzoIcvTOQW-iqJLeBJNlk',
	authDomain: 'kuisin-19024.firebaseapp.com',
	projectId: 'kuisin-19024',
	storageBucket: 'kuisin-19024.appspot.com',
	messagingSenderId: '937069231597',
	appId: '1:937069231597:web:4891eb1266dc2f0887fbe4',
	measurementId: 'G-20K12VGNCR'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
setPersistence(auth, browserSessionPersistence);
