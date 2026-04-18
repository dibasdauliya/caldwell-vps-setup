import { UserManagement } from "@/components/user-management";
import { AuthWrapper } from "@/components/auth-wrapper";
// Validate environment variables on app initialization
import "@/lib/validate-env";

export default function Home() {
    return (
        <AuthWrapper>
            <main className="min-h-screen bg-background p-8">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8 text-foreground">
                        Allowed Users
                    </h1>
                    <UserManagement />
                </div>
            </main>
        </AuthWrapper>
    );
}
