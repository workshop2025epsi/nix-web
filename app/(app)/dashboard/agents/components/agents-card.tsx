"use client";

import { createAgent, deleteAgent, getAgents, updateAgent } from "@/app/actions/agent.actions";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
    Modal,
    ModalBody,
    ModalContent,
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
import { TextField } from "@/components/ui/text-field";
import { Clipboard } from "lucide-react"; // Import de l'icône Clipboard
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Agent {
    id: number;
    name: string;
    agentToken: string;
    createdAt: Date;
    updatedAt: Date;
}

interface Response<T> {
    success: boolean;
    data?: T;
    message?: string;
}

export default function AgentsCard() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [open, setOpen] = useState(false);
    const [editingAgentId, setEditingAgentId] = useState<number | null>(null);
    const [inputValues, setInputValues] = useState({ name: "" });
    const [inputErrors, setInputErrors] = useState({ name: "" });
    const [isLoading, setLoading] = useState(false);
    const [isFetching, setFetching] = useState(false);

    useEffect(() => {
        const loadAgents = async () => {
            setFetching(true);
            try {
                const response: Response<Agent[]> = await getAgents();
                if (response.success && response.data) {
                    setAgents(response.data);
                } else {
                    toast.error(response.message || "Échec du chargement des agents.");
                }
            } catch (error) {
                console.error("Erreur lors du chargement des agents:", error);
                toast.error("Une erreur s'est produite lors du chargement des agents.");
            } finally {
                setFetching(false);
            }
        };
        loadAgents();
    }, []);

    const handleChange = (field: string, value: string) => {
        setInputValues((prev) => ({ ...prev, [field]: value }));
        setInputErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const handleFormSubmit = async () => {
        if (!inputValues.name.trim()) {
            setInputErrors({ name: "Le nom est requis." });
            return;
        }

        setLoading(true);
        try {
            let response: Response<Agent>;

            if (editingAgentId !== null) {
                response = await updateAgent(editingAgentId, inputValues.name);
                if (response.success && response.data) {
                    setAgents(
                        agents.map((agent) =>
                            agent.id === editingAgentId ? response.data! : agent,
                        ),
                    );
                    toast.success("Agent mis à jour avec succès");
                } else {
                    toast.error(response.message || "Échec de la mise à jour de l'agent.");
                }
            } else {
                response = await createAgent(inputValues.name);
                if (response.success && response.data) {
                    setAgents([...agents, response.data]);
                    toast.success("Agent créé avec succès");
                } else {
                    toast.error(response.message || "Échec de la création de l'agent.");
                }
            }
        } catch (error) {
            console.error("Erreur:", error);
            toast.error("Une erreur s'est produite.");
        } finally {
            setLoading(false);
            setOpen(false);
            setEditingAgentId(null);
            setInputValues({ name: "" });
            setInputErrors({ name: "" });
        }
    };

    const handleDeleteAgent = async (agentId: number) => {
        setFetching(true);
        const response: Response<null> = await deleteAgent(agentId);
        if (response.success) {
            setAgents(agents.filter((agent) => agent.id !== agentId));
            toast.success("Agent supprimé avec succès");
        } else {
            toast.error(response.message || "Échec de la suppression de l'agent.");
        }
        setFetching(false);
    };

    const handleEditAgent = (agent: Agent) => {
        setEditingAgentId(agent.id);
        setInputValues({ name: agent.name });
        setOpen(true);
    };

    const handleCopyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copié dans le presse-papiers !");
    };

    return (
        <>
            <Button
                onPress={() => {
                    setEditingAgentId(null);
                    setInputValues({ name: "" });
                    setOpen(true);
                }}
            >
                Créer un Agent
            </Button>

            {isFetching ? (
                <div className="flex justify-center items-center">
                    <ProgressCircle isIndeterminate aria-label="Chargement des agents" />
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
                        {agents.map((agent) => (
                            <TableRow key={agent.id}>
                                <TableCell>{agent.name}</TableCell>
                                <TableCell className="flex justify-start items-center gap-2">
                                    <span className="w-24 truncate">{agent.agentToken}</span>
                                    <Button
                                        intent="outline"
                                        className="rounded-sm"
                                        data-slot="icon"
                                        size="sq-xs"
                                        onPress={() => handleCopyToClipboard(agent.agentToken)}
                                    >
                                        <Clipboard className="size-4" />
                                    </Button>
                                </TableCell>
                                <TableCell className="space-x-2">
                                    <Button size="sm" onPress={() => handleEditAgent(agent)}>
                                        Modifier
                                    </Button>
                                    <Button
                                        intent="danger"
                                        size="sm"
                                        onPress={() => handleDeleteAgent(agent.id)}
                                    >
                                        Supprimer
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            <Modal>
                <ModalContent isOpen={open} onOpenChange={setOpen}>
                    <ModalHeader>
                        <ModalTitle>
                            {editingAgentId !== null ? "Modifier l'Agent" : "Créer un Agent"}
                        </ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                        <Form className="flex flex-col gap-4">
                            <TextField
                                label="Nom"
                                aria-label="Nom"
                                placeholder="Entrez le nom"
                                value={inputValues.name}
                                onChange={(value) => handleChange("name", value)}
                                isInvalid={!!inputErrors.name}
                                errorMessage={inputErrors.name}
                                isRequired
                            />
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button onPress={handleFormSubmit} isPending={isLoading}>
                            {({ isPending }) => (
                                <>
                                    {isPending ? (
                                        <>
                                            <ProgressCircle
                                                isIndeterminate
                                                aria-label="Enregistrement en cours"
                                            />
                                            Enregistrement en cours
                                        </>
                                    ) : editingAgentId !== null ? (
                                        "Modifier"
                                    ) : (
                                        "Créer"
                                    )}
                                </>
                            )}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
