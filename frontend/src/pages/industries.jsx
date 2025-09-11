import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const INDUSTRY_IMAGES = [
  "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=600&q=80",
];

const INDUSTRY_BENEFITS = [
  {
    title: "World-Class Infrastructure",
    desc: "Access advanced labs, instruments, and facilities from top institutions for your R&D and product development.",
    icon: "fas fa-flask",
  },
  {
    title: "Expert Collaboration",
    desc: "Work directly with IIT professors, certified consultants, and technical experts to accelerate innovation.",
    icon: "fas fa-user-tie",
  },
  {
    title: "Rapid Prototyping",
    desc: "Transform your ideas into working prototypes with our custom fabrication, testing, and validation services.",
    icon: "fas fa-cogs",
  },
  {
    title: "Flexible Plans",
    desc: "Choose from pay-as-you-go, subscription, or enterprise packages tailored for startups, SMEs, and large companies.",
    icon: "fas fa-layer-group",
  },
  {
    title: "Analytics & Reporting",
    desc: "Get actionable insights and detailed reports to optimize your research, development, and investment.",
    icon: "fas fa-chart-line",
  },
];

const INDUSTRY_STEPS = [
  {
    step: "1",
    title: "Sign Up & Profile Setup",
    desc: "Create your organization profile and specify your research interests and requirements.",
    icon: "fas fa-user-plus",
  },
  {
    step: "2",
    title: "Browse & Book",
    desc: "Explore available equipment, labs, and services. Book instantly or request custom solutions.",
    icon: "fas fa-search",
  },
  {
    step: "3",
    title: "Collaborate & Innovate",
    desc: "Connect with experts, share data, and work together to solve your toughest challenges.",
    icon: "fas fa-users",
  },
  {
    step: "4",
    title: "Prototype & Scale",
    desc: "Develop prototypes, test products, and scale up with support from Ziksir’s network.",
    icon: "fas fa-rocket",
  },
];

export default function Industries() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-violet-100 font-poppins">
      {/* Navbar - match Index.jsx */}
      <header className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="ml-2 sm:ml-4 font-sans text-2xl sm:text-3xl md:text-4xl font-bold text-primary font-open-sans"
          >
            ziksir
          </button>
          <div className="flex items-center space-x-8">
            <Button
              onClick={() => navigate("/search")}
              variant="ghost"
              size="sm"
              className="font-semibold"
            >
              Equipments
            </Button>
            <Button
              onClick={() => navigate("/user/consultancy")}
              variant="ghost"
              size="sm"
              className="font-semibold"
            >
              Consultancy
            </Button>
            <Button
              onClick={() => navigate("/user/prototyping")}
              variant="ghost"
              size="sm"
              className="font-semibold"
            >
              Prototyping
            </Button>
            <Button
              onClick={() => navigate("/auth")}
              variant="default"
              size="sm"
              className="bg-primary text-white font-bold shadow"
            >
              Login / Signup
            </Button>
          </div>
        </nav>
      </header>

      <div className="pt-28 pb-12 px-2 sm:px-4 max-w-6xl mx-auto">
        {/* Hero Section */}
        <section className="flex flex-col md:flex-row items-center gap-8 mb-12">
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 leading-tight text-foreground">
              Empowering{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Research Industries & Startups
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-6">
              Ziksir connects you to world-class scientific infrastructure, expert guidance, and rapid prototyping—so you can innovate, collaborate, and scale faster than ever.
            </p>
            <Button
              variant="default"
              size="lg"
              className="bg-primary text-white font-semibold"
              onClick={() => navigate("/auth")}
            >
              Get Started
            </Button>
          </div>
          <div className="flex-1 flex items-center justify-center gap-4">
            {INDUSTRY_IMAGES.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt="Industry"
                className="rounded-xl shadow-lg w-32 h-32 object-cover border border-primary/30"
              />
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center text-foreground">
            What Ziksir Offers for Industries & Startups
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {INDUSTRY_BENEFITS.map((benefit, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-primary/30 p-6 flex flex-col items-center text-center"
              >
                <i className={`${benefit.icon} text-4xl mb-4`}></i>
                <h3 className="font-bold text-lg mb-2 text-black">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center text-foreground">
            How It Works
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            {INDUSTRY_STEPS.map((step, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center text-center bg-white rounded-2xl shadow-lg border border-primary/30 p-6 w-full md:w-56"
              >
                <div className="bg-foreground rounded-full w-14 h-14 flex items-center justify-center mb-3">
                  <i className={`${step.icon} text-white text-2xl`}></i>
                </div>
                <span className="font-bold text-primary mb-1">{step.title}</span>
                <span className="text-xs text-muted-foreground mb-2">{step.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center mt-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">
            Ready to Accelerate Your Innovation?
          </h2>
          <p className="text-muted-foreground mb-6">
            Join Ziksir today and unlock the full potential of your research, development, and growth.
          </p>
          <Button
            variant="default"
            size="lg"
            className="bg-primary text-white font-bold shadow"
            onClick={() => navigate("/auth")}
          >
            Join Now
          </Button>
        </section>
      </div>
    </div>
  );
}
