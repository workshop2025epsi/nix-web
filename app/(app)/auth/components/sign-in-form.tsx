"use client";

import { Button } from "@/components/ui/button";
import { ProgressCircle } from "@/components/ui/progress-circle";
import { TextField } from "@/components/ui/text-field";

import { Form } from "@/components/ui/form";
import { authClient } from "@/lib/auth/auth.client";
import { useForm } from "@/lib/utils/hooks/use-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod/v3";

const signInSchema = z.object({
    email: z.string().email("Adresse email invalide"),
    password: z.string().min(1, "Mot de passe requis"),
});

export default function SignInForm({ callbackURL = "/dashboard" }: { callbackURL?: string }) {
    const router = useRouter();
    const [isConditionalMediationAvailable, setIsConditionalMediationAvailable] = useState(false);
    const [isLoadingPasskey, setIsLoadingPasskey] = useState(false);
    const [email, setEmail] = useState("");
    const [showOTPModal, setShowOTPModal] = useState(false);

    useEffect(() => {
        let mounted = true;
        async function checkConditionalMediation() {
            if (
                typeof window !== "undefined" &&
                window.PublicKeyCredential &&
                typeof window.PublicKeyCredential.isConditionalMediationAvailable === "function"
            ) {
                const supported =
                    await window.PublicKeyCredential.isConditionalMediationAvailable();
                if (mounted) {
                    setIsConditionalMediationAvailable(supported);
                }
            }
        }
        checkConditionalMediation();
        return () => {
            mounted = false;
        };
    }, []);

    const { inputValues, inputErrors, handleChange, setError, handleSubmit, isLoading } = useForm({
        schema: signInSchema,
        initialValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: typeof inputValues) => {
        await authClient.signIn.email(
            {
                email: data.email,
                password: data.password,
            },
            {
                onError: (ctx: { error: { message: string } }) => {
                    setError("email", "Email ou mot de passe incorrect");
                },
                onSuccess: (ctx) => {
                    if (ctx.data.twoFactorRedirect) {
                        toast.info(
                            "Ce compte est protégé par une authentification à deux facteurs. Veuillez confirmer votre identité.",
                        );
                        setShowOTPModal(true);
                    } else {
                        toast.success("Vous avez été connecté avec succès !");
                        router.push(callbackURL);
                    }
                },
            },
        );
    };

    return (
        <>
            <Form
                validationErrors={inputErrors}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-3 w-full"
            >
                <TextField
                    type="text"
                    label="Adresse email"
                    value={inputValues.email}
                    errorMessage={inputErrors.email}
                    autoComplete="email"
                    placeholder="Entrez votre adresse email"
                    onChange={(v) => {
                        handleChange("email", v);
                        setEmail(v);
                    }}
                />
                <TextField
                    type="password"
                    label="Mot de passe"
                    value={inputValues.password}
                    errorMessage={inputErrors.password}
                    autoComplete="current-password"
                    placeholder="Entrez votre mot de passe"
                    isRevealable
                    onChange={(v) => handleChange("password", v)}
                />

                <Button
                    isDisabled={isLoading}
                    isPending={isLoading}
                    className="w-full"
                    type="submit"
                >
                    {({ isPending }) => (
                        <>
                            {isPending && (
                                <ProgressCircle
                                    isIndeterminate
                                    aria-label="Connexion en cours..."
                                />
                            )}
                            {isLoading ? "Connexion en cours..." : "Se connecter"}
                        </>
                    )}
                </Button>
            </Form>
        </>
    );
}
