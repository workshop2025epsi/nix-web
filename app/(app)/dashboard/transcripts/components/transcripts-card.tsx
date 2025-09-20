"use client";

import { getTranscripts } from "@/app/actions/transcript.action";
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
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Clipboard } from "lucide-react"; // Import de l'icône Clipboard

interface Transcript {
    id: number;
    generatedName: string;
    generatedText: string;
    fileToken: string;
    createdAt: Date;
    updatedAt: Date;
}

interface Response<T> {
    success: boolean;
    data?: T;
    message?: string;
}

export default function TranscriptsCard() {
    const [transcripts, setTranscripts] = useState<Transcript[]>([]);
    const [isFetching, setFetching] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedTranscript, setSelectedTranscript] = useState<Transcript | null>(null);

    useEffect(() => {
        const loadTranscripts = async () => {
            setFetching(true);
            try {
                const response = await getTranscripts();
                if (response.success && response.data) {
                    const transcriptsData: Transcript[] = response.data.map((item) => ({
                        ...item,
                        updatedAt: new Date(), // Ajout de la propriété manquante
                    }));
                    setTranscripts(transcriptsData);
                } else {
                    toast.error(response.message || "Échec du chargement des transcriptions.");
                }
            } catch (error) {
                console.error("Erreur lors du chargement des transcriptions:", error);
                toast.error("Une erreur s'est produite lors du chargement des transcriptions.");
            } finally {
                setFetching(false);
            }
        };
        loadTranscripts();
    }, []);

    const handleViewTranscript = (transcript: Transcript) => {
        setSelectedTranscript(transcript);
        setModalOpen(true);
    };

    const handleCopyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copié dans le presse-papiers !");
    };

    return (
        <>
            {isFetching ? (
                <div className="flex justify-center items-center">
                    <ProgressCircle isIndeterminate aria-label="Chargement des transcriptions" />
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableColumn isRowHeader>Nom</TableColumn>
                            <TableColumn>Token</TableColumn>
                            <TableColumn>Actions</TableColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transcripts.map((transcript) => (
                            <TableRow key={transcript.id}>
                                <TableCell>{transcript.generatedName}</TableCell>
                                <TableCell className="flex justify-start items-center gap-2">
                                    <span className="w-24 truncate">{transcript.fileToken}</span>
                                    <Button
                                        intent="outline"
                                        className="rounded-sm"
                                        data-slot="icon"
                                        size="sq-xs"
                                        onPress={() => handleCopyToClipboard(transcript.fileToken)}
                                    >
                                        <Clipboard className="size-4" />
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <div className="flex justify-start items-center gap-2">
                                        <Button
                                            intent="outline"
                                            size="sm"
                                            className="flex space-x-3"
                                            isDisabled={!transcript.generatedText}
                                            onPress={() => handleViewTranscript(transcript)}
                                        >
                                            Voir la transcription
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            <ModalContent isOpen={isModalOpen} onOpenChange={setModalOpen}>
                <ModalHeader>
                    <ModalTitle>Transcription</ModalTitle>
                    <ModalDescription>
                        {selectedTranscript ? selectedTranscript.generatedName : ""}
                    </ModalDescription>
                </ModalHeader>
                <ModalBody>
                    {selectedTranscript ? (
                        <div className="max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-lg">
                            <p className="whitespace-pre-wrap text-sm leading-relaxed">
                                {selectedTranscript.generatedText}
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
