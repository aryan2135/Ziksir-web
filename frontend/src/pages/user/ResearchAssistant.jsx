import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function ResearchAssistant() {
  const [chatHistory, setChatHistory] = useState([]);
  const [chatMessage, setChatMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const newUserMessage = { type: "user", message: chatMessage };
    setChatHistory((prev) => [...prev, newUserMessage]);

    // Simulate bot response after 1 second
    setTimeout(() => {
      const botReply = {
        type: "bot",
        message: `You asked about: "${chatMessage}". I will help you with equipment or research guidance.`,
      };
      setChatHistory((prev) => [...prev, botReply]);
    }, 1000);

    setChatMessage("");
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Research Assistant</h2>

      <Card className="h-[500px] sm:h-[600px] flex flex-col">
        {/* Header */}
        <CardHeader className="border-b pb-3 sm:pb-4">
          <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
            <i className="fas fa-robot text-accent text-base sm:text-lg"></i>
            <span>AI Research Assistant</span>
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Ask about equipment, booking resources, or research guidance.
          </CardDescription>
        </CardHeader>

        <Separator />

        {/* Chat Content */}
        <CardContent className="flex-1 flex flex-col p-3 sm:p-4">
          <ScrollArea className="flex-1 mb-3 sm:mb-4 p-3 sm:p-4 bg-secondary/30 rounded-lg">
            {chatHistory.length === 0 ? (
              <p className="text-center text-muted-foreground mt-8 sm:mt-10 text-xs sm:text-sm">
                👋 Start by asking something like: <br />
                <span className="italic">"Which microscope should I book?"</span>
              </p>
            ) : (
              chatHistory.map((chat, index) => (
                <div
                  key={index}
                  className={`flex mb-3 ${chat.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[80%] p-2 sm:p-3 rounded-lg shadow-md text-xs sm:text-sm font-open-sans ${
                      chat.type === "user"
                        ? "bg-accent text-accent-foreground ml-2 sm:ml-4"
                        : "bg-card border border-border mr-2 sm:mr-4"
                    }`}
                  >
                    {chat.type === "bot" && <i className="fas fa-robot text-accent mr-2 text-xs sm:text-sm"></i>}
                    {chat.message}
                    {chat.type === "user" && <i className="fas fa-user ml-2 text-accent-foreground text-xs sm:text-sm"></i>}
                  </div>
                </div>
              ))
            )}
          </ScrollArea>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Input
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Ask about equipment, bookings, or research help..."
              className="flex-1 font-open-sans text-xs sm:text-sm"
            />
            <Button type="submit" className="bg-accent hover:bg-accent/90 text-xs sm:text-sm px-3 sm:px-4">
              <i className="fas fa-paper-plane"></i>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
