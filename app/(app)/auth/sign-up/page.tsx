import { Heading } from "@/components/ui/heading";
import { Metadata } from "next";
import SignUpForm from "../components/sign-up-form";

export const metadata: Metadata = {
    title: "Inscription",
};

export default async function Page(props: { searchParams: Promise<{ callback: string }> }) {
    const { callback } = await props.searchParams;
    return (
        <div className="space-y-8 w-full max-w-md mx-auto">
            <div className="text-center">
                <Heading level={1} className="mb-1">
                    Créer votre compte (Temp)
                </Heading>
            </div>
            <div className="space-y-4">
                <SignUpForm callbackURL={callback} />
            </div>
        </div>
    );
}
