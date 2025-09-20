"use client";

import { deleteRecord, getRecords } from "@/app/actions/record.actions";
import { generateTranscript, getTranscriptByFileToken } from "@/app/actions/transcript.action";
import { Button } from "@/components/ui/button";
import {
    ModalBody,
    ModalContent,
    ModalDescription,
    ModalFooter,
    ModalHeader,
    ModalTitle,
} from "@/components/ui/modal";
import { ProgressCircle } from "@/components/ui/progress-circle";
import {
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Loader2, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Clipboard } from "lucide-react"; // Import de l'icône Clipboard

interface Record {
    id: number;
    name: string;
    fileToken: string;
    fileSize: number;
    extension: string;
    createdAt: Date;
    updatedAt: Date;
}

interface Response<T> {
    success: boolean;
    data?: T;
    message?: string;
}

export default function RecordsCard() {
    const [records, setRecords] = useState<Record[]>([]);
    const [isFetching, setFetching] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [transcriptText, setTranscriptText] = useState<string | null>(null);
    const [generatingFileToken, setGeneratingFileToken] = useState<string | null>(null);
    const [existingTranscripts, setExistingTranscripts] = useState<Set<string>>(new Set());

    useEffect(() => {
        const loadRecords = async () => {
            setFetching(true);
            try {
                const response = await getRecords();
                if (response.success && response.data) {
                    setRecords(response.data);
                    // Check for existing transcripts
                    for (const record of response.data) {
                        const transcriptResponse = await getTranscriptByFileToken(record.fileToken);
                        if (transcriptResponse.success && transcriptResponse.data) {
                            setExistingTranscripts((prev) => new Set([...prev, record.fileToken]));
                        }
                    }
                } else {
                    toast.error(response.message || "Échec du chargement des enregistrements.");
                }
            } catch (error) {
                console.error("Erreur lors du chargement des enregistrements:", error);
                toast.error("Une erreur s'est produite lors du chargement des enregistrements.");
            } finally {
                setFetching(false);
            }
        };
        loadRecords();
    }, []);

    const handleDeleteRecord = async (fileToken: string) => {
        setFetching(true);
        const response: Response<null> = await deleteRecord(fileToken);
        if (response.success) {
            setRecords(records.filter((record) => record.fileToken !== fileToken));
            toast.success("Enregistrement supprimé avec succès");
        } else {
            toast.error(response.message || "Échec de la suppression de l'enregistrement.");
        }
        setFetching(false);
    };

    const handleGenerateTranscript = async (fileToken: string) => {
        setModalOpen(true);
        setGeneratingFileToken(fileToken);
        setTranscriptText(null);

        try {
            // Check if transcript exists
            const existingResponse: Response<{
                generatedText: string;
                id: number;
                generatedName: string;
            }> = await getTranscriptByFileToken(fileToken);

            if (existingResponse.success && existingResponse.data) {
                setTranscriptText(existingResponse.data.generatedText);
                toast.success("Transcription chargée avec succès");
                setGeneratingFileToken(null);
                return;
            }

            // Generate if not exists
            const response: Response<{ generatedText: string; id: number; generatedName: string }> =
                await generateTranscript(fileToken);
            if (response.success && response.data) {
                setTranscriptText(response.data.generatedText);
                setExistingTranscripts((prev) => new Set([...prev, fileToken]));
                toast.success("Transcription générée avec succès");
            } else {
                toast.error(response.message || "Échec de la génération de la transcription.");
                setModalOpen(false);
            }
        } catch (error) {
            console.error("Erreur lors de la génération de la transcription:", error);
            toast.error("Une erreur s'est produite lors de la génération de la transcription.");
            setModalOpen(false);
        } finally {
            setGeneratingFileToken(null);
        }
    };

    const handleDownloadRecord = async (fileToken: string) => {
        try {
            const response = await fetch(`/api/download`, {
                method: "GET",
                headers: {
                    fileToken: fileToken,
                },
            });

            if (!response.ok) {
                throw new Error("Erreur lors du téléchargement du fichier");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = fileToken;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            toast.success("Fichier téléchargé avec succès");
        } catch (error) {
            console.error("Erreur lors du téléchargement du fichier:", error);
            toast.error("Une erreur s'est produite lors du téléchargement du fichier.");
        }
    };

    const formatFileSize = (size: number) => {
        if (size < 1024) {
            return `${size} bytes`;
        } else if (size < 1024 * 1024) {
            return `${(size / 1024).toFixed(2)} KB`;
        } else if (size < 1024 * 1024 * 1024) {
            return `${(size / (1024 * 1024)).toFixed(2)} MB`;
        } else {
            return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
        }
    };

    const handleCopyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copié dans le presse-papiers !");
    };

    return (
        <>
            {isFetching ? (
                <div className="flex justify-center items-center">
                    <ProgressCircle isIndeterminate aria-label="Chargement des enregistrements" />
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableColumn isRowHeader>Nom</TableColumn>
                            <TableColumn>Token</TableColumn>
                            <TableColumn>Taille</TableColumn>
                            <TableColumn>Extension</TableColumn>
                            <TableColumn>Actions</TableColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {records.map((record) => (
                            <TableRow key={record.id}>
                                <TableCell>{record.name}</TableCell>
                                <TableCell>
                                    <div className="flex justify-start items-center gap-2">
                                        <span className="flex w-24 truncate">
                                            {record.fileToken}
                                        </span>
                                        <Button
                                            intent="outline"
                                            className="rounded-sm"
                                            data-slot="icon"
                                            size="sq-xs"
                                            onPress={() => handleCopyToClipboard(record.fileToken)}
                                        >
                                            <Clipboard className="size-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell>{formatFileSize(record.fileSize)}</TableCell>
                                <TableCell>{record.extension}</TableCell>
                                <TableCell className="flex justify-start items-center gap-2">
                                    <Button
                                        intent="outline"
                                        size="sm"
                                        className="flex space-x-3"
                                        onPress={() => handleGenerateTranscript(record.fileToken)}
                                    >
                                        {generatingFileToken === record.fileToken
                                            ? "Chargement..."
                                            : existingTranscripts.has(record.fileToken)
                                              ? "Voir la transcription"
                                              : "Lancer la transcription"}
                                    </Button>
                                    <Button
                                        intent="outline"
                                        size="sm"
                                        className="flex space-x-3"
                                        onPress={() => handleDownloadRecord(record.fileToken)}
                                    >
                                        Télécharger
                                    </Button>
                                    <Button
                                        intent="danger"
                                        size="sm"
                                        className="flex space-x-3"
                                        onPress={() => handleDeleteRecord(record.fileToken)}
                                    >
                                        <Trash data-slot="icon" className="size-4" />
                                        Supprimer
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            <ModalContent isOpen={isModalOpen} onOpenChange={setModalOpen}>
                <ModalHeader>
                    <ModalTitle>Résultat de la Transcription</ModalTitle>
                    <ModalDescription>
                        {generatingFileToken ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="animate-spin" />
                                {transcriptText
                                    ? "Chargement..."
                                    : "Génération en cours, veuillez patienter..."}
                            </div>
                        ) : (
                            "Transcription terminée."
                        )}
                    </ModalDescription>
                </ModalHeader>
                <ModalBody>
                    {transcriptText ? (
                        <div className="max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-lg">
                            <p className="whitespace-pre-wrap text-sm leading-relaxed">
                                {transcriptText}
                            </p>
                        </div>
                    ) : null}
                </ModalBody>
                <ModalFooter>
                    <Button onPress={() => setModalOpen(false)}>Fermer</Button>
                </ModalFooter>
            </ModalContent>
        </>
    );
}
