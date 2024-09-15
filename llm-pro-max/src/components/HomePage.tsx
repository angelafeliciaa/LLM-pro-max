"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Code, Eye, ArrowRight } from "lucide-react";
import Background from "@/components/Background";

export function HomePage() {
  return (
    <>
      <Background />
      <div className="min-h-screen bg-transparent text-white font-sans relative overflow-y-scroll">
        <header className="container mx-auto px-4 py-6">
          <nav className="flex justify-between items-center">
            <h1 className="text-2xl font-bold main-title opacity-90">
              LLM Pro Max
            </h1>
            <div className="space-x-4">
              <Button>Sign In</Button>
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
              Meet <span className="main-title">LLM Pro Max</span>.
            </h3>
            <p className="text-xl mb-8 text-white-100 opacity-80">
              Unlock full project context by connecting your GitHub repo.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-white-400 to-blue-500 opacity-90 hover:opacity-100 hover:from-white-300 hover:to-blue-400 text-blue-900 font-bold"
            >
              {"Get Started Now!"}
            </Button>
          </section>

          <section className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-blue-800 bg-opacity-20 border-white-700 border-opacity-30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white-300 opacity-90">
                  <Github size={24} />
                  <span>GitHub Integration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white-100 opacity-80">
                <p>
                  Sign in with GitHub and select a repo to grant full project
                  access.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-blue-800 bg-opacity-20 border-white-700 border-opacity-30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white-300 opacity-90">
                  <Code size={24} />
                  <span>Full Project Context</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white-100 opacity-80">
                <p>
                  Ask questions about your entire codebase with full project
                  context.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-blue-800 bg-opacity-20 border-white-700 border-opacity-30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white-300 opacity-90">
                  <Eye size={24} />
                  <span>Seamless Exploration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white-100 opacity-80">
                <p>
                  Browse through your project files and get detailed responses
                  based on specific code sections.
                </p>
              </CardContent>
            </Card>
          </section>

          <section className="text-center">
            <h3 className="text-3xl font-bold mb-4 text-white-300 opacity-90">
              Take control of your development process!
            </h3>
            <p className="text-xl mb-8 text-white-100 opacity-80">
              Stop worrying about context limits—join the revolution with LLM
              Pro Max.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-white-400 to-blue-500 opacity-90 hover:opacity-100 hover:from-white-300 hover:to-blue-400 text-blue-900 font-bold"
            >
              Start Now <ArrowRight className="ml-2" size={16} />
            </Button>
          </section>
        </main>

        <footer className="container mx-auto px-4 py-8 mt-16 border-t border-white-800 border-opacity-30">
          <div className="flex justify-between items-center text-white-300 opacity-80">
            <p>&copy; 2024 LLM Pro Max. All rights reserved.</p>
            <div className="space-x-4">
              <Button
                variant="ghost"
                className="text-white-300 opacity-80 hover:text-white-100 hover:opacity-100"
              >
                Privacy Policy
              </Button>
              <Button
                variant="ghost"
                className="text-white-300 opacity-80 hover:text-white-100 hover:opacity-100"
              >
                Terms of Service
              </Button>
              <Button
                variant="ghost"
                className="text-white-300 opacity-80 hover:text-white-100 hover:opacity-100"
              >
                Contact
              </Button>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
