'use server';

import { db, auth } from "@/firebase/admin";
import {  messaging } from "firebase-admin";
//import { success } from "zod";



//import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
//import { doc, getDoc, setDoc } from "firebase-admin/firestore"; // Admin SDK functions  //try chatgpt advice 

import { cookies } from "next/headers";
import { success } from "zod";


//import { db } from "@/firebase/admin"; // Admin SDK //try chatgpt advice 

const ONE_WEEK = 60 * 60 * 24 * 7 * 1000;

export async function signUp( params: SignUpParams ) {
    const { uid, name, email } = params;

    

    try {
        const userRecord = await db.collection('user'). doc(uid).get(); //for version 8 firebase, not this new version
        
        //const db = getFirestore();
        // const userDocRef = doc(db, "user", uid);
        // const userRecord = await getDoc(userDocRef);

        if (userRecord.exists) 
            return {
                success: false,
                message: 'User already exists, Please sign in instead.'
            }

        await db.collection('user'). doc(uid).set({
            name, email
        });
            
        
        //await setDoc(userDocRef,{name, email} );

        return {
            success: true,
            message: 'Account created successfully. Please sign in.'
        }

    } catch (e: any) {
        console.error('Error creating a user', e);

        if (e.code === 'auth/email-already-exists') {
            return {
                success: false,
                message: 'This email is already in use.'
            }
        }

        return {
            success: false,
            message: 'Failed to create an account'
        }
    }
}

export async function signIn (params: SignInParams) {
    const {email, idToken} = params;

    try {
        const userRecord = await auth.getUserByEmail(email);

        if (!userRecord) {
            return {
                success: false,
                message: 'User does not exist. Create an account instead.'
            }
        }

        await setSessionCookie(idToken);


    } catch (e) {
        console.log(e);

        return {
            success: false,
            message: 'Failed to log into an account.'
        }
    }
}


export async function setSessionCookie (idToken: string) {
    const cookieStore = await cookies();

    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: ONE_WEEK,
    });

    cookieStore.set('session', sessionCookie, {
        maxAge: ONE_WEEK,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax'
    });
}

