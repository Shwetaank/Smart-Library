import { Library, Mail, Shield, Sparkles, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";

type LoginFormProps = Readonly<{
    authMode: "login" | "register";
    loginForm: { email: string; password: string; name: string };
    loading: boolean;
    onSetAuthMode: (mode: "login" | "register") => void;
    onUpdateForm: (field: {
        email: string;
        password: string;
        name: string;
    }) => void;
    onSignIn: () => void;
    onDemoLogin: (role: "admin" | "librarian" | "user") => void;
}>;

export function LoginForm({
    authMode,
    loginForm,
    loading,
    onSetAuthMode,
    onUpdateForm,
    onSignIn,
    onDemoLogin,
}: LoginFormProps) {
    return (
        // Authentication form
        <section className="auth-panel">
            {/* Brand */}
            <div className="brand-mark">
                <Library size={30} />
            </div>

            <span className="eyebrow">
                <Sparkles size={14} /> Digital circulation desk
            </span>

            <h1>SmartLibrary</h1>

            <p>
                Sign in to borrow books, manage reservations, and unlock role-based
                library tools.
            </p>

            {/* Authentication mode */}
            <div className="auth-tabs">
                <button
                    className={authMode === "login" ? "active" : ""}
                    onClick={() => onSetAuthMode("login")}
                    type="button"
                >
                    Sign in
                </button>

                <button
                    className={authMode === "register" ? "active" : ""}
                    onClick={() => onSetAuthMode("register")}
                    type="button"
                >
                    Create account
                </button>
            </div>

            {/* Registration field */}
            {authMode === "register" && (
                <label className="auth-field">
                    <UserRound size={16} />

                    <input
                        value={loginForm.name}
                        onChange={(e) =>
                            onUpdateForm({
                                ...loginForm,
                                name: e.target.value,
                            })
                        }
                        placeholder="Full name"
                    />
                </label>
            )}

            {/* Login fields */}
            <label className="auth-field">
                <Mail size={16} />

                <input
                    value={loginForm.email}
                    onChange={(e) =>
                        onUpdateForm({
                            ...loginForm,
                            email: e.target.value,
                        })
                    }
                    placeholder="Email"
                    type="email"
                />
            </label>

            <label className="auth-field">
                <Shield size={16} />

                <input
                    value={loginForm.password}
                    onChange={(e) =>
                        onUpdateForm({
                            ...loginForm,
                            password: e.target.value,
                        })
                    }
                    placeholder="Password"
                    type="password"
                />
            </label>

            {/* Demo accounts */}
            <div className="demo-logins">
                {(["admin", "librarian", "user"] as const).map((role) => (
                    <button
                        key={role}
                        onClick={() => onDemoLogin(role)}
                        type="button"
                    >
                        {role}
                    </button>
                ))}
            </div>

            {/* Submit */}
            <Button onClick={onSignIn} disabled={loading}>
                <Shield size={16} />
                {authMode === "login" ? "Sign in" : "Create account"}
            </Button>
        </section>
    );
}