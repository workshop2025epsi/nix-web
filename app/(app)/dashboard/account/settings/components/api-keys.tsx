"use client";

import { createApiKey, deleteApiKey, getApiKeys } from "@/app/actions/apikey.actions";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalDescription,
    ModalFooter,
    ModalHeader,
    ModalTitle,
} from "@/components/ui/modal";
import { ProgressCircle } from "@/components/ui/progress-circle";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { TextField } from "@/components/ui/text-field";
import ms from "ms";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod/v3";

interface ApiKey {
    id: string;
    name: string | null;
    prefix: string | null;
    userId: string;
    metadata: Record<string, any> | null;
    permissions: Record<string, string[]>;
    refillInterval: number | null;
    refillAmount: number | null;
    rateLimitTimeWindow: number | null;
    rateLimitMax: number | null;
    rateLimitEnabled: boolean;
    createdAt: Date;
    updatedAt: Date;
    expireAt: Date | null;
}

const apiKeySchema = z.object({
    name: z.string().min(1, "Le nom est requis."),
    prefix: z.string().min(1, "Le préfixe est requis."),
    expiresIn: z.number().min(1, "L'expiration doit être supérieure à zéro.").nullable(),
});

const expirationOptions = [
    { label: "1 Day", value: ms("1 day") / 1000 },
    { label: "7 Days", value: ms("7 days") / 1000 },
    { label: "30 Days", value: ms("30 days") / 1000 },
    { label: "60 Days", value: ms("60 days") / 1000 },
    { label: "90 Days", value: ms("90 days") / 1000 },
    { label: "180 Days", value: ms("180 days") / 1000 },
    { label: "1 Year", value: ms("365 days") / 1000 },
    { label: "No Expiration", value: null },
];

export default function APIKeysCard() {
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
    const [open, setOpen] = useState(false);
    const [showApiKeyModal, setShowApiKeyModal] = useState(false);
    const [generatedApiKey, setGeneratedApiKey] = useState("");
    const [inputValues, setInputValues] = useState({
        name: "",
        prefix: "",
        expiresIn: 3600,
    });
    const [inputErrors, setInputErrors] = useState({
        name: "",
        prefix: "",
        expiresIn: "",
    });
    const [isLoading, setLoading] = useState(false);
    const [isFetching, setFetching] = useState(false);

    useEffect(() => {
        const loadApiKeys = async () => {
            setFetching(true);
            try {
                const response = await getApiKeys();
                if (response.success && response.data) {
                    setApiKeys(response.data);
                } else {
                    toast.error("Échec du chargement des clés API.");
                }
            } catch (error) {
                console.error("Erreur lors du chargement des clés API:", error);
                toast.error("Une erreur s'est produite lors du chargement des clés API.");
            } finally {
                setFetching(false);
            }
        };
        loadApiKeys();
    }, []);

    const handleChange = (field: string, value: string | number | null) => {
        setInputValues((prev) => ({ ...prev, [field]: value }));
        setInputErrors((prev) => ({ ...prev, [field]: "" }));

        if (field === "name") {
            setInputValues((prev) => ({
                ...prev,
                name: value as string,
                prefix: (value as string).toLowerCase(),
            }));
        }
    };

    const handleFormSubmit = async () => {
        const result = apiKeySchema.safeParse(inputValues);
        if (!result.success) {
            const errors = result.error.format();
            setInputErrors({
                name: errors.name?._errors[0] || "",
                prefix: errors.prefix?._errors[0] || "",
                expiresIn: errors.expiresIn?._errors[0] || "",
            });
            return;
        }

        setLoading(true);
        try {
            const response = await createApiKey(
                inputValues.name,
                inputValues.expiresIn,
                inputValues.prefix,
            );

            if (response.success && response.data) {
                setApiKeys([...apiKeys, response.data]);
                setGeneratedApiKey(response.data.key || "");
                setShowApiKeyModal(true);
                setOpen(false);
                setInputValues({ name: "", prefix: "", expiresIn: 3600 });
            } else {
                toast.error("Échec de la création de la clé API.");
            }
        } catch (error) {
            console.error("Erreur lors de la création de la clé API:", error);
            toast.error("Une erreur s'est produite lors de la création de la clé API.");
        } finally {
            setLoading(false);
        }
    };

    const handleCopyApiKey = () => {
        navigator.clipboard.writeText(generatedApiKey);
        toast.success("Clé API copiée !");
    };

    const handleDeleteApiKey = async (apiKeyId: string) => {
        setFetching(true);
        const response = await deleteApiKey(apiKeyId);
        if (response.success) {
            setApiKeys(apiKeys.filter((key) => key.id !== apiKeyId));
            toast.success("Clé API supprimée avec succès !");
        } else {
            toast.error("Échec de la suppression de la clé API.");
        }
        setFetching(false);
    };

    return (
        <div>
            <Modal>
                <Button onPress={() => setOpen(true)}>Add API Key</Button>
                <ModalContent isOpen={open} onOpenChange={setOpen}>
                    <ModalHeader>
                        <ModalTitle>Create API Key</ModalTitle>
                        <ModalDescription>Enter details to create a new API key.</ModalDescription>
                    </ModalHeader>
                    <ModalBody>
                        <Form className="flex flex-col gap-4">
                            <TextField
                                label="Name"
                                aria-label="Name"
                                placeholder="Enter name"
                                value={inputValues.name}
                                onChange={(value) => handleChange("name", value)}
                                isInvalid={!!inputErrors.name}
                                errorMessage={inputErrors.name}
                            />
                            <TextField
                                label="Prefix"
                                aria-label="Prefix"
                                placeholder="Enter prefix"
                                value={inputValues.prefix}
                                onChange={(value) => handleChange("prefix", value)}
                                isInvalid={!!inputErrors.prefix}
                                errorMessage={inputErrors.prefix}
                            />
                            <Select
                                label="Expiration"
                                aria-label="Expiration"
                                placeholder="Select Expiration"
                                onSelectionChange={(value) => {
                                    const selectedOption = expirationOptions.find(
                                        (option) => option.value?.toString() === value,
                                    );
                                    handleChange("expiresIn", selectedOption?.value ?? null);
                                }}
                                selectedKey={inputValues.expiresIn?.toString() || ""}
                            >
                                <SelectTrigger />
                                <SelectContent items={expirationOptions}>
                                    {(item) => (
                                        <SelectItem
                                            id={item.value?.toString() || ""}
                                            textValue={item.label}
                                        >
                                            {item.label}
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                            {inputErrors.expiresIn && (
                                <div className="text-red-500 text-sm">{inputErrors.expiresIn}</div>
                            )}
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={handleFormSubmit} isPending={isLoading}>
                            {({ isPending }) => (
                                <>
                                    {isPending ? (
                                        <>
                                            <ProgressCircle
                                                isIndeterminate
                                                aria-label="Création en cours"
                                            />
                                            Création en cours
                                        </>
                                    ) : (
                                        "Créer"
                                    )}
                                </>
                            )}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Modal d'affichage de la clé API générée */}
            <Modal>
                <ModalContent isOpen={showApiKeyModal} onOpenChange={setShowApiKeyModal}>
                    <ModalHeader>
                        <ModalTitle>Clé API générée avec succès</ModalTitle>
                        <ModalDescription>
                            Veuillez copier cette clé API, elle ne sera pas réaffichée. Veuillez la
                            stocker en lieu sûr.
                        </ModalDescription>
                    </ModalHeader>
                    <ModalBody className="flex items-center gap-4">
                        <TextField
                            label="Votre clé API"
                            value={generatedApiKey}
                            className="flex-1 w-full"
                            suffix={
                                <Button
                                    aria-label="Copier la clé API"
                                    onPress={handleCopyApiKey}
                                    intent="secondary"
                                >
                                    Copier
                                </Button>
                            }
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button onPress={() => setShowApiKeyModal(false)}>J'ai copié la clé</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {isFetching ? (
                <div className="flex justify-center items-center">
                    <ProgressCircle isIndeterminate aria-label="Chargement des clés API" />
                    Chargement des clés API...
                </div>
            ) : (
                <Table aria-label="API Keys">
                    <TableHeader>
                        <TableColumn isRowHeader>Name</TableColumn>
                        <TableColumn>Clef secrète</TableColumn>
                        <TableColumn>Status</TableColumn>
                        <TableColumn>Actions</TableColumn>
                    </TableHeader>
                    <TableBody items={apiKeys}>
                        {(key) => {
                            const isExpired = key.expireAt && key.expireAt < new Date();
                            const displayPrefix =
                                key.prefix && key.prefix.length > 10
                                    ? `${key.prefix.substring(0, 10)}…`
                                    : `${key.prefix}…`;
                            return (
                                <TableRow key={key.id}>
                                    <TableCell>{key.name || "N/A"}</TableCell>
                                    <TableCell>
                                        <code>{displayPrefix}*****</code>
                                    </TableCell>
                                    <TableCell>{isExpired ? "Expiré" : "Actif"}</TableCell>
                                    <TableCell>
                                        <Button
                                            intent="danger"
                                            size="sm"
                                            onPress={() => handleDeleteApiKey(key.id)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        }}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}
