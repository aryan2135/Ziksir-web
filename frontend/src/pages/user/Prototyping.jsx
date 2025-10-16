import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import axios from "@/api/axios";
import { Helmet } from "react-helmet";
import userProfileStore from "@/store/userProfileStore";

const PROTOTYPING_FEATURES = [
  {
    icon: "fas fa-cogs",
    title: "End-to-End Prototyping",
    desc: "Mechanical, electrical, and software prototyping for research, startups, and industry.",
  },
  {
    icon: "fas fa-tools",
    title: "Advanced Equipment",
    desc: "Access to 3D printers, CNC machines, electronics labs, and more.",
  },
  {
    icon: "fas fa-lightbulb",
    title: "Idea to Reality",
    desc: "Transform your concepts into working prototypes with expert support.",
  },
  {
    icon: "fas fa-users",
    title: "Collaborative Development",
    desc: "Work with IIT experts, engineers, and designers for best results.",
  },
  {
    icon: "fas fa-shield-alt",
    title: "IP & Confidentiality",
    desc: "Secure handling of intellectual property and confidential designs.",
  },
  {
    icon: "fas fa-industry",
    title: "Scalability & Production",
    desc: "Guidance for scaling prototypes to production and commercialization.",
  },
];

const Prototyping = () => {
  const { userData } = userProfileStore();

  const [formData, setFormData] = useState({
    phone: "",
    organization: "",
    prototypeType: "",
    materials: "",
    equipment: "",
    requirements: "",
    useCase: "",
    scalability: "",
    ip: "",
    file: null,
  });

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formError, setFormError] = useState("");
  const [myRequests, setMyRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // ✅ Fetch user's prototyping requests safely
  const fetchMyRequests = async () => {
    if (!userData?.email) return;
    setLoadingRequests(true);
    try {
      const res = await axios.post(
        import.meta.env.VITE_API_URI + "/api/prototyping/userPrototyping",
        { email: userData?.email }
      );
      const userEmail = userData?.email?.toLowerCase();
      setMyRequests(
        (res.data || []).filter(
          (req) =>
            req.user?.email?.toLowerCase?.() === userEmail ||
            req.email?.toLowerCase?.() === userEmail
        )
      );
    } catch (err) {
      console.error("❌ Fetch error:", err.response?.data || err.message);
      setMyRequests([]);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    if (userData?.email) fetchMyRequests();
  }, [userData, message]);

  // ✅ Safe form submission
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: "", text: "" });
    setFormError("");

    try {
      if (!userData?.email) {
        setFormError("User not authenticated. Please log in again.");
        setSubmitting(false);
        return;
      }

      const data = new FormData();
      const payload = {
        ...formData,
        email: userData?.email,
        userName: userData?.name,
      };

      for (let key in payload) {
        if (key === "file") {
          if (payload.file) data.append("file", payload.file);
        } else {
          if (
            payload[key] !== undefined &&
            payload[key] !== null &&
            payload[key] !== ""
          ) {
            data.append(key, payload[key]);
          }
        }
      }

      await axios.post(
        import.meta.env.VITE_API_URI + "/api/prototyping/addPrototype",
        data
      );

      setFormData({
        phone: "",
        organization: "",
        prototypeType: "",
        materials: "",
        equipment: "",
        requirements: "",
        useCase: "",
        scalability: "",
        ip: "",
        file: null,
      });

      setMessage({
        type: "success",
        text: "Prototyping request submitted successfully!",
      });

      fetchMyRequests();
    } catch (error) {
      console.error(
        "❌ Submission Error:",
        error.response?.data || error.message
      );
      setFormError(
        error.response?.data?.message ||
          "Failed to submit prototyping request. Try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-violet-100 font-poppins py-10 px-2">
      <Helmet>
        <title>Prototyping | Ziksir</title>
        <meta
          name="description"
          content="Submit your prototyping request and get expert support from Ziksir."
        />
        <meta
          name="keywords"
          content="prototyping, research, ziksir, request"
        />
        <meta name="author" content="Ziksir" />
        <meta property="og:title" content="Prototyping | Ziksir" />
        <meta
          property="og:description"
          content="Submit your prototyping request and get expert support from Ziksir."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 items-start">
        {/* Info Section */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg border border-violet-100 p-8 mb-8 md:mb-0">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-violet-800 mb-3">
              Ziksir Prototyping Services
            </h1>
            <p className="text-lg text-muted-foreground font-open-sans">
              Ziksir offers comprehensive prototyping solutions for researchers,
              startups, and industries. From concept to working model, our team
              helps you design, build, and test prototypes using advanced
              equipment and expert guidance.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            {PROTOTYPING_FEATURES.map((feature, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center text-center bg-gradient-to-br from-blue-50 to-violet-50 rounded-xl p-5 shadow hover:shadow-md transition"
              >
                <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mb-3">
                  <i className={`${feature.icon} text-2xl text-violet-800`}></i>
                </div>
                <h3 className="font-bold text-black mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <img
              src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80"
              alt="Prototyping"
              className="rounded-xl shadow-lg mx-auto w-full max-w-xs"
            />
          </div>
        </div>

        {/* Form Section */}
        <div className="flex-1 max-w-md w-full">
          <div className="bg-white rounded-lg shadow-lg border border-violet-100 p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4 text-violet-800 text-center">
              Prototyping Request Form
            </h2>

            {formError && (
              <p className="text-red-500 text-sm mb-4">{formError}</p>
            )}
            {message.text && message.type === "success" && (
              <div className="mb-4 p-3 rounded-lg text-white bg-green-600 text-center">
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Organization / Institution"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-violet-400 focus:outline-none"
                  value={formData.organization}
                  onChange={(e) =>
                    setFormData({ ...formData, organization: e.target.value })
                  }
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-violet-400 focus:outline-none"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                />
              </div>

              <input
                type="text"
                placeholder="Prototype Type (Mechanical, Electrical, Software, etc.)"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-violet-400 focus:outline-none"
                value={formData.prototypeType}
                onChange={(e) =>
                  setFormData({ ...formData, prototypeType: e.target.value })
                }
                required
              />

              <textarea
                placeholder="Materials / Components Needed"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-violet-400 focus:outline-none"
                rows={2}
                value={formData.materials}
                onChange={(e) =>
                  setFormData({ ...formData, materials: e.target.value })
                }
              />

              <textarea
                placeholder="Equipment / Tools Required"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-violet-400 focus:outline-none"
                rows={2}
                value={formData.equipment}
                onChange={(e) =>
                  setFormData({ ...formData, equipment: e.target.value })
                }
              />

              <textarea
                placeholder="Technical Requirements / Specifications"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-violet-400 focus:outline-none"
                rows={3}
                value={formData.requirements}
                onChange={(e) =>
                  setFormData({ ...formData, requirements: e.target.value })
                }
              />

              <textarea
                placeholder="Intended Use Case / Application"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-violet-400 focus:outline-none"
                rows={3}
                value={formData.useCase}
                onChange={(e) =>
                  setFormData({ ...formData, useCase: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Scalability Plans (Prototype → Production)"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-violet-400 focus:outline-none"
                value={formData.scalability}
                onChange={(e) =>
                  setFormData({ ...formData, scalability: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Intellectual Property / Patents (if any)"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-violet-400 focus:outline-none"
                value={formData.ip}
                onChange={(e) =>
                  setFormData({ ...formData, ip: e.target.value })
                }
              />

              <input
                type="file"
                className="w-full border rounded-lg p-2"
                onChange={(e) =>
                  setFormData({ ...formData, file: e.target.files[0] })
                }
              />

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-violet-800 hover:bg-violet-900 text-white"
              >
                {submitting ? "Submitting..." : "Submit Prototyping Request"}
              </Button>
            </form>
          </div>

          {/* --- Requests Card --- */}
          <div className="bg-white rounded-xl shadow-lg border border-violet-100 p-6">
            <h3 className="text-xl font-bold mb-4 text-violet-800 text-center">
              Your Prototyping Requests & Status
            </h3>
            {loadingRequests ? (
              <div className="text-center text-gray-400 py-6">Loading...</div>
            ) : myRequests.length === 0 ? (
              <div className="text-center text-gray-400 py-6">
                No requests found. Submit a request to see status here.
              </div>
            ) : (
              <div className="space-y-4">
                {myRequests.map((req) => (
                  <div
                    key={req._id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-violet-50 rounded-lg p-4 border border-violet-100"
                  >
                    <div>
                      <div className="font-semibold text-primary">
                        {req.organization}
                      </div>
                      <div className="text-sm text-gray-600">
                        {req.prototypeType}
                      </div>
                      <div className="text-xs text-gray-400">
                        {req.createdAt
                          ? new Date(req.createdAt).toLocaleString()
                          : ""}
                      </div>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <span
                        className={`px-4 py-1 rounded-full text-sm font-semibold ${
                          req.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : req.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {req.status === "approved"
                          ? "Approved"
                          : req.status === "rejected"
                          ? "Rejected"
                          : "Pending"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prototyping;
