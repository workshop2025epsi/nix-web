import { Container } from "@/components/shared/container";
import { Heading } from "@/components/ui/heading";
import { Suspense } from "react";
import APIKeysCard from "../components/api-keys";
export const metadata = {
    title: "Clefs Api",
};

export default async function Page() {
    return (
        <Container className="space-y-6">
            <div>
                <Heading>Clefs API</Heading>
            </div>

            <Suspense fallback={<h1>Loading API Keys</h1>}>
                <APIKeysCard />
            </Suspense>
        </Container>
    );
}
