"use server";

import { db } from "@/lib/db";
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { getAuth } from "./auth.actions";

// Utilisez process.cwd() au lieu de __dirname
const uploadDirectory = path.join(process.cwd(), 'uploads');

// Assurez-vous que le dossier existe
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
}

interface FileInput {
    originalname: string;
    buffer: Buffer;
    size: number;
}

export async function uploadRecord(file: FileInput, agentToken: string) {
    try {
        const agent = await db.agent.findUnique({
            where: { agentToken },
        });

        if (!agent) {
            return {
                data: null,
                message: "Agent non trouvée",
                success: false,
            };
        }

        const fileToken = uuidv4();
        const filePath = path.join(uploadDirectory, fileToken);

        fs.writeFileSync(filePath, file.buffer);

        const newFile = await db.file.create({
            data: {
                name: file.originalname,
                fileToken: fileToken,
                fileSize: file.size,
                extension: path.extname(file.originalname),
                agentId: agent.id,
            },
        });

        return {
            data: newFile,
            message: "File uploaded and record created successfully",
            success: true,
        };
    } catch (error) {
        console.error("Error creating record", error);
        return {
            data: null,
            message: "Failed to create record",
            success: false,
        };
    }
}


export async function getRecords() {
    try {
        const auth = await getAuth();
        if (!auth) {
            return {
                data: null,
                message: "Authentication failed",
                success: false,
            };
        }

        const records = await db.file.findMany();

        return {
            data: records,
            message: "Records retrieved successfully",
            success: true,
        };
    } catch (error) {
        console.error("Error fetching records", error);
        return {
            data: null,
            message: "Failed to fetch records",
            success: false,
        };
    }
}

export async function getFileDetailsByFileToken(fileToken: string) {
    try {
        const fileRecord = await db.file.findUnique({
            where: { fileToken: fileToken },
        });

        if (!fileRecord) {
            return {
                data: null,
                message: "File not found",
                success: false,
            };
        }

        return {
            data: fileRecord,
            message: "File details retrieved successfully",
            success: true,
        };
    } catch (error) {
        console.error("Error fetching file details", error);
        return {
            data: null,
            message: "Failed to fetch file details",
            success: false,
        };
    }
}

export async function getFileBufferByFileToken(fileToken: string) {
    try {
        const filePath = path.join(uploadDirectory, fileToken);
        if (!fs.existsSync(filePath)) {
            return {
                data: null,
                message: "Physical file not found",
                success: false,
            };
        }

        const fileBuffer = fs.readFileSync(filePath);

        return {
            data: fileBuffer,
            message: "File buffer retrieved successfully",
            success: true,
        };
    } catch (error) {
        console.error("Error fetching file buffer", error);
        return {
            data: null,
            message: "Failed to fetch file buffer",
            success: false,
        };
    }
}

export async function getFileDetailsById(id: number) {
    try {
        const fileRecord = await db.file.findUnique({
            where: { id: id },
        });

        if (!fileRecord) {
            return {
                data: null,
                message: "File not found",
                success: false,
            };
        }

        return {
            data: fileRecord,
            message: "File details retrieved successfully",
            success: true,
        };
    } catch (error) {
        console.error("Error fetching file details", error);
        return {
            data: null,
            message: "Failed to fetch file details",
            success: false,
        };
    }
}

export async function deleteRecord(fileToken: string) {
    try {
        const fileRecord = await db.file.findUnique({
            where: { fileToken: fileToken },
        });

        if (!fileRecord) {
            return {
                data: null,
                message: "File not found",
                success: false,
            };
        }

        const filePath = path.join(uploadDirectory, fileToken);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await db.file.delete({
            where: { fileToken: fileToken },
        });

        return {
            data: null,
            message: "File deleted successfully",
            success: true,
        };
    } catch (error) {
        console.error("Error deleting file", error);
        return {
            data: null,
            message: "Failed to delete file",
            success: false,
        };
    }
}