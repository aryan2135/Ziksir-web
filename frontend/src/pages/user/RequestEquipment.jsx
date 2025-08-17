import { useState } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RequestEquipment() {
  const [form, setForm] = useState({
    name: "",
    type: "",
    model: "",
    link: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      await axios.post(import.meta.env.VITE_API_URI + "/request-equipment", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Request submitted successfully!");
      setForm({ name: "", type: "", model: "", link: "", image: null });
    } catch (error) {
      setMessage("Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-3 sm:p-6 bg-white">
      <div className="max-w-2xl w-full relative z-10">
        {/* Page Heading */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center text-black drop-shadow-lg">
          Request Equipment
        </h1>

        {/* Animated gradient border wrapper */}
        <div className="p-[2px] sm:p-[3px] rounded-2xl sm:rounded-3xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 animate-[gradientBorder_6s_ease_infinite] bg-[length:300%_300%]">
          <Card className="shadow-2xl rounded-2xl sm:rounded-3xl backdrop-blur-lg bg-white hover:scale-[1.01] sm:hover:scale-[1.02] transition-all duration-300">
            <CardHeader className="pb-3 sm:pb-4 border-b border-gray-200 px-4 sm:px-6">
              <CardTitle className="text-lg sm:text-xl font-semibold text-gray-800">
                Can't find what you need?
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-gray-600">
                Fill out the details below and our team will look into making it available.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {/* Equipment Name */}
                <div>
                  <Label className="text-sm sm:text-base text-gray-700 font-medium">Equipment Name</Label>
                  <Input
                    className="mt-2 sm:mt-1 border-gray-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-400 rounded-xl transition-all text-sm sm:text-base"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter equipment name"
                    required
                  />
                </div>

                {/* Type */}
                <div>
                  <Label className="text-sm sm:text-base text-gray-700 font-medium">Type</Label>
                  <Input
                    className="mt-2 sm:mt-1 border-gray-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-400 rounded-xl transition-all text-sm sm:text-base"
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    placeholder="e.g. Microscope, Analyzer"
                    required
                  />
                </div>

                {/* Model */}
                <div>
                  <Label className="text-sm sm:text-base text-gray-700 font-medium">Model</Label>
                  <Input
                    className="mt-2 sm:mt-1 border-gray-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-400 rounded-xl transition-all text-sm sm:text-base"
                    name="model"
                    value={form.model}
                    onChange={handleChange}
                    placeholder="Enter model number or name"
                  />
                </div>

                {/* Reference Link */}
                <div>
                  <Label className="text-sm sm:text-base text-gray-700 font-medium">
                    Reference Link (optional)
                  </Label>
                  <Input
                    className="mt-2 sm:mt-1 border-gray-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-400 rounded-xl transition-all text-sm sm:text-base"
                    name="link"
                    value={form.link}
                    onChange={handleChange}
                    placeholder="https://example.com/product"
                  />
                </div>

                {/* Upload Image */}
                <div>
                  <Label className="text-sm sm:text-base text-gray-700 font-medium">
                    Upload Image (optional)
                  </Label>
                  <Input
                    type="file"
                    accept="image/*"
                    name="image"
                    className="mt-2 sm:mt-1 border-gray-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-400 rounded-xl transition-all text-xs sm:text-sm"
                    onChange={handleChange}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-violet-400 hover:from-purple-600 hover:via-pink-600 hover:to-violet-500 text-white shadow-lg hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-200 rounded-xl text-sm sm:text-base py-2 sm:py-3"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit Request"}
                </Button>
              </form>

              {/* Message Display */}
              {message && (
                <p
                  className={`mt-4 sm:mt-6 text-center text-xs sm:text-sm font-medium ${message.includes("✅") ? "text-green-600" : "text-red-500"
                    }`}
                >
                  {message}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
