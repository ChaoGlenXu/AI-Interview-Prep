"use client"

import { email, z } from "zod"
import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Image from "next/image" // <-- ADD THIS
import Link from "next/link" // <-- ADD THIS

import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Form,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
//import FormField from "./FormField"

import FormField from "@/components/FormField"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/firebase/client"
import { signIn, signUp } from "@/lib/actions/auth.action"

const formSchema = z.object({
  username: z.string().min(2).max(50),
})

const AuthFormSchema = (type: FormType) => {
    return z.object({
        name: type === 'sign-up' ? z.string().min(3) : z.string().optional(),
        email: z.email(),
        password: z.string().min(3),
    })
}


const AuthForm = ( {type}: {type: FormType} ) => {
    const router = useRouter();
    const formSchema = AuthFormSchema(type);

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        name: "",
        email: "",
        password: "",
        },
    })
    
    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        //console.log(values)

        try {
            if (type === 'sign-up') {
                const { name, email, password } = values;

                const userCredentials = await createUserWithEmailAndPassword(auth, email, password);

                const result = await signUp({
                    uid: userCredentials.user.uid,
                    name: name!,
                    email,
                    password,
                });

                if (!result?.success) {
                    toast.error(result?.message);
                    return;
                }

                toast.success('Account created successfully. Please sign in.');
                router.push('/sign-in');
                //console.log('SIGN UP', values)
            } else {
                const {email, password } = values;

                const userCredential = await signInWithEmailAndPassword(auth, email, password);

                const idToken = await userCredential.user.getIdToken();

                if (!idToken) {
                    toast.error('Sign in failed');
                    return;
                }

                await signIn({email, idToken});

                //console.log('SIGN IN', values)
                toast.success('Sign in successfully.');
                router.push('/');
            }
        } catch (error) {
            console.log(error);
            toast.error(`There was an error: ${error}`)
        }
    }

    const isSignIn = type === 'sign-in';

    return (
        <div className="card-border lg:min-w-[566px]">
            <div className="flex flex-col gap-6 card py-14 px-10">
                <div className="flex flex-row gap-2 justify-center">
                    <Image src="/logo_color_interview.svg" alt="logo" height={32} width={38} />

                    <h2 className="text-primary-100">CX Prep </h2>
                </div>

                <h3> Simulate Your Job Interview with AI</h3>
            
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
                        {/* <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="shadcn" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your public display name.
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        /> */}

                        { !isSignIn && (
                            <FormField 
                                control={form.control} 
                                name="name"
                                label="Name"
                                placeholder="Your Name"
                            />
                        )}
                        <FormField 
                            control={form.control} 
                            name="email"
                            label="Email"
                            placeholder="Your email address"
                            type="email"
                        />
                        <FormField 
                            control={form.control} 
                            name="password"
                            label="Password"
                            placeholder="Enter your password"
                            type="password"
                        />
                        <Button className="btn" type="submit">{isSignIn ? 'Sign in' : 'Create an Account'}</Button>
                    </form>
                </Form>

                <p className="text-center">
                    {isSignIn ? 'No account yet?' : 'Have an account already?'}
                    <Link href={!isSignIn ?  '/sign-in': '/sign-up' } className="font-bold text-red-500  ml-1" >
                        {!isSignIn ? "sign in" : "Sign up"}
                    </Link>
                </p>
            </div>
            <div className="text-blue-500">Hello Tailwind</div>


        </div>
        
  )
}

export default AuthForm
