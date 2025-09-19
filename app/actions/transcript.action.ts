"use server";
import { db } from "@/lib/db"; // Assurez-vous que l'importation de votre instance Prisma est correcte
import { openai } from '@ai-sdk/openai';
import { NoOutputGeneratedError, experimental_transcribe as transcribe } from 'ai';
import { authorizeThisAction } from "./auth.actions";
import { getFileBufferByFileToken } from './record.actions';

// Fonction pour générer un transcript à partir d'un fichier audio
export async function generateTranscript(fileToken: string) {
    const authSession = await authorizeThisAction();
    if (!authSession) {
        return {
            success: false,
            message: "Authentication required",
        };
    }

    try {
        const fileResponse = await getFileBufferByFileToken(fileToken);
        if (!fileResponse.success || !fileResponse.data) {
            return {
                success: false,
                message: "Failed to retrieve file buffer",
            };
        }

        const audioBuffer = fileResponse.data;
        const transcript = await transcribe({
            model: openai.transcription('whisper-1'),
            audio: audioBuffer,
        });

        const newTranscript = await db.transcript.create({
            data: {
                generatedName: fileToken,
                generatedText: transcript.text,
                fileToken: fileToken,
            },
        });

        return {
            success: true,
            data: newTranscript,
        };
    } catch (error) {
        if (NoOutputGeneratedError.isInstance(error)) {
            console.error('NoOutputGeneratedError:', error.cause);
            return {
                success: false,
                message: "Failed to generate transcript",
            };
        }
        console.error("Error generating transcript:", error);
        return {
            success: false,
            message: "Failed to generate transcript",
        };
    }
}

// Fonction pour récupérer tous les transcripts
export async function getTranscripts() {
    const authSession = await authorizeThisAction();
    if (!authSession) {
        return {
            success: false,
            message: "Authentication required",
        };
    }

    try {
        const transcripts = await db.transcript.findMany();
        return {
            success: true,
            data: transcripts,
        };
    } catch (error) {
        console.error("Error retrieving transcripts:", error);
        return {
            success: false,
            message: "Failed to retrieve transcripts",
        };
    }
}

// Fonction pour mettre à jour un transcript existant
export async function updateTranscript(transcriptId: number, generatedName: string, generatedText: string) {
    const authSession = await authorizeThisAction();
    if (!authSession) {
        return {
            success: false,
            message: "Authentication required",
        };
    }

    try {
        const transcript = await db.transcript.update({
            where: { id: transcriptId },
            data: {
                generatedName: generatedName,
                generatedText: generatedText,
            },
        });

        return {
            success: true,
            data: transcript,
        };
    } catch (error) {
        console.error("Error updating transcript:", error);
        return {
            success: false,
            message: "Failed to update transcript",
        };
    }
}

// Fonction pour supprimer un transcript
export async function deleteTranscript(transcriptId: number) {
    const authSession = await authorizeThisAction();
    if (!authSession) {
        return {
            success: false,
            message: "Authentication required",
        };
    }

    try {
        await db.transcript.delete({
            where: { id: transcriptId },
        });
        return {
            success: true,
            message: "Transcript deleted successfully",
        };
    } catch (error) {
        console.error("Error deleting transcript:", error);
        return {
            success: false,
            message: "Failed to delete transcript",
        };
    }
}

// Fonction pour récupérer un transcript par fileToken
export async function getTranscriptByFileToken(fileToken: string) {
    const authSession = await authorizeThisAction();
    if (!authSession) {
        return {
            success: false,
            message: "Authentication required",
        };
    }

    try {
        const transcript = await db.transcript.findFirst({
            where: { fileToken },
        });
        if (!transcript) {
            return {
                success: false,
                message: "Transcript not found",
            };
        }
        return {
            success: true,
            data: transcript,
        };
    } catch (error) {
        console.error("Error retrieving transcript:", error);
        return {
            success: false,
            message: "Failed to retrieve transcript",
        };
    }
}