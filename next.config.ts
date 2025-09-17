import createMDX from '@next/mdx';
import fs from 'fs';
import type { NextConfig } from 'next';

// @ts-check

const packageJson = JSON.parse(fs.readFileSync(new URL("./package.json", import.meta.url), "utf8"));

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
    if (!process.env.__NEXT_MOTD_PRINTED) {
        console.log(`

                                                  AA
                                          AA      AAA
                                          AAAA    AAAAA
                                          AAAAAA  AAAAAAA
                                          AAAAAAAAAAAAAAAAA
                                          AAAAAAAAAAAAAAAAAAA
                                        AAAAAAAAAA  AAAAAAAAAA
                                      AAAAAAAAAA      AAAAAAAAA
        AAAAA         AAAAA         AAAAAAAAAA   AAA    AAAAAAAA       AAAAAA       AAAAAA
        AAAAAA        AAAAA       AAAAAAAAAA   AAAAAAAA  AAAAAAAA        AAAAA     AAAAAA
        AAAAAAAA      AAAAA        AAAAAAAAAA   AAAAAA   AAAAAAAA         AAAAAA  AAAAA
        AAAAAAAAA     AAAAA          AAAAAAAAAA   AA      AAAAAAA          AAAAAAAAAAA
        AAAAAAAAAAA   AAAAA            AAAAAAAAA         AAAAAAAA            AAAAAAAA
        AAAAA  AAAAA  AAAAA              AAAAAAAAAAAA    AAAAAAAA             AAAAAA
        AAAAA   AAAAAAAAAAA                 AAAAAAAA    AAAAAAAA            AAAAAAAAA
        AAAAA     AAAAAAAAA                AAAAAAAA    AAAAAAAA            AAAAA AAAAA
        AAAAA      AAAAAAAA               AAAAAAAA    AAAAAAAA            AAAAA   AAAAAA
        AAAAA        AAAAAA              AAAAAAAA   AAAAAAAAA            AAAAA     AAAAAA
        AAAAA         AAAAA             AAAAAAAA   AAAAAAAAA           AAAAAA        AAAAA
                                       AAAAAAAA   AAAAAAAAA

                                    AAAAAAAAAAAAAAAAAAAAAAAAA
                                   AAAAAAAAAAAAAAAAAAAAAAAAAAA
                                  AAAAAAAAAAAAAAAAAAAAAAAAAAAAA
                                 AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA

                                           NIX v${packageJson.version}

                            Kaelian BAUDELET, Florient GUILBERT © 2025
        `);
        process.env.__NEXT_MOTD_PRINTED = 'true';
    }
}

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "**", port: "**", pathname: "**" },
            { protocol: "https", hostname: "www.backmarket.fr", port: "", pathname: "**" }
        ],

        dangerouslyAllowSVG: true,
    },
    devIndicators: { position: "bottom-left" },
    logging: {
        fetches: {
            fullUrl: true,
            hmrRefreshes: true,
        },
    },
    skipTrailingSlashRedirect: true,
    experimental: {
        serverActions: {
            allowedOrigins: ['*', 'my-proxy.com', '*.my-proxy.com'],
        },
        mdxRs: true,
        // ppr: 'incremental',
    },
    pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
    reactStrictMode: true,
    serverExternalPackages: [],
};

const withMDX = createMDX({
    options: {
        remarkPlugins: [
            'remark-gfm',
        ],
        rehypePlugins: [
            'rehype-slug'
        ],
    },
});

export default withMDX(nextConfig);