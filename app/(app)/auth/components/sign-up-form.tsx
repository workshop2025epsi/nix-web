"use client";

import { Button } from "@/components/ui/button";
import { ProgressCircle } from "@/components/ui/progress-circle";
import { TextField } from "@/components/ui/text-field";

import { Form } from "@/components/ui/form";
import { authClient } from "@/lib/auth/auth.client";
import { useForm } from "@/lib/utils/hooks/use-form";
import { Check, X } from "lucide-react";
import { useId, useMemo, useRef } from "react";
import { toast } from "sonner";
import { z } from "zod/v3";

const signUpSchema = z.object({
    firstname: z.string().min(2, { message: "Le prénom est requis" }),
    lastname: z.string().min(2, { message: "Le nom est requis" }),
    email: z.string().email({ message: "Adresse email invalide" }),
    password: z
        .string()
        .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères." })
        .regex(/[0-9]/, { message: "Le mot de passe doit contenir au moins un chiffre." })
        .regex(/[a-z]/, { message: "Le mot de passe doit contenir au moins une lettre minuscule." })
        .regex(/[A-Z]/, { message: "Le mot de passe doit contenir au moins une lettre majuscule." })
        .regex(/[!@#$%^&*(),.?\":{}|<>]/, {
            message: "Le mot de passe doit contenir au moins un caractère spécial.",
        }),
});

export default function SignUpForm({ callbackURL = "/dashboard" }: { callbackURL?: string }) {
    const formValues = { email: "", firstname: "", lastname: "", password: "" };
    const { inputValues, inputErrors, handleChange, setError, handleSubmit, isLoading } = useForm({
        schema: signUpSchema,
        initialValues: formValues,
    });
    const id = useId();
    const pendingFormData = useRef<typeof formValues | null>(null);

    const checkStrength = (pass: string) => {
        const requirements = [
            { regex: /.{8,}/, text: "Au moins 8 caractères" },
            { regex: /[0-9]/, text: "Au moins 1 chiffre" },
            { regex: /[a-z]/, text: "Au moins 1 lettre minuscule" },
            { regex: /[A-Z]/, text: "Au moins 1 lettre majuscule" },
            { regex: /[!@#$%^&*(),.?\":{}|<>]/, text: "Au moins 1 caractère spécial" },
        ];
        return requirements.map((req) => ({
            met: req.regex.test(pass),
            text: req.text,
        }));
    };

    const strength = checkStrength(inputValues.password || "");
    const strengthScore = useMemo(() => strength.filter((req) => req.met).length, [strength]);

    const getStrengthColor = (score: number) => {
        if (score === 0) return "bg-border";
        if (score <= 1) return "bg-red-500";
        if (score <= 2) return "bg-orange-500";
        if (score === 3) return "bg-amber-500";
        if (score === 4) return "bg-green-500";
        return "bg-emerald-500";
    };

    const getStrengthText = (score: number) => {
        switch (score) {
            case 0:
                return "Entrer un mot de passe pour commencer";
            case 1:
                return "😬 Mot de passe en carton... On peut faire mieux !";
            case 2:
                return "💪 Ça commence à ressembler à un vrai mot de passe !";
            case 3:
                return "🚀 Presque invincible, encore un effort !";
            case 4:
                return "🔒 Mot de passe très solide, encore un petit effort !";
            case 5:
                return "👏 Mot de passe de compétition, bravo !";
            default:
                return "";
        }
    };

    const submitSignUp = async (data: typeof formValues) => {
        await authClient.signUp.email(
            {
                name: data.firstname + " " + data.lastname,
                email: data.email,
                password: data.password,
            },
            {
                onError: (ctx) => {
                    const errorMessage = ctx.error.message;
                    errorMessage.toLowerCase().includes("password")
                        ? setError("password", errorMessage)
                        : setError("email", errorMessage);
                },
                onSuccess: async () => {
                    toast.success("Inscription terminée");
                },
            },
        );
    };

    return (
        <>
            <Form onSubmit={handleSubmit(submitSignUp)} className="space-y-3 w-full">
                <div className="grid gap-3 sm:grid-cols-2">
                    <TextField
                        name="firstname"
                        label="Prénom"
                        autoComplete="given-name"
                        errorMessage={inputErrors.firstname}
                        value={inputValues.firstname}
                        placeholder="Entrez votre prénom"
                        onChange={(v) => handleChange("firstname", v)}
                    />
                    <TextField
                        name="lastname"
                        label="Nom"
                        autoComplete="family-name"
                        errorMessage={inputErrors.lastname}
                        value={inputValues.lastname}
                        placeholder="Entrez votre nom"
                        onChange={(v) => handleChange("lastname", v)}
                    />
                </div>
                <TextField
                    type="email"
                    label="Adresse email"
                    value={inputValues.email}
                    autoComplete="email"
                    errorMessage={inputErrors.email}
                    placeholder="Entrez votre adresse email"
                    onChange={(v) => handleChange("email", v)}
                />
                <TextField
                    isRevealable
                    type="password"
                    label="Mot de passe"
                    autoComplete="new-password"
                    value={inputValues.password}
                    placeholder="Créez votre mot de passe"
                    errorMessage={inputErrors.password}
                    onChange={(v) => handleChange("password", v)}
                />

                <div
                    className="bg-border h-1 w-full overflow-hidden rounded-full"
                    role="progressbar"
                    aria-valuenow={strengthScore}
                    aria-valuemin={0}
                    aria-valuemax={5}
                    aria-label="Solidité du mot de passe"
                >
                    <div
                        className={`h-full rounded-full ${getStrengthColor(strengthScore)} transition-all duration-500 ease-out`}
                        style={{ width: `${(strengthScore / 5) * 100}%` }}
                    ></div>
                </div>
                <div className="mt-1 mb-4 border rounded-xl p-4 flex flex-col gap-3">
                    <p id={`${id}-description`} className="text-foreground text-sm font-medium">
                        {getStrengthText(strengthScore)}
                    </p>
                    <ul className="space-y-1.5" aria-label="Exigences du mot de passe">
                        {strength.map((req, index) => (
                            <li key={index} className="flex items-center gap-2">
                                {req.met ? (
                                    <Check
                                        size={16}
                                        className="text-emerald-500"
                                        aria-hidden="true"
                                    />
                                ) : (
                                    <X
                                        size={16}
                                        className="text-muted-foreground/80"
                                        aria-hidden="true"
                                    />
                                )}
                                <span
                                    className={`text-xs ${req.met ? "text-emerald-600" : "text-muted-foreground"}`}
                                >
                                    {req.text}
                                    <span className="sr-only">
                                        {req.met
                                            ? " - Exigence remplie"
                                            : " - Exigence non remplie"}
                                    </span>
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

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
                                    aria-label="Inscription en cours..."
                                />
                            )}
                            {isLoading ? "Inscription en cours..." : "S'inscrire"}
                        </>
                    )}
                </Button>
            </Form>
        </>
    );
}
