import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "@/api/axios";

const getDisplayName = (r) =>
  r.user?.fullName ||
  r.user?.name ||
  r.fullName ||
  r.name ||
  r.userProfile?.name ||
  r.organization ||
  "-";

const getDisplayEmail = (r) =>
  r.user?.email ||
  r.email ||
  r.userEmail ||
  r.userProfile?.email ||
  "-";

const ConsultPrototypeRequests = () => {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const [consultingRes, prototypingRes] = await Promise.all([
        axios.get(import.meta.env.VITE_API_URI + "/api/consulting/allConsulting"),
        axios.get(import.meta.env.VITE_API_URI + "/api/prototyping/allPrototyping"),
      ]);
      const consulting = (consultingRes.data || []).map((r) => ({
        ...r,
        type: "Consulting",
        displayName: getDisplayName(r),
        displayEmail: getDisplayEmail(r),
        displayOrg: r.organization || "-",
        displayDetails: r.details || r.description || "-",
        displayExtra: r.timeline || r.budget || "",
      }));
      const prototyping = (prototypingRes.data || []).map((r) => ({
        ...r,
        type: "Prototyping",
        displayName: getDisplayName(r),
        displayEmail: getDisplayEmail(r),
        displayOrg: r.organization || "-",
        displayDetails: r.details || r.description || "-",
        displayExtra: r.timeline || r.budget || "",
      }));
      setRequests([...consulting, ...prototyping]);
    } catch (err) {
      setRequests([]);
    }
    setLoading(false);
  };

  // Approve or reject a request
  const handleStatusChange = async (req, status) => {
    setActionLoading(req._id + status);
    try {
      if (req.type === "Consulting") {
        await axios.patch(
          import.meta.env.VITE_API_URI + `/api/consulting/updateConsulting/${req._id}`,
          { status }
        );
      } else {
        await axios.patch(
          import.meta.env.VITE_API_URI + `/api/prototyping/updatePrototyping/${req._id}`,
          { status }
        );
      }
      fetchRequests();
    } catch (err) {
    }
    setActionLoading(null);
  };

  // Filter requests by search
  const filtered = requests.filter(
    (r) =>
      r.displayName?.toLowerCase().includes(search.toLowerCase()) ||
      r.displayEmail?.toLowerCase().includes(search.toLowerCase()) ||
      r.displayOrg?.toLowerCase().includes(search.toLowerCase()) ||
      r.type?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto py-8 px-2 sm:px-4">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-primary">
        Consulting & Prototyping Requests
      </h2>

      {/* --- Requests Table/Card --- */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3 sm:gap-6 items-center">
        <Input
          placeholder="Search by name, email, org, or type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80"
        />
        <Button onClick={fetchRequests} variant="outline">
          Refresh
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Requests ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-gray-400 py-8">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              No consulting or prototyping requests found.
            </div>
          ) : (
            <div className="space-y-6">
              {filtered.map((req) => (
                <div
                  key={req._id}
                  className="bg-white rounded-lg shadow p-4 border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 items-center mb-2">
                      <span className="font-semibold text-lg text-primary">{req.displayName}</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                        {req.type}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ml-2 ${
                        req.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : req.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {req.status ? req.status.charAt(0).toUpperCase() + req.status.slice(1) : "Pending"}
                      </span>
                    </div>
                    <div className="text-sm text-gray-700 mb-1">
                      <strong>Email:</strong> {req.displayEmail}
                    </div>
                    <div className="text-sm text-gray-700 mb-1">
                      <strong>Organization:</strong> {req.displayOrg}
                    </div>
                    <div className="text-sm text-gray-700 mb-1">
                      <strong>Details:</strong> {req.displayDetails}
                    </div>
                    {req.displayExtra && (
                      <div className="text-sm text-gray-700 mb-1">
                        <strong>Extra:</strong> {req.displayExtra}
                      </div>
                    )}
                    <div className="text-xs text-gray-400 mt-1">
                      Requested on:{" "}
                      {req.createdAt
                        ? new Date(req.createdAt).toLocaleString()
                        : "-"}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 min-w-[120px]">
                    <Button
                      variant="success"
                      size="sm"
                      disabled={req.status === "approved" || actionLoading}
                      onClick={() => handleStatusChange(req, "approved")}
                      className="w-full"
                    >
                      {actionLoading === req._id + "approved" ? "Approving..." : "Approve"}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={req.status === "rejected" || actionLoading}
                      onClick={() => handleStatusChange(req, "rejected")}
                      className="w-full"
                    >
                      {actionLoading === req._id + "rejected" ? "Rejecting..." : "Reject"}
                    </Button>
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

export default ConsultPrototypeRequests;