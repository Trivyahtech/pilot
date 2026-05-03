import { useState, useEffect, useRef } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, User, Building2, ChevronDown } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Breadcrumb from "@/components/Breadcrumb";
import { API_BASE_URL } from "@/hooks/useCatalog";

export default function Contact() {
  useEffect(() => {
    document.title = "Contact | PILOT IMPEX - Chemical Suppliers Since 1992";
  }, []);

  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    inquiryType: searchParams.get("inquiryType") || "general",
    product: searchParams.get("product") || "",
    requirement: searchParams.get("product")
      ? `I am interested in ${searchParams.get("product")}. Please provide more details.`
      : "",
    company: "",
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inquiryTypes = [
    { value: "general", label: "General Inquiry" },
    { value: "product", label: "Product Inquiry" },
    { value: "partnership", label: "Partnership / Collaboration" },
    { value: "support", label: "Technical Support" },
    { value: "other", label: "Other" },
  ];

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Scroll to form when coming from a product page
  useEffect(() => {
    if (searchParams.get("product") && location.hash === "#contact-form") {
      const formElement = document.getElementById("contact-form");
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [searchParams, location.hash]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send POST request to the API
      const response = await fetch(`${API_BASE_URL}/form`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit inquiry");
      }

      // Show success toast
      toast({
        title: "Inquiry Sent Successfully!",
        description: "Thank you for your inquiry. Our team will contact you soon.",
      });

      // Reset form but keep product if it was pre-filled from URL
      const resetProduct = searchParams.get("product") || "";
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        inquiryType: resetProduct ? "product" : "general",
        product: resetProduct,
        requirement: resetProduct
          ? `I am interested in ${resetProduct}. Please provide more details.`
          : "",
        company: "",
      });
    } catch (error) {
      // Show error toast
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your inquiry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInquiryTypeSelect = (type, label) => {
    setFormData((prev) => ({
      ...prev,
      inquiryType: type,
      product:
        type === "product" && !prev.product && searchParams.get("product")
          ? searchParams.get("product") || ""
          : prev.product,
    }));
    setIsDropdownOpen(false);
  };

  const getInquiryLabel = (value) => {
    const type = inquiryTypes.find((type) => type.value === value);
    return type ? type.label : "Select Inquiry Type";
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="pt-24">
        <Breadcrumb
          items={[
            { label: "Home", to: "/" },
            { label: "Contact Us" },
          ]}
        />
      </div>

      {/* Hero Section */}
      <section className="pt-12 pb-1 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Contact Us
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Get in touch with our team for all your chemical requirements. We're here to help you find the right solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-heading">Send Inquiry</CardTitle>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll get back to you promptly.
                </p>
              </CardHeader>
              <CardContent>
                <form id="contact-form" onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="mt-1 border-border focus:border-primary focus:ring-1 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="mt-1 border-border focus:border-primary focus:ring-1 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="company">Company Name</Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="mt-1 border-border focus:border-primary focus:ring-1 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-1 border-border focus:border-primary focus:ring-1 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <Label htmlFor="mobile">Mobile Number *</Label>
                    <Input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      required
                      className="mt-1 border-border focus:border-primary focus:ring-1 focus:ring-primary/20"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>

                  <div>
                    <Label>Inquiry Type *</Label>
                    <div className="relative mt-1" ref={dropdownRef}>
                      <button
                        type="button"
                        className="flex items-center justify-between w-full px-4 py-2 text-left bg-background border border-border rounded-md shadow-sm hover:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      >
                        <span>{getInquiryLabel(formData.inquiryType)}</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            isDropdownOpen ? "transform rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isDropdownOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg">
                          {inquiryTypes.map((type) => (
                            <button
                              key={type.value}
                              type="button"
                              className={`w-full text-left px-4 py-2 hover:bg-muted/50 ${
                                formData.inquiryType === type.value
                                  ? "bg-muted/30 text-primary"
                                  : ""
                              }`}
                              onClick={() => handleInquiryTypeSelect(type.value, type.label)}
                            >
                              {type.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {formData.inquiryType === "product" && (
                    <div>
                      <Label htmlFor="product">Product Name *</Label>
                      <Input
                        id="product"
                        name="product"
                        value={formData.product}
                        onChange={handleInputChange}
                        required
                        className="mt-1 border-border focus:border-primary focus:ring-1 focus:ring-primary/20"
                        placeholder="Enter product name"
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="requirement">
                      {formData.inquiryType === "product"
                        ? "Additional Details"
                        : "Tell us your requirement *"}
                    </Label>
                    <Textarea
                      id="requirement"
                      name="requirement"
                      value={formData.requirement}
                      onChange={handleInputChange}
                      required={formData.inquiryType !== "product"}
                      rows={4}
                      className="mt-1 border-border focus:border-primary focus:ring-1 focus:ring-primary/20"
                      placeholder={
                        formData.inquiryType === "product"
                          ? "Please provide any additional details about your product inquiry..."
                          : "Please describe your requirements..."
                      }
                    />
                  </div>

                  <div className="space-y-4">
                    <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? "Sending..." : "Send Inquiry"}
                    </Button>

                    <div className="relative flex items-center py-2">
                      <div className="flex-grow border-t border-border"></div>
                      <span className="flex-shrink px-4 text-sm text-muted-foreground">
                        OR
                      </span>
                      <div className="flex-grow border-t border-border"></div>
                    </div>

                    <Button
                      type="button"
                      onClick={() => {
                        const message =
                          "Hello, I have a general inquiry. Could you please provide more information?";
                        const phoneNumber = "918460740387";
                        window.open(
                          `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
                          "_blank"
                        );
                      }}
                      className="w-full bg-whatsapp hover:bg-whatsapp-dark text-white font-medium shadow-sm hover:shadow-md transition-all duration-200"
                      size="lg"
                    >
                      Chat on WhatsApp
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Company Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building2 className="mr-2 w-5 h-5 text-primary" />
                    Company Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-heading font-semibold text-lg text-primary">
                      PILOT IMPEX
                    </h3>
                    <p className="text-muted-foreground text-sm">GST: 24ARBPT2700N1ZS</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-foreground font-medium">Address</p>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          B-4, Bela Chamber, Vinoba Bhave Road,
                          <br />
                          Opp. M C High School, Salat Wada,
                          <br />
                          Vadodara - 390001, Gujarat, India
                        </p>
                      </div>
                    </div>
                    <a
                      href="https://maps.app.goo.gl/AwYUDyEmi1LMZPfg7"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-primary hover:underline mt-2 ml-8"
                    >
                      <MapPin className="w-4 h-4 mr-1" />
                      View on Google Maps
                    </a>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-foreground font-medium">Phone</p>
                      <a href="tel:08045804678" className="text-primary hover:underline">
                        08045804678
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-foreground font-medium">Email</p>
                      <a href="mailto:info@pilotimpex.com" className="text-primary hover:underline">
                        info@pilotimpex.com
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Person */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="mr-2 w-5 h-5 text-primary" />
                    Contact Person
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h3 className="font-heading font-semibold text-lg text-foreground">
                      Tejas Turakhia
                    </h3>
                    {/* <p className="text-muted-foreground">Marketing Manager</p> */}
                    <div className="flex items-center space-x-2 mt-3">
                      <Phone className="w-4 h-4 text-primary" />
                      <a href="tel:918460740387" className="text-primary hover:underline">
                        +91 8460740387
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Business Hours */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="mr-2 w-5 h-5 text-primary" />
                    Business Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monday - Friday:</span>
                      <span className="text-foreground">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Saturday:</span>
                      <span className="text-foreground">9:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sunday:</span>
                      <span className="text-foreground">Closed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
