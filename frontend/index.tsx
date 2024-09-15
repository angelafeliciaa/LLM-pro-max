import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { HomePage } from "@/pages/home-page";

export default function App() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-teal-900 to-purple-900">
            <div>
                <HomePage />
                <div className="fixed bottom-4 right-4">
                    <Button className="bg-teal-500 hover:bg-teal-600 text-white">
                        Open Chat
                    </Button>
                </div>
            </div>
            {/* {currentPage === "home" ? (
                
            ) : (
                <div>
                    <ChatInterface />
                    <div className="fixed top-4 left-4">
                        <Button
                            onClick={() => navigateTo("home")}
                            className="bg-teal-500 hover:bg-teal-600 text-white">
                            Back to Home
                        </Button>
                    </div>
                </div>
            )} */}
        </div>
    );
}
