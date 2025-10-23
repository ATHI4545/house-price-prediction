import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCymTiwnmGa16idSeLtl0-zM08BH9LKSxc",
  authDomain: "mltproject-d8cb9.firebaseapp.com",
  projectId: "mltproject-d8cb9",
  storageBucket: "mltproject-d8cb9.firebasestorage.app",
  messagingSenderId: "1006020149287",
  appId: "1:1006020149287:web:6b8ef08e77a322cd4a8e02"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
