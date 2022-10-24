import { initializeApp } from "firebase/app";
import { getFirestore, Timestamp } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyDmSx_m5lHNMb-oGVmGCUieiM-Od2lBoJw",
  authDomain: "project-management-dfe87.firebaseapp.com",
  projectId: "project-management-dfe87",
  storageBucket: "project-management-dfe87.appspot.com",
  messagingSenderId: "113988338335",
  appId: "1:113988338335:web:dde440c0e9b2aae6d158aa"
};

const app = initializeApp(firebaseConfig);

const projectFirestore = getFirestore(app)
const projectAuth = getAuth(app)
const projectStorage = getStorage(app)
const timestamp = Timestamp

export { projectAuth, projectFirestore, projectStorage, timestamp }