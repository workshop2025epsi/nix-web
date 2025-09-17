import {
    customSessionClient
} from "better-auth/client/plugins";

import { createAuthClient } from "better-auth/react";
import { auth } from ".";

const authClient = createAuthClient({
    plugins: [
        customSessionClient<typeof auth>(),
    ],
});

export { authClient };
