import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const ProtectedRoute = ({ children }: any) => {
    const { user } = useAuth()

    if (!user) {
        // user is not authenticated
        return <Link href="/login" />;
    }
    return <>{children}</>
};

export default ProtectedRoute