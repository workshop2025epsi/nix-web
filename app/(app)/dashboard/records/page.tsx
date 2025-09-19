// Start of Selection
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Suspense } from "react";
import RecordsCard from "./components/records-card";

export const metadata = {
    title: "Enregistrements",
};

export const dynamic = "force-dynamic";

export default function Page() {
    return (
        <Container className="space-y-6">
            <div>
                <Heading>Enregistrements</Heading>
            </div>

            <Suspense fallback={<h1>Chargement des Agents</h1>}>
                <RecordsCard />
            </Suspense>
        </Container>
    );
}
