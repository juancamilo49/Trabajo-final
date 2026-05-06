// js/firebase-config.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import {
    getFirestore, collection, addDoc, onSnapshot,
    doc, getDoc, query, where, orderBy, serverTimestamp, limit
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let app, db;

try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("Firebase initialized");
} catch (error) {
    console.warn("Firebase no está configurado aún o las credenciales son incorrectas.");
}

// ─── ECOS (sub-collection) ──────────────────
// Each incidente doc can have a sub-collection "ecos"
// Fields: mensaje (string ≤140), simbolo_id (0|1|2), timestamp

async function addEco(incidenteId, mensaje, simboloId) {
    if (!db) return null;
    const ecosRef = collection(db, "incidentes", incidenteId, "ecos");
    return addDoc(ecosRef, {
        mensaje: mensaje.slice(0, 140),
        simbolo_id: simboloId,
        timestamp: serverTimestamp()
    });
}

function listenEcos(incidenteId, callback) {
    if (!db) return () => {};
    const ecosRef = collection(db, "incidentes", incidenteId, "ecos");
    const q = query(ecosRef, orderBy("timestamp", "desc"), limit(50));
    return onSnapshot(q, (snapshot) => {
        const ecos = [];
        snapshot.forEach(docSnap => {
            ecos.push({ id: docSnap.id, ...docSnap.data() });
        });
        callback(ecos);
    });
}

export {
    db, collection, addDoc, onSnapshot,
    doc, getDoc, query, where, orderBy, serverTimestamp,
    addEco, listenEcos
};
