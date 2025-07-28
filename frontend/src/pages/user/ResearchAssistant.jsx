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
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground">Research Assistant</h2>

      <Card className="h-[600px] flex flex-col">
        {/* Header */}
        <CardHeader className="border-b pb-4">
          <CardTitle className="flex items-center space-x-2 text-xl">
            <i className="fas fa-robot text-accent"></i>
            <span>AI Research Assistant</span>
          </CardTitle>
          <CardDescription>
            Ask about equipment, booking resources, or research guidance.
          </CardDescription>
        </CardHeader>

        <Separator />

        {/* Chat Content */}
        <CardContent className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 mb-4 p-4 bg-secondary/30 rounded-lg">
            {chatHistory.length === 0 ? (
              <p className="text-center text-muted-foreground mt-10">
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
                    className={`max-w-[80%] p-3 rounded-lg shadow-md text-sm font-open-sans ${
                      chat.type === "user"
                        ? "bg-accent text-accent-foreground ml-4"
                        : "bg-card border border-border mr-4"
                    }`}
                  >
                    {chat.type === "bot" && <i className="fas fa-robot text-accent mr-2"></i>}
                    {chat.message}
                    {chat.type === "user" && <i className="fas fa-user ml-2 text-accent-foreground"></i>}
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
              className="flex-1 font-open-sans"
            />
            <Button type="submit" className="bg-accent hover:bg-accent/90">
              <i className="fas fa-paper-plane"></i>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
