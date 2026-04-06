import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH 
    ? path.resolve(process.cwd(), process.env.FIREBASE_SERVICE_ACCOUNT_PATH)
    : null;

// Render specific fallback
if (!serviceAccountPath || !fs.existsSync(serviceAccountPath)) {
    if (fs.existsSync('/etc/secrets/firebase-service-account.json')) {
        serviceAccountPath = '/etc/secrets/firebase-service-account.json';
    }
}

if (serviceAccountPath && fs.existsSync(serviceAccountPath)) {
    try {
        const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log('Firebase Admin initialized successfully.');
    } catch (error) {
        console.error('Error initializing Firebase Admin with service account:', error);
    }
} else {
    console.warn(`Firebase service account file not found at ${serviceAccountPath}. Google Login will not work until this is provided.`);
}

export default admin;
