import { verifyApiKey } from "@/app/actions/apikey.actions";
import { uploadRecord } from "@/app/actions/record.actions";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const authHeader = request.headers.get("Authorization");
        const tokenHeader = request.headers.get("Token");

        let token = "";

        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1] || "";
        } else if (tokenHeader) {
            token = tokenHeader;
        } else {
            return NextResponse.json({ message: "Token d'autorisation manquant ou invalide" }, { status: 401 });
        }

        const verificationResult = await verifyApiKey(token);

        if (!('valid' in verificationResult && verificationResult.valid && verificationResult.key)) {
            return NextResponse.json({ message: "Token d'autorisation manquant ou invalide" }, { status: 401 });
        }

        if (!request.headers.get("Content-Type")?.includes("multipart/form-data") &&
            !request.headers.get("Content-Type")?.includes("application/x-www-form-urlencoded")) {
            return NextResponse.json({ message: "Content-Type invalide. Assurez-vous que le Content-Type est 'multipart/form-data' ou 'application/x-www-form-urlencoded'." }, { status: 400 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const agentToken = formData.get('agentToken') as string | null;

        console.log('->', agentToken)


        if (!file || file.size === 0) {
            return NextResponse.json({ message: "Fichier manquant ou invalide" }, { status: 400 });
        }

        if (!agentToken) {
            return NextResponse.json({ message: "Agent token manquant" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileInput = {
            originalname: file.name,
            buffer,
            size: file.size,
        };

        const result = await uploadRecord(fileInput, agentToken);

        if (!result.success) {
            return NextResponse.json({ message: result.message }, { status: 400 });
        }

        return NextResponse.json({ message: "Fichier uploadé avec succès", success: true, data: result.data }, { status: 201 });

    } catch (error) {
        console.error("Erreur", error);
        return NextResponse.json({ message: "Erreur lors du traitement de la requête" }, { status: 500 });
    }
}