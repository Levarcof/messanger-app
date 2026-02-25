"use client";
import { useCallback, useEffect, useState } from "react";
import Input from "@/app/components/input/input";
import AuthSocialButton from "./AuthSocialButton";
import { BsGithub, BsGoogle } from "react-icons/bs";
import Button from "@/app/components/Button";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

import toast from "react-hot-toast";
import { redirect } from "next/dist/server/api-utils";
type variant = 'LOGIN' | 'REGISTER';
const AuthForm = () => {
    const session = useSession();
    const router = useRouter();
    const [variant, setVariant] = useState<variant>('LOGIN');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (session?.status == 'authenticated') {
            router.push('/users');

        }
    }, [session?.status, session]);

    const toggleVariant = useCallback(() => {
        if (variant == 'LOGIN') {
            setVariant('REGISTER');
        }
        else {
            setVariant('LOGIN');
        }
    }, [variant]);

    const {
        register,
        handleSubmit,
        formState: {
            errors
        }
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);
        if (variant == 'REGISTER') {
            axios.post('/api/register', data)
                .then(() => signIn('credentials', data))
                .catch(() => toast.error('Somthing went wrong'))
                .finally(() => setIsLoading(false))

        }

        if (variant == 'LOGIN') {
            signIn('credentials', { ...data, redirect: false })
                .then((callback) => {
                    if (callback && callback.error) {
                        toast.error("Invalid credintials");
                    }

                    if (callback?.ok && !callback?.error) {
                        toast.success("Logged in!")
                        router.push('/users');
                    }
                })
                .finally(() => setIsLoading(false));
        }


    }
    const socialAction = (action: string) => {
        setIsLoading(true);

        signIn(action, { redirect: false })
            .then((callback) => {
                if (callback?.error) {
                    toast.error("Invalid credintials");
                }

                if (callback?.ok && !callback?.error) {
                    toast.success("Logged in!")
                }
            })
            .finally(() => setIsLoading(false));
    }


    return (
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-[#141414] px-4 py-10 shadow-premium sm:rounded-2xl sm:px-10 ring-1 ring-white/5">
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    {variant == 'REGISTER' && (
                        <Input id="name" label="Full Name" register={register} errors={errors} />
                    )}
                    <Input id="email" label="Email Address" type="email" register={register} errors={errors} />
                    <Input id="password" label="Password" type="password" register={register} errors={errors} />
                    <div className="pt-2">
                        <Button fullWidth type="submit" disabled={isLoading}>{variant == 'LOGIN' ? 'Sign in' : 'Create Account'}</Button>
                    </div>
                </form>
                <div className="mt-8">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/5" />
                        </div>

                        <div className="relative flex justify-center text-sm">
                            <span className="bg-[#141414] px-4 text-neutral-500 font-medium">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <div className="mt-8 flex gap-3">
                        <AuthSocialButton icon={BsGithub} onClick={() => socialAction('github')} />
                        <AuthSocialButton icon={BsGoogle} onClick={() => socialAction('google')} />
                    </div>
                </div>

                <div className="flex gap-2 justify-center text-sm mt-8 px-2 text-neutral-500">
                    <div>
                        {variant == 'LOGIN' ? 'New here?' : 'Already have an account?'}
                    </div>
                    <div className="text-wine-500 font-semibold hover:underline cursor-pointer transition-all" onClick={toggleVariant}>
                        {variant == 'LOGIN' ? 'Create an account' : 'Sign in'}
                    </div>
                </div>
            </div>
        </div>

    );
}

export default AuthForm;