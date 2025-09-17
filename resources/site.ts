
const devDomain = "http://localhost:3000";
const prodDomain = "https://labonneblanquette-arras.kaelian.dev";

export const siteConfig = {
    demo: {
        enabled: true,
    },
    name: "La Bonne Blanquette",
    version: "1.0.0",
    latestReleaseDate: new Date("2025-09-13"),
    description: "La Bonne Blanquette est un restaurant familial où l’on se retrouve comme à la maison autour de plats généreux et réconfortants.",
    extra: {
        missingPfpFallback: "/images/avatars/missing.png",
    },
    domains: {
        development: devDomain,
        production: prodDomain,
        current: process.env.NODE_ENV === "development" ? devDomain : prodDomain,
    },
    auth: {
        emailVerification: {
            enabled: false,
        },
    },
};
