import { useState } from "react";
import { Library, Mail, Shield, Sparkles, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spotlight } from "@/components/ui/aceternity/spotlight";
import { BackgroundBeams } from "@/components/ui/aceternity/background-beams";

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
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
            {/* Spotlight & Background Effects */}
            <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="oklch(0.72 0.12 176 / 0.15)" />
            <BackgroundBeams className="opacity-40" />

            {/* Decorative gradient orbs */}
            <div className="pointer-events-none absolute -left-40 -top-40 h-125 w-125 rounded-full bg-emerald-500/10 blur-[120px]" />
            <div className="pointer-events-none absolute -bottom-40 -right-40 h-125 w-125 rounded-full bg-cyan-500/10 blur-[120px]" />

            <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-8 lg:flex-row lg:items-center">
                {/* Hero Text */}
                <div className="flex-1 space-y-6 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-300">
                        <Sparkles size={14} />
                        <span>Digital circulation desk</span>
                    </div>

                    <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
                        Smart
                        <h1>
                            Welcome to{" "}
                            <span className="bg-linear-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent">
                                Library
                            </span>
                        </h1>
                    </h1>

                    <p className="max-w-md text-base text-slate-400 md:text-lg">
                        Sign in to borrow books, manage reservations, and unlock role-based library tools.
                    </p>

                    {/* Feature badges */}
                    <div className="hidden flex-wrap gap-2 lg:flex">
                        {["📚 Catalog Management", "🔄 Real-time Sync", "🔐 Role-based Access", "📊 Analytics"].map((feature) => (
                            <Badge key={feature} variant="secondary" className="bg-slate-800/50 text-slate-300">
                                {feature}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Auth Card */}
                <Card className="w-full max-w-md border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur-xl">
                    <CardHeader className="space-y-1 text-center">
                        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-emerald-500 to-cyan-500 shadow-lg">
                            <Library size={24} className="text-white" />
                        </div>
                        <CardTitle className="text-xl text-white">
                            {authMode === "login" ? "Welcome back" : "Create account"}
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            {authMode === "login"
                                ? "Enter your credentials to access the library"
                                : "Fill in the details to get started"}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {/* Auth Mode Toggle */}
                        <div className="grid grid-cols-2 gap-1 rounded-lg bg-slate-800/50 p-1">
                            <button
                                className={`rounded-md px-3 py-2 text-sm font-medium transition-all ${authMode === "login"
                                    ? "bg-emerald-500/20 text-emerald-300 shadow-sm"
                                    : "text-slate-400 hover:text-slate-300"
                                    }`}
                                onClick={() => onSetAuthMode("login")}
                                type="button"
                            >
                                Sign in
                            </button>
                            <button
                                className={`rounded-md px-3 py-2 text-sm font-medium transition-all ${authMode === "register"
                                    ? "bg-emerald-500/20 text-emerald-300 shadow-sm"
                                    : "text-slate-400 hover:text-slate-300"
                                    }`}
                                onClick={() => onSetAuthMode("register")}
                                type="button"
                            >
                                Register
                            </button>
                        </div>

                        {/* Registration Name Field */}
                        {authMode === "register" && (
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-slate-300">Full name</Label>
                                <div className="relative">
                                    <UserRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <Input
                                        id="name"
                                        value={loginForm.name}
                                        onChange={(e) =>
                                            onUpdateForm({ ...loginForm, name: e.target.value })
                                        }
                                        placeholder="John Doe"
                                        className="border-slate-700 bg-slate-800/50 pl-10 text-white placeholder:text-slate-500 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-300">Email</Label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={loginForm.email}
                                    onChange={(e) =>
                                        onUpdateForm({ ...loginForm, email: e.target.value })
                                    }
                                    placeholder="you@example.com"
                                    className="border-slate-700 bg-slate-800/50 pl-10 text-white placeholder:text-slate-500 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-slate-300">Password</Label>
                            <div className="relative">
                                <Shield size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={loginForm.password}
                                    onChange={(e) =>
                                        onUpdateForm({ ...loginForm, password: e.target.value })
                                    }
                                    placeholder="••••••••"
                                    className="border-slate-700 bg-slate-800/50 pl-10 text-white placeholder:text-slate-500 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                                >
                                    {showPassword ? "🙈" : "👁️"}
                                </button>
                            </div>
                        </div>

                        {/* Demo Accounts */}
                        <div className="space-y-2">
                            <p className="text-xs text-slate-500">Quick demo access</p>
                            <div className="flex flex-wrap gap-2">
                                {(["admin", "librarian", "user"] as const).map((role) => (
                                    <button
                                        key={role}
                                        onClick={() => onDemoLogin(role)}
                                        type="button"
                                        className="rounded-md border border-slate-700 bg-slate-800/30 px-3 py-1.5 text-xs font-medium capitalize text-slate-400 transition-all hover:border-emerald-500/30 hover:text-emerald-300"
                                    >
                                        {role}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Submit */}
                        <Button
                            onClick={onSignIn}
                            disabled={loading}
                            className="w-full bg-linear-to-r from-emerald-500 to-cyan-500 text-white shadow-lg hover:from-emerald-600 hover:to-cyan-600 disabled:opacity-50"
                            size="lg"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    {authMode === "login" ? "Signing in..." : "Creating account..."}
                                </span>
                            ) : (
                                <>
                                    <Shield size={16} />
                                    {authMode === "login" ? "Sign in" : "Create account"}
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

