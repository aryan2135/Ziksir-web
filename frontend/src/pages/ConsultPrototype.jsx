import React, { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "@/api/axios";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  ChevronUp,
  Mail,
  Building2,
  RefreshCw,
  Check,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/** STRICT: display name will NOT fallback to organization */

const getDisplayName = (r) =>
  r?.userName ||
  r?.user?.username ||
  r?.username ||
  r?.userProfile?.name ||
  r?.user?.fullName ||
  r?.user?.name ||
  r?.fullName ||
  r?.name ||
  "-";

const getDisplayEmail = (r) =>
  r?.user?.email || r?.email || r?.userEmail || r?.userProfile?.email || "-";

const getUserNameOnly = (r) =>
  r?.userName || r?.user?.username || r?.username || "-";

const StatusBadge = ({ status }) => {
  const s = (status || "pending").toLowerCase();
  const color =
    s === "approved"
      ? "bg-green-100 text-green-700"
      : s === "rejected"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700";
  return (
    <span className={`text-xs px-2 py-1 rounded-full ${color}`}>
      {console.log(s)}
      {s.charAt(0).toUpperCase() + s.slice(1)}
    </span>
  );
};

const TypeBadge = ({ type }) => (
  <Badge variant="secondary" className="rounded-full">
    {type}
  </Badge>
);

const EmptyState = ({ onRefresh }) => (
  <div className="flex flex-col items-center justify-center py-14 text-center">
    <div className="text-xl font-semibold text-gray-800 mb-2">
      No requests found
    </div>
    <p className="text-gray-500 mb-6">
      Try refreshing or adjusting your search.
    </p>
    <Button onClick={onRefresh} variant="outline" className="gap-2">
      <RefreshCw className="h-4 w-4" />
      Refresh
    </Button>
  </div>
);

const RequestItem = ({ req, onApprove, onReject, actionLoading }) => {
  const created = req?.createdAt
    ? new Date(req.createdAt).toLocaleString()
    : "-";

  return (
    <div className="rounded-xl border bg-white p-4 sm:p-5 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="text-sm text-gray-500">Type</div>
          <TypeBadge type={req?.type} />
        </div>
        <div className="space-y-1">
          <div className="text-sm text-gray-500">Status</div>
          <StatusBadge status={req?.status} />
        </div>

        <div className="space-y-1">
          <div className="text-sm text-gray-500">Organization</div>
          <div className="font-medium">{req?.displayOrg || "-"}</div>
        </div>
        <div className="space-y-1">
          <div className="text-sm text-gray-500">Created</div>
          <div className="text-gray-800">{created}</div>
        </div>

        <div className="space-y-1 md:col-span-2">
          <div className="text-sm text-gray-500">Details</div>
          <div className="text-gray-800">{req?.displayDetails || "-"}</div>
        </div>

        {(req?.displayExtra || req?.timeline || req?.budget) && (
          <div className="space-y-1 md:col-span-2">
            <div className="text-sm text-gray-500">Extra</div>
            <div className="text-gray-800">
              {req?.displayExtra || req?.timeline || req?.budget || "-"}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col sm:flex-row gap-3">
        <Button
          variant="success"
          className="gap-2"
          size="sm"
          disabled={req?.status === "approved" || !!actionLoading}
          onClick={(e) => {
            e.stopPropagation();
            onApprove(req);
          }}
        >
          {actionLoading === req?._id + "approved" ? (
            "Approving..."
          ) : (
            <>
              <Check className="h-4 w-4" /> Approve
            </>
          )}
        </Button>
        <Button
          variant="destructive"
          className="gap-2"
          size="sm"
          disabled={req?.status === "rejected" || !!actionLoading}
          onClick={(e) => {
            e.stopPropagation();
            onReject(req);
          }}
        >
          {actionLoading === req?._id + "rejected" ? (
            "Rejecting..."
          ) : (
            <>
              <X className="h-4 w-4" /> Reject
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

const GroupCard = ({
  group,
  expanded,
  toggle,
  onApprove,
  onReject,
  actionLoading,
}) => {
  const { userName, email, items } = group;

  return (
    <div className="rounded-2xl border shadow-sm overflow-hidden bg-white">
      <button
        onClick={toggle}
        className="w-full text-left px-4 sm:px-6 py-4 sm:py-5 hover:bg-gray-50 transition flex items-start justify-between gap-3"
        aria-expanded={expanded}
      >
        <div className="flex items-start gap-3">
          <div className="hidden sm:flex h-10 w-10 rounded-xl bg-primary/10 items-center justify-center shrink-0">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-semibold text-primary">
                {userName || "-"}
              </span>
              <Badge variant="outline" className="rounded-full">
                {items?.length || 0} request
                {(items?.length || 0) > 1 ? "s" : ""}
              </Badge>
            </div>
            <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
              <Mail className="h-4 w-4 opacity-70" />
              <span className="break-all">{email || "-"}</span>
            </div>
          </div>
        </div>
        <div className="mt-1 flex items-center gap-3">
          {!expanded ? (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          )}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "tween", duration: 0.18 }}
          >
            <div className="px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="space-y-4">
                {items
                  ?.slice()
                  .sort((a, b) => {
                    const ta = a?.createdAt
                      ? new Date(a.createdAt).getTime()
                      : 0;
                    const tb = b?.createdAt
                      ? new Date(b.createdAt).getTime()
                      : 0;
                    return tb - ta;
                  })
                  .map((req) => (
                    <RequestItem
                      key={req?._id}
                      req={req}
                      onApprove={onApprove}
                      onReject={onReject}
                      actionLoading={actionLoading}
                    />
                  ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ConsultPrototypeRequests = () => {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [expandedKey, setExpandedKey] = useState(null);

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const [consultingRes, prototypingRes] = await Promise.all([
        axios.get(
          import.meta.env.VITE_API_URI + "/api/consulting/allConsulting"
        ),
        axios.get(
          import.meta.env.VITE_API_URI + "/api/prototyping/allPrototyping"
        ),
      ]);

      const mapRow = (r, type) => ({
        ...r,
        type,
        displayName: getDisplayName(r),
        userNameOnly: getUserNameOnly(r), // strict username for grouping/sorting
        displayEmail: getDisplayEmail(r),
        displayOrg: r?.organization || "-", // per-request, can differ
        displayDetails: r?.details || r?.description || "-",
        displayExtra: r?.timeline || r?.budget || "",
        status: r?.status || "pending",
      });

      const consulting = (consultingRes?.data || []).map((r) =>
        mapRow(r, "Consulting")
      );
      const prototyping = (prototypingRes?.data || []).map((r) =>
        mapRow(r, "Prototyping")
      );

      setRequests([...consulting, ...prototyping]);
    } catch (err) {
      setRequests([]);
    }
    setLoading(false);
  };

  const handleStatusChange = async (req, status) => {
    setActionLoading(req?._id + status);
    try {
      if (req?.type === "Consulting") {
        await axios.patch(
          import.meta.env.VITE_API_URI +
            `/api/consulting/updateConsulting/${req?._id}`,
          { status }
        );
      } else {
        await axios.patch(
          import.meta.env.VITE_API_URI +
            `/api/prototyping/updatePrototyping/${req?._id}`,
          { status }
        );
      }
      await fetchRequests();
    } catch (err) {
      // optionally toast
    }
    setActionLoading(null);
  };

  /** Group strictly by (username, email). Search only username/email. Sort strictly by username (backend) then email. */
  const groups = useMemo(() => {
    const map = new Map();
    for (const r of requests) {
      const userName = r?.userNameOnly || "-";
      const email = r?.displayEmail || "-";
      const key = `${(userName || "-").toLowerCase()}|${(
        email || "-"
      ).toLowerCase()}`;
      if (!map.has(key)) {
        map.set(key, { key, userName, email, items: [] });
      }
      map.get(key).items.push(r);
    }

    let arr = Array.from(map.values());

    const q = search.trim().toLowerCase();
    if (q) {
      arr = arr.filter(
        (g) =>
          (g.userName || "").toLowerCase().startsWith(q) ||
          (g.email || "").toLowerCase().startsWith(q)
      );
    }

    // STRICT sort by backend username, then email (NO org involvement)
    arr.sort(
      (a, b) =>
        (a.userName || "").localeCompare(b.userName || "") ||
        (a.email || "").localeCompare(b.email || "")
    );

    return arr;
  }, [requests, search]);

  return (
    <div className="max-w-5xl mx-auto py-8 px-2 sm:px-4">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-primary">
        Consulting & Prototyping Requests
      </h2>

      <div className="mb-6 flex flex-col sm:flex-row gap-3 sm:gap-6 items-center">
        <Input
          placeholder="Search by username or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80"
        />
        <Button onClick={fetchRequests} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>People ({groups.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-gray-400 py-10">Loading...</div>
          ) : groups.length === 0 ? (
            <EmptyState onRefresh={fetchRequests} />
          ) : (
            <div className="space-y-4">
              {groups.map((group) => {
                const isOpen = expandedKey === group.key;
                return (
                  <GroupCard
                    key={group.key}
                    group={group}
                    expanded={isOpen}
                    toggle={() =>
                      setExpandedKey((prev) =>
                        prev === group.key ? null : group.key
                      )
                    }
                    onApprove={(r) => handleStatusChange(r, "approved")}
                    onReject={(r) => handleStatusChange(r, "rejected")}
                    actionLoading={actionLoading}
                  />
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsultPrototypeRequests;
