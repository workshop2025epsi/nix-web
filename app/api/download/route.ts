import { downloadRecord } from '@/app/actions/record.actions';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {

        const fileToken = request.headers.get("fileToken");

        if (!fileToken) {
            return NextResponse.json({ message: "Token de fichier manquant" }, { status: 400 });
        }

        const result = await downloadRecord(fileToken);

        if (!result.success || !result.data) {
            return NextResponse.json({ message: result.message || "Erreur inconnue" }, { status: 404 });
        }

        return new Response(result.data.buffer, {
            status: 200,
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Disposition': `attachment; filename="${result.data.name}"`,
            },
        });
    } catch (error) {
        console.error("Erreur lors du téléchargement du fichier", error);
        return NextResponse.json({ message: "Erreur lors du traitement de la requête" }, { status: 500 });
    }
}