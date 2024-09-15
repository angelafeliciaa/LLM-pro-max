"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Code, Eye, ArrowRight } from "lucide-react";

export function HomePage() {
    const { user, error, isLoading } = useUser();

    const handleAuth = () => {
        if (user) {
            window.location.href = "/api/auth/logout";
        } else {
            window.location.href = "/api/auth/login";
        }
    };

    useEffect(() => {
        fetch("/api/auth/me")
            .then((res) => {
                if (res.status === 200) {
                    return res.json();
                }
                return null;
            })
            .then((data) => {
                if (data) {
                    window.location.href = "/chat";
                }
            });
    }, []);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error.message}</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-teal-900 to-purple-900 text-white font-sans relative overflow-hidden">
            {/* Background shapes and header remain the same */}

            <header className="container mx-auto px-4 py-6">
                <nav className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-teal-300 opacity-90">
                        LLM Pro Max
                    </h1>
                    <div className="space-x-4">
                        <Button
                            variant="ghost"
                            className="text-teal-300 opacity-80 hover:text-teal-100 hover:opacity-100">
                            About
                        </Button>
                        <Button
                            variant="ghost"
                            className="text-teal-300 opacity-80 hover:text-teal-100 hover:opacity-100">
                            How It Works
                        </Button>
                        <Button
                            variant="ghost"
                            className="text-teal-300 opacity-80 hover:text-teal-100 hover:opacity-100">
                            Feedback
                        </Button>
                        <Button
                            variant="outline"
                            className="bg-teal-700 bg-opacity-50 text-teal-100 hover:bg-teal-600 hover:bg-opacity-70 border-teal-500 border-opacity-50">
                            Support Us
                        </Button>
                        <Button
                            variant="default"
                            className="bg-teal-500 bg-opacity-80 hover:bg-teal-400 hover:bg-opacity-100 text-blue-900"
                            onClick={handleAuth}>
                            {user ? "Logout" : "Login"}
                        </Button>
                    </div>
                </nav>
            </header>

            <main className="container mx-auto px-4 py-16">
                <section className="text-center mb-16">
                    <h2 className="text-5xl font-bold mb-4 opacity-90">
                        Tired of{" "}
                        <span className="text-coral-400 opacity-80">
                            limited context?
                        </span>
                    </h2>
                    <h3 className="text-6xl font-bold mb-6 opacity-90">
                        Meet <span className="text-teal-300">LLM Pro Max</span>.
                    </h3>
                    <p className="text-xl mb-8 text-teal-100 opacity-80">
                        Unlock full project context by connecting your GitHub
                        repo.
                    </p>
                    <Button
                        size="lg"
                        className="bg-gradient-to-r from-teal-400 to-blue-500 opacity-90 hover:opacity-100 hover:from-teal-300 hover:to-blue-400 text-blue-900 font-bold"
                        onClick={handleAuth}>
                        {user ? "Go to Dashboard" : "Get Started Now!"}
                    </Button>
                </section>

                <section className="grid md:grid-cols-3 gap-8 mb-16">
                    <Card className="bg-blue-800 bg-opacity-20 border-teal-700 border-opacity-30">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2 text-teal-300 opacity-90">
                                <Github size={24} />
                                <span>GitHub Integration</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-teal-100 opacity-80">
                            <p>
                                Sign in with GitHub and select a repo to grant
                                full project access.
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="bg-blue-800 bg-opacity-20 border-teal-700 border-opacity-30">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2 text-teal-300 opacity-90">
                                <Code size={24} />
                                <span>Full Project Context</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-teal-100 opacity-80">
                            <p>
                                Ask questions about your entire codebase with
                                full project context.
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="bg-blue-800 bg-opacity-20 border-teal-700 border-opacity-30">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2 text-teal-300 opacity-90">
                                <Eye size={24} />
                                <span>Seamless Exploration</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-teal-100 opacity-80">
                            <p>
                                Browse through your project files and get
                                detailed responses based on specific code
                                sections.
                            </p>
                        </CardContent>
                    </Card>
                </section>

                <section className="text-center">
                    <h3 className="text-3xl font-bold mb-4 text-teal-300 opacity-90">
                        Take control of your development process!
                    </h3>
                    <p className="text-xl mb-8 text-teal-100 opacity-80">
                        Stop worrying about context limits—join the revolution
                        with LLM Pro Max.
                    </p>
                    <Button
                        size="lg"
                        className="bg-gradient-to-r from-teal-400 to-blue-500 opacity-90 hover:opacity-100 hover:from-teal-300 hover:to-blue-400 text-blue-900 font-bold">
                        Start Now <ArrowRight className="ml-2" size={16} />
                    </Button>
                </section>
            </main>

            <footer className="container mx-auto px-4 py-8 mt-16 border-t border-teal-800 border-opacity-30">
                <div className="flex justify-between items-center text-teal-300 opacity-80">
                    <p>&copy; 2023 LLM Pro Max. All rights reserved.</p>
                    <div className="space-x-4">
                        <Button
                            variant="ghost"
                            className="text-teal-300 opacity-80 hover:text-teal-100 hover:opacity-100">
                            Privacy Policy
                        </Button>
                        <Button
                            variant="ghost"
                            className="text-teal-300 opacity-80 hover:text-teal-100 hover:opacity-100">
                            Terms of Service
                        </Button>
                        <Button
                            variant="ghost"
                            className="text-teal-300 opacity-80 hover:text-teal-100 hover:opacity-100">
                            Contact
                        </Button>
                    </div>
                </div>
            </footer>
        </div>
    );
}
