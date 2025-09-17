import { getAuth } from "@/app/actions/auth.actions";
import { Container } from "@/components/shared/container";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Note } from "@/components/ui/note";
import { Separator } from "@/components/ui/separator";

import { NonNullableAuth } from "@/types";
import { format } from "date-fns";
import DisplayNameForm from "./components/display-name";
import EmailAddressForm from "./components/email-address";

export const metadata = {
    title: "Account / Settings",
};
export const dynamic = "force-dynamic";
export default async function Page() {
    const session = (await getAuth()) as NonNullableAuth;
    return (
        <Container className="space-y-6">
            <div>
                <Heading>Account Settings</Heading>
                Manage your account settings and preferences.
            </div>
            <DisplayNameForm user={session?.user} />
            <EmailAddressForm user={session?.user} />
            <Card>
                <Card.Header>
                    <Card.Title>Account Information</Card.Title>
                    <Card.Description>Visualize information about your account</Card.Description>
                </Card.Header>
                <Card.Content>
                    <div className="space-y-4">
                        <div className="flex sm:flex-row flex-col  space-y-2 sm:space-y-0">
                            <dl>
                                <dt className="font-semibold text-lg">Account ID</dt>
                                <dd>Your unique account identifier</dd>
                            </dl>
                            <div className="sm:ml-auto">
                                <Note className="w-fit p-2 flex items-center">
                                    {session.user.id}
                                </Note>
                            </div>
                        </div>
                        <Separator className="sm:max-w-[90%] mx-auto" />
                        <div className="flex sm:flex-row flex-col space-y-2 sm:space-y-0">
                            <dl>
                                <dt className="font-semibold text-lg">Member Since</dt>
                                <dd>Account creation date</dd>
                            </dl>
                            <div className="sm:ml-auto">
                                <Note className="w-fit p-2 flex items-center">
                                    {format(session.user.createdAt, "MMMM dd, yyyy")}
                                </Note>
                            </div>
                        </div>
                    </div>
                </Card.Content>
            </Card>
        </Container>
    );
}
