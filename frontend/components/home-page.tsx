"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, Zap, Sparkles, ArrowRight } from "lucide-react";

export function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-teal-900 to-purple-900 text-white font-sans relative overflow-hidden">
            {/* Background shapes with reduced opacity */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-purple-800 rounded-full opacity-5 transform -translate-x-1/4 -translate-y-1/4"></div>
                <div className="absolute bottom-0 right-0 w-3/4 h-3/4 bg-teal-800 rounded-full opacity-5 transform translate-x-1/4 translate-y-1/4"></div>
                <div className="absolute top-1/2 left-1/2 w-1/2 h-1/2 bg-blue-800 rounded-full opacity-5 transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>

            <header className="container mx-auto px-4 py-6">
                <nav className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-teal-300 opacity-90">
                        EnhancedGPT
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
                            Usage Disclaimer
                        </Button>
                        <Button
                            variant="ghost"
                            className="text-teal-300 opacity-80 hover:text-teal-100 hover:opacity-100">
                            Feedback Form
                        </Button>
                        <Button
                            variant="outline"
                            className="bg-teal-700 bg-opacity-50 text-teal-100 hover:bg-teal-600 hover:bg-opacity-70 border-teal-500 border-opacity-50">
                            Donate
                        </Button>
                        <Button
                            variant="default"
                            className="bg-teal-500 bg-opacity-80 hover:bg-teal-400 hover:bg-opacity-100 text-blue-900">
                            Get Started!
                        </Button>
                    </div>
                </nav>
            </header>

            <main className="container mx-auto px-4 py-16">
                <section className="text-center mb-16">
                    <h2 className="text-5xl font-bold mb-4 opacity-90">
                        Need a{" "}
                        <span className="text-coral-400 opacity-80">
                            reality check?
                        </span>
                    </h2>
                    <h3 className="text-6xl font-bold mb-6 opacity-90">
                        Consult{" "}
                        <span className="text-teal-300">EnhancedGPT</span>.
                    </h3>
                    <p className="text-xl mb-8 text-teal-100 opacity-80">
                        EnhancedGPT has all the (imaginary) friends you need.
                    </p>
                    <Button
                        size="lg"
                        className="bg-gradient-to-r from-teal-400 to-blue-500 opacity-90 hover:opacity-100 hover:from-teal-300 hover:to-blue-400 text-blue-900 font-bold">
                        Let's Go!
                    </Button>
                </section>

                <section className="grid md:grid-cols-3 gap-8 mb-16">
                    <Card className="bg-blue-800 bg-opacity-20 border-teal-700 border-opacity-30">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2 text-teal-300 opacity-90">
                                <BrainCircuit size={24} />
                                <span>Advanced AI</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-teal-100 opacity-80">
                            <p>
                                Powered by state-of-the-art language models for
                                more accurate and context-aware responses.
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="bg-blue-800 bg-opacity-20 border-teal-700 border-opacity-30">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2 text-teal-300 opacity-90">
                                <Zap size={24} />
                                <span>Lightning Fast</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-teal-100 opacity-80">
                            <p>
                                Get instant responses with our optimized
                                infrastructure and efficient processing.
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="bg-blue-800 bg-opacity-20 border-teal-700 border-opacity-30">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2 text-teal-300 opacity-90">
                                <Sparkles size={24} />
                                <span>Personalized Experience</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-teal-100 opacity-80">
                            <p>
                                Tailored interactions based on your preferences
                                and usage patterns.
                            </p>
                        </CardContent>
                    </Card>
                </section>

                <section className="text-center">
                    <h3 className="text-3xl font-bold mb-4 text-teal-300 opacity-90">
                        Ready to upgrade your AI experience?
                    </h3>
                    <p className="text-xl mb-8 text-teal-100 opacity-80">
                        Join thousands of satisfied users and revolutionize the
                        way you interact with AI.
                    </p>
                    <Button
                        size="lg"
                        className="bg-gradient-to-r from-teal-400 to-blue-500 opacity-90 hover:opacity-100 hover:from-teal-300 hover:to-blue-400 text-blue-900 font-bold">
                        Start Your Free Trial{" "}
                        <ArrowRight className="ml-2" size={16} />
                    </Button>
                </section>
            </main>

            <footer className="container mx-auto px-4 py-8 mt-16 border-t border-teal-800 border-opacity-30">
                <div className="flex justify-between items-center text-teal-300 opacity-80">
                    <p>&copy; 2023 EnhancedGPT. All rights reserved.</p>
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
