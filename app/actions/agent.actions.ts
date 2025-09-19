"use server";
import { db } from "@/lib/db"; // Assurez-vous que l'importation de votre instance Prisma est correcte
import { authorizeThisAction } from "./auth.actions";

// Fonction pour créer un agent
export async function createAgent(name: string) {
    const authSession = await authorizeThisAction();
    if (!authSession) {
        return {
            success: false,
            message: "Authentication required",
        };
    }

    try {
        const generateToken = () => {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let token = '';
            for (let i = 0; i < 154; i++) {
                token += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return token;
        };

        const agent = await db.agent.create({
            data: {
                name: name,
                agentToken: generateToken(),
            },
        });

        return {
            success: true,
            data: agent,
        };
    } catch (error) {
        console.error("Error creating agent:", error);
        return {
            success: false,
            message: "Failed to create agent",
        };
    }
}

// Fonction pour récupérer tous les agents
export async function getAgents() {
    const authSession = await authorizeThisAction();
    if (!authSession) {
        return {
            success: false,
            message: "Authentication required",
        };
    }

    try {
        const agents = await db.agent.findMany();
        return {
            success: true,
            data: agents,
        };
    } catch (error) {
        console.error("Error retrieving agents:", error);
        return {
            success: false,
            message: "Failed to retrieve agents",
        };
    }
}

// Fonction pour mettre à jour un agent existant
export async function updateAgent(agentId: number, name: string) {
    const authSession = await authorizeThisAction();
    if (!authSession) {
        return {
            success: false,
            message: "Authentication required",
        };
    }

    try {
        const agent = await db.agent.update({
            where: { id: agentId },
            data: {
                name: name,
            },
        });

        return {
            success: true,
            data: agent,
        };
    } catch (error) {
        console.error("Error updating agent:", error);
        return {
            success: false,
            message: "Failed to update agent",
        };
    }
}

// Fonction pour supprimer un agent
export async function deleteAgent(agentId: number) {
    const authSession = await authorizeThisAction();
    if (!authSession) {
        return {
            success: false,
            message: "Authentication required",
        };
    }

    try {
        await db.agent.delete({
            where: { id: agentId },
        });
        return {
            success: true,
            message: "Agent deleted successfully",
        };
    } catch (error) {
        console.error("Error deleting agent:", error);
        return {
            success: false,
            message: "Failed to delete agent",
        };
    }
}
