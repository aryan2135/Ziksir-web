import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import axios from "@/api/axios";
import { Helmet } from "react-helmet";
import userProfileStore from "@/store/userProfileStore";

const CONSULTANCY_FEATURES = [
  {
    icon: "fas fa-user-tie",
    title: "Expert Guidance",
    desc: "Get direct access to IIT professors and certified consultants for your research challenges.",
  },
  {
    icon: "fas fa-lightbulb",
    title: "Idea Validation",
    desc: "Refine your concepts and receive actionable feedback from experienced professionals.",
  },
  {
    icon: "fas fa-network-wired",
    title: "Collaboration Network",
    desc: "Connect with a vast network of researchers, startups, and industry leaders.",
  },
  {
    icon: "fas fa-certificate",
    title: "Certification & Reports",
    desc: "Receive certified reports and documentation to strengthen your research outcomes.",
  },
  {
    icon: "fas fa-rocket",
    title: "Accelerated Research",
    desc: "Speed up your research process with tailored consultancy and strategic support.",
  },
];

const Consultancy = () => {
  const [formData, setFormData] = useState({
    phone: "",
    organization: "",
    category: "",
    description: "",
    timeline: "",
    budget: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formError, setFormError] = useState("");
  const [myRequests, setMyRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  const { userData } = userProfileStore();

  const fetchMyRequests = async (phone, organization) => {
    setLoadingRequests(true);
    try {
      const res = await axios.post(
        import.meta.env.VITE_API_URI + "/api/consulting/userConsulting",
        { email: userData?.email }
      );
      // Show all requests for this phone/org, even if form is empty
      setMyRequests(
        res.data.filter(
          (req) =>
            (phone && req.phone === phone) ||
            (organization && req.organization === organization)
        )
      );
    } catch {
      setMyRequests([]);
    }
    setLoadingRequests(false);
  };

  // Fetch on mount if phone/org in localStorage (for earlier requests)
  useEffect(() => {
    const savedPhone = localStorage.getItem("ziksir_consult_phone") || "";
    const savedOrg = localStorage.getItem("ziksir_consult_org") || "";
    const email = userData?.email || "";
    const userName = userData?.name || "";
    if (savedPhone || savedOrg) {
      setFormData((prev) => ({
        ...prev,
        phone: savedPhone,
        organization: savedOrg,
        email: email,
      }));
      fetchMyRequests(savedPhone, savedOrg);
    }
  }, []);

  // Fetch when phone/org changes (after user types or submits)
  useEffect(() => {
    if (formData.phone || formData.organization) {
      fetchMyRequests(formData.phone, formData.organization);
      // Save for next visit
      localStorage.setItem("ziksir_consult_phone", formData.phone);
      localStorage.setItem("ziksir_consult_org", formData.organization);
    }
  }, [formData.phone, formData.organization, message]);

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: "", text: "" });
    setFormError("");
    try {
      // Ensure no userName leaks from the form
      const { userName, name, ...cleanForm } = formData;
      const payload = { ...cleanForm, email: userData?.email };
      await axios.post(
        import.meta.env.VITE_API_URI + "/api/consulting/addConsulting",
        payload
      );
      setMessage({
        type: "success",
        text: "Consultancy request submitted successfully!",
      });
      // Optionally clear only description/timeline/budget
      setFormData((prev) => ({
        ...prev,
        category: "",
        description: "",
        timeline: "",
        budget: "",
      }));
      // Refetch requests
      fetchMyRequests(formData.phone, formData.organization);
    } catch (error) {
      setFormError("Failed to submit consultancy request. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-violet-100 font-poppins py-10 px-2">
      <Helmet>
        <title>Consultancy | Ziksir</title>
        <meta
          name="description"
          content="Submit your consultancy request and get expert guidance from Ziksir."
        />
        <meta
          name="keywords"
          content="consultancy, research, ziksir, request"
        />
        <meta name="author" content="Ziksir" />
        <meta property="og:title" content="Consultancy | Ziksir" />
        <meta
          property="og:description"
          content="Submit your consultancy request and get expert guidance from Ziksir."
        />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 items-start">
        {/* Info Section */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg border border-blue-100 p-8 mb-8 md:mb-0">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl text-violet-800 font-bold mb-3">
              Ziksir Consultancy Services
            </h1>
            <p className="text-lg text-muted-foreground font-open-sans">
              Unlock your research potential with personalized consultancy from
              top experts. Whether you're a startup, industry, or academic,
              Ziksir connects you to the right minds for every challenge.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            {CONSULTANCY_FEATURES.map((feature, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center text-center bg-gradient-to-br from-blue-50 to-violet-50 rounded-xl p-5 shadow hover:shadow-md transition"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <i className={`${feature.icon} text-2xl`}></i>
                </div>
                <h3 className="font-bold text-primary mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <img
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80"
              alt="Consultancy"
              className="rounded-xl shadow-lg mx-auto w-full max-w-xs"
            />
          </div>
        </div>

        {/* Form + Requests Card */}
        <div className="flex-1 max-w-md w-full">
          <div className="bg-white rounded-lg shadow-lg border border-blue-100 p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4 text-violet-800 text-center">
              Consultancy Request Form
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
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                  value={formData.organization}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      organization: e.target.value,
                    })
                  }
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  inputMode="numeric"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Research Category / Domain"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
              />
              <textarea
                placeholder="Describe your research goals, challenges, or areas where you seek guidance..."
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                rows={5}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Estimated Timeline (e.g., 3 months)"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                value={formData.timeline}
                onChange={(e) =>
                  setFormData({ ...formData, timeline: e.target.value })
                }
              />
              <input
                pattern="[0-9]*"
                inputMode="numeric"
                placeholder="Approx. Budget (if applicable)"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                value={formData.budget}
                onChange={(e) =>
                  setFormData({ ...formData, budget: e.target.value })
                }
              />
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-violet-800 hover:bg-violet-900 text-white font-semibold"
              >
                {submitting ? "Submitting..." : "Submit Consultancy Request"}
              </Button>
            </form>
          </div>
          {/* Requests Status Card - now directly below the form card */}
          <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6">
            <h3 className="text-xl font-bold mb-4 text-violet-800 text-center">
              Your Consultancy Requests & Status
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
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-blue-50 rounded-lg p-4 border border-blue-100"
                  >
                    <div>
                      <div className="font-semibold text-primary">
                        {req.organization}
                      </div>
                      <div className="text-sm text-gray-600">
                        {req.category}
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

export default Consultancy;
