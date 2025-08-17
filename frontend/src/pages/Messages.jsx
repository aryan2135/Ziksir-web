import React, { useEffect, useState } from "react";
import axios from "@/api/axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URI + "/api/messages");
      setMessages(res.data.data); // backend response
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      await axios.delete(import.meta.env.VITE_API_URI + `/api/messages/${id}`);
      setMessages(messages.filter((msg) => msg._id !== id));
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle>User Messages</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading messages...</p>
        ) : messages.length === 0 ? (
          <p>No messages found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Email</th>
                  <th className="px-4 py-2 border">Institution</th>
                  <th className="px-4 py-2 border">Message</th>
                  <th className="px-4 py-2 border">Date</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((msg) => (
                  <tr key={msg._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{msg.name}</td>
                    <td className="px-4 py-2 border">{msg.email}</td>
                    <td className="px-4 py-2 border">{msg.institution}</td>
                    <td className="px-4 py-2 border">{msg.message}</td>
                    <td className="px-4 py-2 border">
                      {new Date(msg.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteMessage(msg._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default messages;
