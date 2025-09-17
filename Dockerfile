# ---- Building Stage ----

FROM imbios/bun-node:23-debian AS builder

WORKDIR /app

# Copier d'abord les fichiers de package et le schéma Prisma
COPY package.json bun.lockb ./
COPY prisma.config.ts ./
COPY prisma ./prisma/

# Vider le cache et installer les dépendances avec une logique de réessai
RUN rm -rf /root/.bun/install/cache/* && \
    for i in 1 2 3; do \
        bun install && break || \
        if [ $i -lt 3 ]; then \
            echo "Tentative $i échouée, nouvelle tentative..." && \
            sleep 5 && \
            continue; \
        else \
            echo "Toutes les tentatives ont échoué" && exit 1; \
        fi; \
    done

# Copier le reste de l'application
COPY . .

# Générer le client Prisma
# RUN bunx prisma generate

# Construire l'application
RUN bun run build

# ---- Production Stage ----
FROM imbios/bun-node:23-debian AS runner

ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

# Copier uniquement les fichiers nécessaires depuis le builder
COPY --from=builder /app ./

# Exposer le port sur lequel l'application s'exécute
EXPOSE 3000

# Démarrer l'application
CMD ["bun", "run", "start"]

# Pour construire et exécuter l'ensemble de la pile (y compris la base de données) :
# docker-compose up --build
# docker builder prune
# docker system prune