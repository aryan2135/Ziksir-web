import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

const EquipmentRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(import.meta.env.VITE_API_URI + "/api/requests");
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast({
        title: "Error",
        description: "Failed to fetch equipment requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Update request status
  const updateRequestStatus = async (requestId, newStatus) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URI}/api/requests/${requestId}`, {
        status: newStatus
      });
      
      toast({
        title: "Success",
        description: `Request status updated to ${newStatus}`,
      });
      
      // Refresh the requests list
      fetchRequests();
    } catch (error) {
      console.error("Error updating request:", error);
      toast({
        title: "Error",
        description: "Failed to update request status",
        variant: "destructive",
      });
    }
  };

  // Delete request
  const deleteRequest = async (requestId) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;
    
    try {
      await axios.delete(`${import.meta.env.VITE_API_URI}/api/requests/${requestId}`);
      
      toast({
        title: "Success",
        description: "Request deleted successfully",
      });
      
      // Refresh the requests list
      fetchRequests();
    } catch (error) {
      console.error("Error deleting request:", error);
      toast({
        title: "Error",
        description: "Failed to delete request",
        variant: "destructive",
      });
    }
  };

  // Get status badge color
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "reviewed":
        return "default";
      case "fulfilled":
        return "default";
      case "rejected":
        return "destructive";
      default:
        return "secondary";
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading equipment requests...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Equipment Requests</h1>
          <p className="text-gray-600 mt-2">
            Manage user-submitted equipment requests and update their status
          </p>
        </div>
        <Button 
          onClick={fetchRequests}
          variant="outline"
        >
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {requests.length}
            </div>
            <div className="text-sm text-gray-600">Total Requests</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {requests.filter(r => r.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {requests.filter(r => r.status === 'fulfilled').length}
            </div>
            <div className="text-sm text-gray-600">Fulfilled</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {requests.filter(r => r.status === 'rejected').length}
            </div>
            <div className="text-sm text-gray-600">Rejected</div>
          </CardContent>
        </Card>
      </div>

      {/* Requests List */}
      <Card>
        <CardHeader>
          <CardTitle>All Equipment Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No equipment requests found
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div key={request._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {request.name}
                        </h3>
                        <Badge variant={getStatusBadgeVariant(request.status)}>
                          {request.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Type:</span> {request.type}
                        </div>
                        {request.model && (
                          <div>
                            <span className="font-medium">Model:</span> {request.model}
                          </div>
                        )}
                        {request.link && (
                          <div>
                            <span className="font-medium">Reference:</span> 
                            <a 
                              href={request.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline ml-1"
                            >
                              View Link
                            </a>
                          </div>
                        )}
                        <div>
                          <span className="font-medium">Submitted:</span> {formatDate(request.createdAt)}
                        </div>
                      </div>

                      {request.imageUrl && (
                        <div className="mt-3">
                          <span className="font-medium text-sm text-gray-600">Image:</span>
                          <img 
                            src={request.imageUrl} 
                            alt="Equipment" 
                            className="w-20 h-20 object-cover rounded-md mt-1 border"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      {/* Status Update */}
                      <Select
                        value={request.status}
                        onValueChange={(value) => updateRequestStatus(request._id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="reviewed">Reviewed</SelectItem>
                          <SelectItem value="fulfilled">Fulfilled</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>

                      {/* View Details Button */}
                      <Dialog open={isDialogOpen && selectedRequest?._id === request._id} onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) setSelectedRequest(null);
                      }}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedRequest(request)}
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Request Details</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="font-medium text-sm text-gray-600">Equipment Name</label>
                                <p className="text-gray-900">{request.name}</p>
                              </div>
                              <div>
                                <label className="font-medium text-sm text-gray-600">Type</label>
                                <p className="text-gray-900">{request.type}</p>
                              </div>
                              {request.model && (
                                <div>
                                  <label className="font-medium text-sm text-gray-600">Model</label>
                                  <p className="text-gray-900">{request.model}</p>
                                </div>
                              )}
                              {request.link && (
                                <div>
                                  <label className="font-medium text-sm text-gray-600">Reference Link</label>
                                  <a 
                                    href={request.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                  >
                                    {request.link}
                                  </a>
                                </div>
                              )}
                            </div>
                            
                            <Separator />
                            
                            <div>
                              <label className="font-medium text-sm text-gray-600">Status</label>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant={getStatusBadgeVariant(request.status)}>
                                  {request.status}
                                </Badge>
                                <Select
                                  value={request.status}
                                  onValueChange={(value) => updateRequestStatus(request._id, value)}
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="reviewed">Reviewed</SelectItem>
                                    <SelectItem value="fulfilled">Fulfilled</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div>
                              <label className="font-medium text-sm text-gray-600">Submitted On</label>
                              <p className="text-gray-900">{formatDate(request.createdAt)}</p>
                            </div>

                            {request.imageUrl && (
                              <div>
                                <label className="font-medium text-sm text-gray-600">Equipment Image</label>
                                <img 
                                  src={request.imageUrl} 
                                  alt="Equipment" 
                                  className="w-full max-w-md object-cover rounded-md mt-1 border"
                                />
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>

                      {/* Delete Button */}
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => deleteRequest(request._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EquipmentRequest;