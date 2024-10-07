import * as Firestore from "firebase/firestore";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyABG-MaXFT-UAPvnfJjxAH-rKKr0VL296s",
  authDomain: "bim-dev-master-7ab11.firebaseapp.com",
  projectId: "bim-dev-master-7ab11",
  storageBucket: "bim-dev-master-7ab11.appspot.com",
  messagingSenderId: "857760774097",
  appId: "1:857760774097:web:2c33824660a30b9b5e12f0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestoreDB = Firestore.getFirestore();

// Function to get a collection reference
export function getCollection<T>(path: string){
    return Firestore.collection(firestoreDB, path) as Firestore.CollectionReference<T>;
}

// Function to delete files 
export async function deleteDocument(path: string, id: string){
    const doc = Firestore.doc(firestoreDB, `${path}/${id}`);
    await Firestore.deleteDoc(doc);
}

// Function to update projects
export async function updateDocument<T extends Record<string, any>>(path: string, id: string, data: T){
    const doc = Firestore.doc(firestoreDB, `${path}/${id}`);
    await Firestore.updateDoc(doc, {});
}

//ToDo update projects in firebase with the above function
//TIP
//updateDocument<Partial<IProject>>('/projects', 'asdfasd', {name: 'new name'});