import Link from "next/link";

export default function NotFound() {
    return (
        <div>
            <h2>Page non trouvée</h2>
            <p>La page que vous recherchez n'existe pas ou a été déplacée.</p>
            <Link href="/">Retour à l'accueil</Link>
        </div>
    );
}

export const metadata = {
    title: "Page non trouvée",
    description: "La page que vous recherchez n'existe pas ou a été déplacée.",
};
