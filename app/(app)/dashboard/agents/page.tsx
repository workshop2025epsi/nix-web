// Start of Selection
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Suspense } from "react";
import AgentsCard from "./components/agents-card";

export const metadata = {
    title: "Agents",
};

export const dynamic = "force-dynamic";

export default function Page() {
    return (
        <Container className="space-y-6">
            <div>
                <Heading>Agents</Heading>
            </div>

            <Suspense fallback={<h1>Chargement des Agents</h1>}>
                <AgentsCard />
            </Suspense>
        </Container>
    );
}
