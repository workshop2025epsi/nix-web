import { Nix } from "@/components/logos";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <main className="h-dvh justify-center items-center flex relative flex-1 w-full">
            <div className="grid min-h-svh w-full">
                <div className="flex flex-col gap-4 p-6 md:p-10">
                    <div className="flex justify-center gap-2 md:justify-start">
                        <Link href="/" className="flex items-center gap-2 font-medium">
                            <Nix className="h-7" />
                        </Link>
                    </div>
                    <div className="flex flex-1 items-center justify-center">{children}</div>
                </div>
            </div>
        </main>
    );
}
