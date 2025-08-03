import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SlideInSection from '@/components/ui/slidein';
import { Outlet, useNavigate, NavLink } from "react-router-dom";

const ziksir = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  // useEffect(() => {
  //   // Set dark mode as default
  //   document.documentElement.classList.add('dark');

  //   // Check localStorage for theme preference
  //   const savedTheme = localStorage.getItem('theme');
  //   if (savedTheme) {
  //     setDarkMode(savedTheme === 'dark');
  //     if (savedTheme === 'light') {
  //       document.documentElement.classList.remove('dark');
  //     }
  //   }
  // }, []);

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');

    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background font-poppins">
      {/* Fixed Header */}
      <header className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => {
              navigate("/");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className=" ml-4 font-sans transition-blue text-4xl font-bold text-primary text-accent font-open-sans"
          >
            ziksir
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('features')} className="text-foreground hover:text-accent transition-colors">
              Features
            </button>
            <button onClick={() => scrollToSection('process')} className="text-foreground hover:text-accent transition-colors">
              Process
            </button>
            <button onClick={() => scrollToSection('pricing')} className="text-foreground hover:text-accent transition-colors">
              Pricing
            </button>
            <button onClick={() => scrollToSection('contact')} className="text-foreground hover:text-accent transition-colors">
              Contact
            </button>
            {/* <Button onClick={toggleTheme} variant="outline" size="sm">
              <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
            </Button> */}
            <Button onClick={() => window.location.href = '/auth'} variant="default" size="sm">
              <i className="fas fa-sign-in-alt mr-2"></i>
              Login
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* <Button onClick={toggleTheme} variant="outline" size="sm">
              <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
            </Button> */}
            <Button onClick={() => window.location.href = '/auth'} variant="default" size="sm">
              <i className="fas fa-sign-in-alt"></i>
            </Button>
            <Button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              variant="outline"
              size="sm"
            >
              <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </Button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background border-t border-border">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <button onClick={() => scrollToSection('features')} className="block text-foreground hover:text-accent transition-colors">
                Features
              </button>
              <button onClick={() => scrollToSection('process')} className="block text-foreground hover:text-accent transition-colors">
                Process
              </button>
              <button onClick={() => scrollToSection('pricing')} className="block text-foreground hover:text-accent transition-colors">
                Pricing
              </button>
              <button onClick={() => scrollToSection('contact')} className="block text-foreground hover:text-accent transition-colors">
                Contact
              </button>
              <button onClick={() => window.location.href = '/auth'} className="block text-foreground hover:text-accent transition-colors">
                <i className="fas fa-sign-in-alt mr-2"></i>
                Login
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-10 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-sans md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              World class services & equipment on demand
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 font-open-sans">
              Access thousands of instruments and services from renowned scientific organizations.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
              <Button size="lg" className="text-lg px-8 py-3">
                <i className="fas fa-calendar-alt mr-2"></i>
                Book a Demo
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                <i className="fas fa-play mr-2"></i>
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Institution Logos Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="text-center">
          <p className="text-lg mb-20 opacity-80 tracking-wide">
            Trusted by leading institutions across the country.
          </p>
          <div className="relative w-full overflow-hidden">
            <div className="flex min-w-full animate-marquee gap-8">
              <img src="logo-iitkgp.png" alt="IIT Kharagpur" className="h-20 opacity-80 hover:opacity-100 transition" />
              <img src="logo-cu.png" alt="Calcutta University" className="h-20 opacity-80 hover:opacity-100 transition" />
              <img src="logo-durgapur.png" alt="NIT Durgapur" className="h-20 opacity-80 hover:opacity-100 transition" />
              <img src="logo-jadavpur.png" alt="Jadavpur University" className="h-20 opacity-80 hover:opacity-100 transition" />
              <img src="logo-shibpur.png" alt="IIEST Shibpur" className="h-20 opacity-80 hover:opacity-100 transition" />
              <img src="logo-heritage.png" alt="Heritage College" className="h-20 opacity-80 hover:opacity-100 transition" />
              <img src="logo-bangalore.png" alt="IISc Bangalore" className="h-20 opacity-80 hover:opacity-100 transition" />

              <img src="logo-iitkgp.png" alt="IIT Kharagpur" className="h-20 opacity-80 hover:opacity-100 transition" />
              <img src="logo-cu.png" alt="Calcutta University" className="h-20 opacity-80 hover:opacity-100 transition" />
              <img src="logo-durgapur.png" alt="NIT Durgapur" className="h-20 opacity-80 hover:opacity-100 transition" />
              <img src="logo-jadavpur.png" alt="Jadavpur University" className="h-20 opacity-80 hover:opacity-100 transition" />
              <img src="logo-shibpur.png" alt="IIEST Shibpur" className="h-20 opacity-80 hover:opacity-100 transition" />
              <img src="logo-heritage.png" alt="Heritage College" className="h-20 opacity-80 hover:opacity-100 transition" />
              <img src="logo-bangalore.png" alt="IISc Bangalore" className="h-20 opacity-80 hover:opacity-100 transition" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16">
        <SlideInSection>
        <div className="container" >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground"> Search thousands of scientific services and instruments </h2>
            {/* <p className="text-xl text-muted-foreground font-open-sans">
              Everything you need to manage research infrastructure efficiently
            </p> */}
          </div>

          <div className="md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:px-20 overflow-x-scroll md:overflow-visible flex md:block space-x-4 md:space-x-0">
            {[
              {
                icon: "fas fa-search",
                title: "Smart Discovery",
                description: "Find the exact equipment and facilities you need with our advanced search and filtering system."
              },
              {
                icon: "fas fa-calendar-check",
                title: "Easy Booking",
                description: "Schedule equipment time slots and facility access with our intuitive booking interface."
              },
              {
                icon: "fas fa-chart-line",
                title: "Analytics & Insights",
                description: "Track usage patterns, optimize resource allocation, and make data-driven decisions."
              },
              {
                icon: "fas fa-users",
                title: "Collaboration Tools",
                description: "Share resources, coordinate with team members, and manage multi-user projects."
              },
              {
                icon: "fas fa-shield-alt",
                title: "Secure Access",
                description: "Role-based permissions and secure authentication ensure proper resource management."
              },
              {
                icon: "fas fa-cog",
                title: "Integration Ready",
                description: "Connect with existing lab management systems and research workflows seamlessly."
              }
            ].map((feature, index) => (
              <Card key={index} className="min-w-[65%] sm:min-w-[300px] sm:min-h-[110%] md:min-w-0 lg:shadow-lg lg:hover:shadow-xl lg:hover:scale-105 transition-all duration-300">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
                    <i className={`${feature.icon} text-xl text-accent-foreground`}></i>
                  </div>
                  <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="font-open-sans font-semibold">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        </SlideInSection>
      </section>

      {/* Process Section */}
      <section id="process" className="py-16 px-4 bg-gray-900">
        <SlideInSection>
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-300">How ziksir Works</h2>
            <p className="text-xl text-gray-400 font-open-sans font-semibold">
              Three simple steps to access world-class research infrastructure
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Discover",
                description: "Browse our comprehensive database of research equipment and facilities. Use filters to find exactly what you need.",
                icon: "fas fa-search"
              },
              {
                title: "Book",
                description: "Select your preferred time slots and submit booking requests. Get instant confirmation or quick approval.",
                icon: "fas fa-calendar-plus"
              },
              {
                title: "Research",
                description: "Access your booked resources, collaborate with your team, and focus on what matters most - your research.",
                icon: "fas fa-microscope"
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative flex items-center">
                  <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 mr-4">
                    <i className={`${step.icon} text-2xl text-accent-foreground`}></i>
                  </div>
                <h3 className="text-2xl font-bold mx-auto mb-4 ml-2 text-accent">{step.title}</h3>
                </div>
                <p className="text-gray-300 font-open-sans font-semibold">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
        </SlideInSection>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4">
        <SlideInSection>
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">What Researchers Say</h2>
            <p className="text-xl text-muted-foreground font-open-sans font-semibold">
              Trusted by leading research institutions throughout the country. 
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "ziksir has revolutionized how we manage our lab equipment. The booking system is intuitive and saves us hours every week.",
                author: "Dr. Sarah Chen",
                role: "Principal Investigator, Stanford University",
                avatar: "fas fa-user-circle"
              },
              {
                quote: "The platform made it easy to find specialized equipment across our entire campus. It's like having a research concierge.",
                author: "Prof. Michael Rodriguez",
                role: "Department Head, MIT",
                avatar: "fas fa-user-circle"
              },
              {
                quote: "Finally, a solution that understands the unique needs of research facilities. The analytics help us optimize our resources.",
                author: "Dr. Emily Watson",
                role: "Facility Manager, Harvard Medical School",
                avatar: "fas fa-user-circle"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className="fas fa-star text-accent text-sm"></i>
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 font-open-sans italic font-medium">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center mr-3">
                      <i className={`${testimonial.avatar} text-accent-foreground`}></i>
                    </div>
                    <div>
                      <div className="font-semibold text-foreground font-bold">{testimonial.author}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        </SlideInSection>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-gray-900">
        <SlideInSection>
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-300">Choose Your Plan</h2>
            <p className="text-xl text-gray-400 font-open-sans">
              Flexible pricing for research teams of all sizes
            </p>
          </div>

          <div className="flex md:grid md:grid-cols-3 gap-8 overflow-x-scroll overflow-y-hidden md:overflow-visible px-4 md:px-0 py-8 md:py-0 space-x-4 md:space-x-0">
            {[
              {
                name: "Researcher",
                price: "$29",
                period: "/month",
                description: "Perfect for individual researchers and small teams",
                features: [
                  "Access to equipment database",
                  "Basic booking functionality",
                  "Email support",
                  "Usage analytics",
                  "Mobile app access"
                ],
                icon: "fas fa-user",
                popular: false
              },
              {
                name: "Institution",
                price: "$99",
                period: "/month",
                description: "Ideal for departments and research institutions",
                features: [
                  "Everything in Researcher",
                  "Advanced booking management",
                  "Team collaboration tools",
                  "Priority support",
                  "Custom integrations",
                  "Advanced analytics"
                ],
                icon: "fas fa-university",
                popular: true
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "",
                description: "For large organizations with complex needs",
                features: [
                  "Everything in Institution",
                  "White-label solution",
                  "Dedicated account manager",
                  "24/7 phone support",
                  "Custom development",
                  "SLA guarantees"
                ],
                icon: "fas fa-building",
                popular: false
              }
            ].map((plan, index) => (
              <Card
                 key={index}
                className={`relative min-w-[85%] sm:min-w-[300px] py-[30px] md:min-w-0 shadow hover:shadow-xl hover:scale-105 transition-all duration-300 ${
                 plan.popular
                    ? 'shadow-lg hover:shadow-2xl hover:scale-110 ring-2 ring-accent scale-105 py-0'
                    : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className={`${plan.icon} text-2xl text-accent-foreground`}></i>
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground ml-1">{plan.period}</span>
                  </div>
                  <CardDescription className="font-open-sans">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center font-open-sans">
                        <i className="fas fa-check text-accent mr-3"></i>
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                    {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        </SlideInSection>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-4">
        <SlideInSection>
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">Get In Touch</h2>
            <p className="text-xl text-muted-foreground font-open-sans">
              Ready to transform your research infrastructure management?
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
<Card>
  <CardHeader>
    <CardTitle>Send us a message</CardTitle>
    <CardDescription>We'll get back to you within 24 hours</CardDescription>
  </CardHeader>
  <CardContent>
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault(); // Prevent page reload
        alert("Message sent!");
      }}
    >
      <div>
        <label className="block text-sm font-medium mb-2">Name</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-accent focus:border-transparent"
          placeholder="Your full name"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Email</label>
        <input
          type="email"
          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-accent focus:border-transparent"
          placeholder="your.email@institution.edu"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Institution</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-accent focus:border-transparent"
          placeholder="Your institution name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Message</label>
        <textarea
          rows="4"
          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-accent focus:border-transparent"
          placeholder="Tell us about your research infrastructure needs..."
          required
        ></textarea>
      </div>
      <Button type="submit" className="w-full">
        <i className="fas fa-paper-plane mr-2"></i>
        Send Message
      </Button>
    </form>
  </CardContent>
</Card>


            {/* Contact Info & Calendly */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Schedule a Demo</CardTitle>
                  <CardDescription>Book a personalized demo with our team</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-secondary rounded-lg p-4 text-center">
                    <i className="fas fa-calendar-alt text-3xl text-accent mb-4"></i>
                    <p className="text-muted-foreground mb-4 font-open-sans">
                      See ziksir in action with a live demo tailored to your needs
                    </p>
                    <Button className="w-full">
                      <i className="fas fa-video mr-2"></i>
                      Book Demo Call
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Other Ways to Reach Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center mr-4">
                        <i className="fas fa-envelope text-accent-foreground"></i>
                      </div>
                      <div>
                        <div className="font-semibold">Email</div>
                        <div className="text-muted-foreground">hello@ziksir.com</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center mr-4">
                        <i className="fas fa-phone text-accent-foreground"></i>
                      </div>
                      <div>
                        <div className="font-semibold">Phone</div>
                        <div className="text-muted-foreground">+1 (555) 123-4567</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center mr-4">
                        <i className="fas fa-map-marker-alt text-accent-foreground"></i>
                      </div>
                      <div>
                        <div className="font-semibold">Office</div>
                        <div className="text-muted-foreground">San Francisco, CA</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
          </SlideInSection> 
      </section>

      {/* Footer */}
      <footer className="bg-navy py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="font-sans text-3xl font-bold text-secondary mb-4">
                ziksir
              </div>
              <p className="text-muted-foreground font-open-sans">
                Connecting researchers with the infrastructure they need to advance science.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-secondary">Product</h4>
              <ul className="space-y-2 text-muted-foreground font-open-sans">
                <li><a href="#" className="hover:text-accent transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">API</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-secondary">Company</h4>
              <ul className="space-y-2 text-muted-foreground font-open-sans">
                <li><a href="#" className="hover:text-accent transition-colors">About</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-secondary">Support</h4>
              <ul className="space-y-2 text-muted-foreground font-open-sans">
                <li><a href="#" className="hover:text-accent transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 text-center text-muted-foreground font-open-sans">
            <p>&copy; 2024 ziksir. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 bg-accent hover:bg-accent/90 rounded-full flex items-center justify-center text-accent-foreground shadow-lg transition-all duration-300 hover:scale-110"
        aria-label="Back to top"
      >
        <i className="fas fa-chevron-up"></i>
      </button>
    </div>
  );
};

export default ziksir;
