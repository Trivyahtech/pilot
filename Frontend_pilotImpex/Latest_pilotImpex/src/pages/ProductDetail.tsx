import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Beaker, Package, Clock, CheckCircle, MessageCircle } from "lucide-react";
import Navigation from "@/components/Navigation";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import caustic_soda_lye from "../assets/Pilot Impex Product Image/Caustic Soda Lye.png";
import caustic_soda_flakes from "../assets/Pilot Impex Product Image/Caustic Soda Flakes.png";
import hydrochloric_acid from "../assets/Pilot Impex Product Image/Hydrochloric Acid.png";
import dilute_sulphuric_acid from "../assets/Pilot Impex Product Image/Dilute Sulphuric Acid.png";
import sulphuric_acid from "../assets/Pilot Impex Product Image/Sulphuric Acid.png";
import phosphoric_acid from "../assets/Pilot Impex Product Image/Phosphoric Acid.png";
import caustic_potash_flakes from "../assets/Pilot Impex Product Image/Caustic Potash Flakes.png";
import caustic_potash_lye from "../assets/Pilot Impex Product Image/Caustic Potash Lye.png";
import caustic_soda_prill from "../assets/Pilot Impex Product Image/Caustic-Soda-Prills.png";
import hydrogen_peroxide from "../assets/Pilot Impex Product Image/Hydrogen Peroxide.png";
import aluminium_chloride from "../assets/Pilot Impex Product Image/Aluminium Chloride.png";
import benzyl_chloride from "../assets/Pilot Impex Product Image/Benzyl Chloride.png";
import sodium_chlorate from "../assets/Pilot Impex Product Image/Sodium Chlorate.png";
import methylene_chloride from "../assets/Pilot Impex Product Image/Methylene Chloride MDC.png";
import potassium_permanganate from "../assets/Pilot Impex Product Image/Potassium Permanganate.png";
import hydrazine_hydrate from "../assets/Pilot Impex Product Image/Hydrazine Hydrate.png";
import stable_bleaching_powder from "../assets/Pilot Impex Product Image/Stable Bleaching Powder.png";
import chloroform from "../assets/Pilot Impex Product Image/Chloroform.png";
import sodium_hypochlorite from "../assets/Pilot Impex Product Image/Sodium Hypochlorite.png";
import poly_aluminium_chloride from "../assets/Pilot Impex Product Image/Poly Aluminium Chloride.png";
import benzaldehyde from "../assets/Pilot Impex Product Image/Benzaldehyde.png";
import chlorinated_paraffin from "../assets/Pilot Impex Product Image/Chlorinated Paraffin.png";
import liquid_chlorine from "../assets/Pilot Impex Product Image/Liquid Chlorine.png";
import benzyl_alcohol from "../assets/Pilot Impex Product Image/Benzyl Alcohol.png";
import potassium_carbonate from "../assets/Pilot Impex Product Image/Potassium Carbonate.png";
import { useEffect } from "react";

// TypeScript interface for product details
interface Product {
  name: string;
  image?: string;
  category: string;
  description: string;
  specifications: { [key: string]: string };
  priceInfo: { [key: string]: string };
  paymentTerms: string[];
  certifications: string[];
  suggestedProducts: string[];
}

// Detailed product information
const productDetails: { [key: string]: Product } = {
  "caustic-soda-lye": {
    name: "Caustic Soda Lye",
    image: caustic_soda_lye,
    category: "Caustic Soda",
    description: "High concentration liquid caustic soda for textile dyes and industrial applications.",
    specifications: {
      "Type": "Textile Dyes",
      "Physical State": "Liquid",
      "Purity": "98%",
    },
    priceInfo: {
      "Minimum Order Quantity": "1-2 MT",
      "Supply Ability": "1000 Ton Per Day",
      "Delivery Time": "1 Days",
      "Sample Available": "Yes",
      "Sample Policy": "Within a certain price range free samples are available",
      "Packaging Details": "Tanker load",
    },
    paymentTerms: ["Cash on Delivery (COD)", "Cash Advance (CA)", "Letter of Credit (L/C)", "Telegraphic Transfer (T/T)"],
    certifications: ["FIRM REGISTRATION"],
    suggestedProducts: ["caustic-soda-flakes", "caustic-potash-lye"],
  },
  "caustic-soda-flakes": {
    name: "Caustic Soda Flakes",
    image: caustic_soda_flakes,
    category: "Caustic Soda",
    description: "Pure white caustic soda flakes ideal for textile dyes, soap making, and paper production.",
    specifications: {
      "CAS No": "1310-73-2",
      "Physical State": "Powder",
      "Purity": "99%",
    },
    priceInfo: {
      "Minimum Order Quantity": "1-2 Tonne",
      "Supply Ability": "1000 Tonne Per Day",
      "Delivery Time": "1 Days",
      "Sample Available": "Yes",
      "Sample Policy": "Within a certain price range free samples are available",
      "Packaging Details": "25/50 Kg HDPE Bags",
    },
    paymentTerms: [
      "Cash on Delivery (COD)",
      "Western Union",
      "Paypal",
      "Letter of Credit (L/C)",
      "Letter of Credit at Sight (Sight L/C)",
      "Cash Against Delivery (CAD)",
      "Telegraphic Transfer (T/T)",
      "Delivery Point (DP)",
      "Days after Acceptance (DA)",
      "Cash in Advance (CID)",
      "Cheque",
      "Cash Advance (CA)",
    ],
    certifications: ["FIRM REGISTRATION"],
    suggestedProducts: ["caustic-soda-lye", "caustic-potash-flakes"],
  },
  "dilute-sulphuric-acid": {
    name: "Dilute Sulphuric Acid",
    image: dilute_sulphuric_acid,
    category: "Industrial Acids",
    description: "Diluted sulphuric acid solution for laboratory, textile, dyes, and alum manufacturing applications.",
    specifications: {
      "Molecular Formula": "H2SO4",
      "Grade": "Industrial Grade",
      "Usage": "Laboratory",
    },
    priceInfo: {
      "Minimum Order Quantity": "1-2 Tonne",
      "Supply Ability": "100 Tonne Per Month",
      "Delivery Time": "1-2 Days",
      "Sample Available": "Yes",
      "Sample Policy": "Within a certain price range free samples are available",
      "Packaging Details": "Textile industry, Dyes industry, Alum Manufacturing",
    },
    paymentTerms: ["Cash on Delivery (COD)", "Cash Advance (CA)", "Letter of Credit (L/C)", "Telegraphic Transfer (T/T)"],
    certifications: ["FIRM REGISTRATION"],
    suggestedProducts: ["hydrochloric-acid", "sulphuric-acid-98"],
  },
  "hydrochloric-acid": {
    name: "Hydrochloric Acid",
    image: hydrochloric_acid,
    category: "Industrial Acids",
    description: "High quality hydrochloric acid for industrial applications including metal cleaning and chemical synthesis.",
    specifications: {
      "Usage": "Industrial",
      "Grade": "Industrial Grade",
    },
    priceInfo: {
      "Minimum Order Quantity": "1-2 Tonne",
      "Supply Ability": "100 Tonne Per Month",
      "Delivery Time": "1-2 Days",
      "Sample Available": "Yes",
      "Sample Policy": "Within a certain price range free samples are available",
      "Packaging Details": "Drum, Barrels",
    },
    paymentTerms: [
      "Cash on Delivery (COD)",
      "Cash Advance (CA)",
      "Letter of Credit (L/C)",
      "Telegraphic Transfer (T/T)",
      "Western Union",
      "Paypal",
      "Delivery Point (DP)",
      "Letter of Credit at Sight (Sight L/C)",
      "Cash Against Delivery (CAD)",
      "Days after Acceptance (DA)",
      "Cash in Advance (CID)",
      "Cheque",
    ],
    certifications: ["FIRM REGISTRATION"],
    suggestedProducts: ["dilute-sulphuric-acid", "sulphuric-acid-98", "phosphoric-acid"],
  },
  "sulphuric-acid": {
    name: "Sulphuric Acid",
    image: sulphuric_acid,
    category: "Industrial Acids",
    description: "Concentrated sulphuric acid with 98% purity for laboratory and industrial applications.",
    specifications: {
      "Grade": "Industrial Grade",
      "Purity": "98%",
      "Usage": "Laboratory",
    },
    priceInfo: {
      "Minimum Order Quantity": "1-2 Ton",
      "Supply Ability": "100 Ton Per Month",
      "Delivery Time": "Days",
      "Sample Available": "Yes",
      "Sample Policy": "Within a certain price range free samples are available",
      "Packaging Details": "Tankers, IBCs, Drums",
    },
    paymentTerms: ["Cash on Delivery (COD)", "Cash Advance (CA)", "Letter of Credit (L/C)", "Telegraphic Transfer (T/T)"],
    certifications: ["FIRM REGISTRATION"],
    suggestedProducts: ["hydrochloric-acid", "phosphoric-acid"],
  },
  "phosphoric-acid": {
    name: "Phosphoric Acid",
    image: phosphoric_acid,
    category: "Industrial Acids",
    description: "High purity phosphoric acid for industrial applications.",
    specifications: {
      "Grade": "Industrial Grade",
      "Application": "Industrial",
    },
    priceInfo: {
      "Minimum Order Quantity": "1-2 Tonne",
      "Supply Ability": "100 Tonne Per Day",
      "Delivery Time": "1-2 Days",
      "Sample Available": "Yes",
      "Sample Policy": "Within a certain price range free samples are available",
      "Packaging Details": "30kgs/50kgs HM HDPE Carboys",
    },
    paymentTerms: ["Cash on Delivery (COD)", "Cash Advance (CA)", "Letter of Credit (L/C)", "Telegraphic Transfer (T/T)"],
    certifications: ["FIRM REGISTRATION"],
    suggestedProducts: ["hydrochloric-acid", "sulphuric-acid-98"],
  },
  "caustic-potash-flakes": {
    name: "Caustic Potash Flakes",
    image: caustic_potash_flakes,
    category: "Caustic Potash",
    description: "High purity caustic potash flakes for industrial applications.",
    specifications: {
      "Storage": "Room Temperature",
      "Purity": "88%",
      "Form": "Flakes",
      "Grade": "Industrial Grade",
      "Type": "Caustic Potash Flakes",
    },
    priceInfo: {
      "Minimum Order Quantity": "1-2 MT",
      "Supply Ability": "1000 Ton Per Day",
      "Delivery Time": "1 Days",
      "Sample Available": "Yes",
      "Sample Policy": "Within a certain price range free samples are available",
      "Packaging Details": "25/50 kg HDPE Bags",
    },
    paymentTerms: ["Cash on Delivery (COD)", "Cash Advance (CA)"],
    certifications: ["FIRM REGISTRATION"],
    suggestedProducts: ["caustic-soda-flakes", "caustic-potash-lye"],
  },
  "caustic-potash-lye": {
    name: "Caustic Potash Lye",
    image: caustic_potash_lye,
    category: "Caustic Potash",
    description: "High purity caustic potash lye for industrial applications.",
    specifications: {
      "Form": "Liquid",
      "Storage": "Room Temperature",
      "Purity": "99%",
      "Grade": "Industrial Grade",
      "Type": "Caustic Potash Lye",
    },
    priceInfo: {
      "Minimum Order Quantity": "1-2 Ton",
      "Supply Ability": "1000 Ton Per Day",
      "Delivery Time": "1 Days",
      "Sample Available": "Yes",
      "Sample Policy": "Within a certain price range free samples are available",
      "Packaging Details": "Tanker load",
    },
    paymentTerms: ["Cash on Delivery (COD)", "Cash Advance (CA)"],
    certifications: ["FIRM REGISTRATION"],
    suggestedProducts: ["caustic-potash-flakes", "caustic-soda-lye"],
  },
  "caustic-soda-prills": {
    name: "Caustic Soda Prills",
    image: caustic_soda_prill,
    category: "Caustic Soda",
    description: "High purity caustic soda prills for industrial applications.",
    specifications: {
      "Form": "Granule",
      "Storage": "Room Temperature",
      "Purity": "99%",
      "Grade": "Industrial Grade",
      "Type": "Caustic Soda Prills",
    },
    priceInfo: {
      "Minimum Order Quantity": "1-2 MT",
      "Supply Ability": "1000 Ton Per Day",
      "Delivery Time": "1 Days",
      "Sample Available": "Yes",
      "Sample Policy": "Within a certain price range free samples are available",
      "Packaging Details": "FIRM REGISTRATION",
    },
    paymentTerms: ["Cash on Delivery (COD)", "Cash Advance (CA)"],
    certifications: ["FIRM REGISTRATION"],
    suggestedProducts: ["caustic-soda-flakes", "caustic-soda-lye"],
  },
  "hydrogen-peroxide": {
    name: "Hydrogen Peroxide",
    image: hydrogen_peroxide,
    category: "Hydrogen Peroxide",
    description: "Stabilized hydrogen peroxide for paper, textile, sugar, coir, tobacco industries, and as an oxidizing and antiseptic agent.",
    specifications: {
      "Storage": "Room Temperature",
      "Form": "Liquid",
      "CAS No": "7722-84-1",
      "Grade": "Industrial Grade",
      "Type": "Hydrogen Peroxide",
      "Usage": "Paper, Textile, Sugar, Coir & Tobacco industries. Oxidizing agent for silver ornaments, Antiseptic agent in Pharmaceuticals",
    },
    priceInfo: {
      "Minimum Order Quantity": "1-2 MT",
      "Supply Ability": "1000 Tonne Per Day",
      "Delivery Time": "10 Days",
      "Sample Available": "Yes",
      "Sample Policy": "Within a certain price range free samples are available",
      "Packaging Details": "Carboys, Barrels, Tankers",
    },
    paymentTerms: ["Cash on Delivery (COD)", "Cash Advance (CA)"],
    certifications: ["FIRM REGISTRATION"],
    suggestedProducts: ["sodium-hypochlorite", "stable-bleaching-powder"],
  },
  "aluminium-chloride": {
    name: "Aluminium Chloride",
    image: aluminium_chloride,
    category: "Chlorination Chemical",
    description: "High purity aluminium chloride for industrial applications.",
    specifications: {
      "Storage": "Room Temperature",
      "Form": "Powder",
      "Grade": "Industrial Grade",
      "Type": "Aluminium Chloride",
    },
    priceInfo: {
      "Minimum Order Quantity": "1-2 MT",
      "Supply Ability": "1000 Tonne Per Day",
      "Delivery Time": "1 Days",
      "Sample Available": "Yes",
      "Sample Policy": "Within a certain price range free samples are available",
      "Packaging Details": "25 kg HDPE bag packing, 1000 kg PVC Jumbo bag",
    },
    paymentTerms: [
      "Cash on Delivery (COD)",
      "Letter of Credit (L/C)",
      "Paypal",
      "Western Union",
      "Letter of Credit at Sight (Sight L/C)",
      "Cash Against Delivery (CAD)",
      "Telegraphic Transfer (T/T)",
      "Delivery Point (DP)",
      "Days after Acceptance (DA)",
      "Cash in Advance (CID)",
      "Cheque",
      "Cash Advance (CA)",
    ],
    certifications: ["FIRM REGISTRATION"],
    suggestedProducts: ["poly-aluminium-chloride", "benzyl-chloride"],
  },
  "benzyl-chloride": {
    name: "Benzyl Chloride",
    image: benzyl_chloride,
    category: "Chlorination Chemical",
    description: "High purity benzyl chloride for industrial applications.",
    specifications: {
      "Purity": "99%",
      "Form": "Liquid",
      "Storage": "Room Temperature",
      "Grade": "Industrial Grade",
      "Type": "Benzyl Chloride",
    },
    priceInfo: {
      "Minimum Order Quantity": "1-2 Tonne",
      "Supply Ability": "1000 Tonne Per Day",
      "Delivery Time": "1 Days",
      "Sample Available": "Yes",
      "Sample Policy": "Within a certain price range free samples are available",
      "Packaging Details": "HDPE Barrels, Drum",
    },
    paymentTerms: [
      "Cash on Delivery (COD)",
      "Cash Advance (CA)",
      "Letter of Credit (L/C)",
      "Telegraphic Transfer (T/T)",
      "Western Union",
      "Paypal",
      "Delivery Point (DP)",
      "Letter of Credit at Sight (Sight L/C)",
      "Cash Against Delivery (CAD)",
      "Days after Acceptance (DA)",
      "Cash in Advance (CID)",
      "Cheque",
    ],
    certifications: ["FIRM REGISTRATION"],
    suggestedProducts: ["benzyl-alcohol", "benzaldehyde-99-5"],
  },
  "sodium-chlorate": {
    name: "Sodium Chlorate",
    image: sodium_chlorate,
    category: "Sodium Chlorate",
    description: "High purity sodium chlorate for pharmaceutical and acetylene gas applications.",
    specifications: {
      "Storage": "Room Temperature",
      "Structural Formula": "NaClO3",
      "Application": "Pharmaceutical, Acetylene Gas",
      "Color": "White",
    },
    priceInfo: {
      "Minimum Order Quantity": "1-2 Tonne",
      "Supply Ability": "100 Tonne Per Day",
      "Delivery Time": "1-2 Days",
      "Sample Available": "Yes",
      "Sample Policy": "Within a certain price range free samples are available",
      "Packaging Details": "25/50/500/1000 kgs Bags",
    },
    paymentTerms: ["Cash on Delivery (COD)", "Cash Advance (CA)", "Letter of Credit (L/C)", "Telegraphic Transfer (T/T)"],
    certifications: ["FIRM REGISTRATION"],
    suggestedProducts: ["potassium-permanganate", "sodium-hypochlorite"],
  },
  "methylene-chloride-mdc": {
    name: "Methylene Chloride MDC",
    image: methylene_chloride,
    category: "Methylene Chloride MDC",
    description: "High purity methylene chloride for industrial applications.",
    specifications: {
      "Chemical Name": "Methylene Chloride",
      "Physical State": "Liquid",
      "Usage": "Industrial",
      "Purity": ">99%",
    },
    priceInfo: {
      "Minimum Order Quantity": "1 Metric Ton",
      "Supply Ability": "1000 Tonne Per Day",
      "Delivery Time": "1 Days",
      "Sample Available": "Yes",
      "Sample Policy": "Within a certain price range free samples are available",
      "Packaging Details": "Drum, Barrels",
    },
    paymentTerms: ["Cash on Delivery (COD)", "Cash Advance (CA)", "Letter of Credit (L/C)", "Telegraphic Transfer (T/T)"],
    certifications: ["FIRM REGISTRATION"],
    suggestedProducts: ["chloroform-99-9", "benzyl-chloride"],
  },
  "potassium-permanganate": {
    name: "Potassium Permanganate",
    image: potassium_permanganate,
    category: "Potassium Permanganate",
    description: "High purity potassium permanganate for technical applications.",
    specifications: {
      "Physical Form": "Liquid",
      "Storage": "Room Temperature",
      "Grade": "Technical Grade",
      "Product Type": "Potassium Permanganate",
    },
    priceInfo: {
      "Price": "130 INR/Ton",
      "Minimum Order Quantity": "1-2 MT",
      "Supply Ability": "1000 Tonne Per Day",
      "Delivery Time": "1 Days",
      "Sample Available": "Yes",
      "Sample Policy": "Within a certain price range free samples are available",
      "Packaging Details": "Drum, Barrels",
    },
    paymentTerms: ["Cash on Delivery (COD)", "Cash Advance (CA)", "Letter of Credit (L/C)", "Telegraphic Transfer (T/T)"],
    certifications: ["FIRM REGISTRATION"],
    suggestedProducts: ["sodium-hypochlorite", "hydrogen-peroxide"],
  },
  "hydrazine-hydrate": {
    name: "Hydrazine Hydrate",
    image: hydrazine_hydrate,
    category: "Hydrazine Hydrate",
    description: "High purity hydrazine hydrate used as a reducing agent, oxygen scavenger, and for pharmaceutical and agricultural applications.",
    specifications: {
      "CAS No": "110-82-7",
      "Physical Form": "Liquid",
      "Grade": "Industrial Grade",
      "Product Type": "Chemical",
      "Storage": "Room Temperature",
      "Usage": "Used as a reducing agent, oxygen scavenger in treatment of boiler water, and as a source for drug - hydralazine is an anti-tubercular drug, as well as for agricultural chemicals, and other hydrazine derivatives",
    },
    priceInfo: {
      "Minimum Order Quantity": "1-2 MT",
      "Supply Ability": "1000 Tonne Per Day",
      "Delivery Time": "1 Days",
      "Sample Available": "Yes",
      "Sample Policy": "Within a certain price range free samples are available",
      "Packaging Details": "Drum and Barrel",
    },
    paymentTerms: ["Cash on Delivery (COD)", "Cash Advance (CA)", "Letter of Credit (L/C)", "Telegraphic Transfer (T/T)"],
    certifications: ["FIRM REGISTRATION"],
    suggestedProducts: ["sodium-hypochlorite", "hydrogen-peroxide"],
  },
  "stable-bleaching-powder": {
    name: "Stable Bleaching Powder",
    image: stable_bleaching_powder,
    category: "Stable Bleaching Powder",
    description: "High purity stable bleaching powder for industrial applications.",
    specifications: {
      "Physical Form": "Powder",
      "Grade": "Industrial Grade",
      "Type": "Bleaching Powder",
    },
    priceInfo: {
      "Minimum Order Quantity": "1-2 MT",
      "Supply Ability": "1000 Tonne Per Day",
      "Delivery Time": "1 Days",
      "Sample Available": "Yes",
      "Sample Policy": "Within a certain price range free samples are available",
      "Packaging Details": "25 Kg, 50 Kg",
    },
    paymentTerms: ["Cash on Delivery (COD)", "Cash Advance (CA)", "Letter of Credit (L/C)", "Telegraphic Transfer (T/T)"],
    certifications: ["FIRM REGISTRATION"],
    suggestedProducts: ["hydrogen-peroxide", "sodium-hypochlorite"],
  },
  "chloroform": {
    name: "Chloroform",
    image: chloroform,
    category: "Chloroform",
    description: "High purity chloroform for fire fighting, soil fumigants, mildew preventives, and pharmaceutical applications.",
    specifications: {
      "Usage": "Fire fighting agent, Soil fumigants, mildew preventives, Pharmaceutical preparations",
      "Product Type": "Chemical",
      "Physical Form": "Liquid",
      "CAS No": "67-66-3",
      "Storage": "Room Temperature",
    },
    priceInfo: {
      "Minimum Order Quantity": "1-2 MT",
      "Supply Ability": "1000 Tonne Per Day",
      "Delivery Time": "1 Days",
      "Sample Available": "Yes",
      "Sample Policy": "Within a certain price range free samples are available",
      "Packaging Details": "250/280 HDPE Barrels",
    },
    paymentTerms: ["Cash on Delivery (COD)", "Cash Advance (CA)", "Letter of Credit (L/C)", "Telegraphic Transfer (T/T)"],
    certifications: ["FIRM REGISTRATION"],
    suggestedProducts: ["methylene-chloride-mdc", "benzyl-chloride"],
  },
  "sodium-hypochlorite": {
    name: "Sodium Hypochlorite",
    image: sodium_hypochlorite,
    category: "Sodium Hypochlorite",
    description: "High purity sodium hypochlorite for sanitization and industrial applications.",
    specifications: {
      "Physical State": "Liquid",
      "Purity": "99%",
    },
    priceInfo: {
      "Minimum Order Quantity": "1-2 MT",
      "Supply Ability": "100 Kilograms Per Day",
      "Delivery Time": "1-2 Days",
      "Sample Available": "Yes",
      "Sample Policy": "Within a certain price range free samples are available",
      "Packaging Details": "FIRM REGISTRATION",
    },
    paymentTerms: ["Cash on Delivery (COD)", "Cash Advance (CA)", "Letter of Credit (L/C)", "Telegraphic Transfer (T/T)"],
    certifications: ["FIRM REGISTRATION"],
    suggestedProducts: ["hydrogen-peroxide", "stable-bleaching-powder"],
  },
  "poly-aluminium-chloride": {
    name: "Poly Aluminium Chloride",
    image: poly_aluminium_chloride,
    category: "Poly Aluminium Chloride",
    description: "High purity poly aluminium chloride for water and wastewater treatment.",
    specifications: {
      "Physical Form": "Powder",
      "Grade": "Industrial Grade",
      "Type": "Poly Aluminium Chloride",
    },
    priceInfo: {
      "Minimum Order Quantity": "1-2 MT",
      "Supply Ability": "1000 Tonne Per Day",
      "Delivery Time": "1 Days",
      "Sample Available": "Yes",
      "Sample Policy": "Within a certain price range free samples are available",
      "Packaging Details": "25 Kg Bag/50 Kg Bag/JUMBO Packing",
    },
    paymentTerms: [
      "Cash Against Delivery (CAD)",
      "Cash on Delivery (COD)",
      "Letter of Credit (L/C)",
      "Paypal",
      "Delivery Point (DP)",
      "Western Union",
      "Letter of Credit at Sight (Sight L/C)",
      "Telegraphic Transfer (T/T)",
      "Days after Acceptance (DA)",
      "Cash in Advance (CID)",
      "Cheque",
      "Cash Advance (CA)",
    ],
    certifications: ["FIRM REGISTRATION"],
    suggestedProducts: ["aluminium-chloride", "benzyl-chloride"],
  },
  "benzaldehyde": {
    name: "Benzaldehyde",
    image: benzaldehyde,
    category: "Benzaldehyde",
    description: "High purity benzaldehyde for flavor and pharmaceutical industries.",
    specifications: {
      "Type": "Benzaldehyde",
      "Purity": "99.5%",
      "Grade": "Industrial Grade",
    },
    priceInfo: {
      "Price": "100000-128000 INR/Tonne",
      "Minimum Order Quantity": "1-2 MT",
      "Supply Ability": "1000 Tonne Per Day",
      "Delivery Time": "1 Days",
      "Sample Available": "Yes",
      "Sample Policy": "Within a certain price range free samples are available",
      "Packaging Details": "220 kg HDPE Barrels",
    },
    paymentTerms: [
      "Cash Against Delivery (CAD)",
      "Cash on Delivery (COD)",
      "Delivery Point (DP)",
      "Letter of Credit (L/C)",
      "Letter of Credit at Sight (Sight L/C)",
      "Telegraphic Transfer (T/T)",
      "Western Union",
      "Paypal",
      "Days after Acceptance (DA)",
      "Cash in Advance (CID)",
      "Cheque",
      "Cash Advance (CA)",
    ],
    certifications: ["FIRM REGISTRATION"],
    suggestedProducts: ["benzyl-alcohol", "benzyl-chloride"],
  },
  "chlorinated-paraffin": {
    name: "Chlorinated Paraffin",
    image: chlorinated_paraffin,
    category: "Chlorinated Paraffin",
    description: "Chlorinated paraffin used as a flame retardant and secondary plasticizer in rubber, paints, adhesives, caulks, sealants, and plastics.",
    specifications: {
      "Physical Form": "Liquid",
      "CAS No": "63449-39-8",
      "Usage": "Excellent heat stability, Excellent flame retardant properties, Used as a flame retardant and secondary plasticizer in rubber, paints, adhesives, caulks, sealants, and plastics",
      "Storage": "Room Temperature",
      "Product Type": "Chemical",
    },
    priceInfo: {
      "Minimum Order Quantity": "1-2 MT",
      "Supply Ability": "1000 Tonne Per Day",
      "Delivery Time": "1 Days",
      "Sample Available": "Yes",
      "Sample Policy": "Within a certain price range free samples are available",
      "Packaging Details": "Drum, Barrels",
    },
    paymentTerms: ["Cash on Delivery (COD)", "Cash Advance (CA)", "Letter of Credit (L/C)", "Telegraphic Transfer (T/T)"],
    certifications: ["FIRM REGISTRATION"],
    suggestedProducts: ["benzyl-chloride", "methylene-chloride-mdc"],
  },
  "liquid-chlorine": {
    name: "Liquid Chlorine",
    image: liquid_chlorine,
    category: "Liquid Chlorine",
    description: "High purity liquid chlorine for synthetic rubber, chlorinated hydrocarbons, sanitizing, and water purification.",
    specifications: {
      "Usage": "Synthetic rubber, Chlorinated Hydrocarbons, Sanitizing agent, Water Purification",
      "Storage": "Room Temperature",
      "CAS No": "7782-50-5",
      "Physical Form": "Liquid",
      "Product Type": "Chemical",
    },
    priceInfo: {
      "Minimum Order Quantity": "1-2 MT",
      "Supply Ability": "1000 Tonne Per Day",
      "Delivery Time": "1 Days",
      "Sample Available": "Yes",
      "Sample Policy": "Within a certain price range free samples are available",
      "Packaging Details": "900 kg tonner, 100 kg cylinder",
    },
    paymentTerms: ["Cash on Delivery (COD)", "Cash Advance (CA)", "Letter of Credit (L/C)", "Telegraphic Transfer (T/T)"],
    certifications: ["FIRM REGISTRATION"],
    suggestedProducts: ["sodium-hypochlorite", "stable-bleaching-powder"],
  },
  "benzyl-alcohol": {
    name: "Benzyl Alcohol",
    image: benzyl_alcohol,
    category: "Benzyl Alcohol",
    description: "High purity benzyl alcohol for industrial applications as a solvent and preservative.",
    specifications: {
      "Grade": "Industrial Grade",
      "Type": "Benzyl Alcohol",
    },
    priceInfo: {
      "Minimum Order Quantity": "1-2 MT",
      "Supply Ability": "1000 Tonne Per Day",
      "Delivery Time": "1 Days",
      "Sample Available": "Yes",
      "Sample Policy": "Within a certain price range free samples are available",
      "Packaging Details": "HDPE Barrels and Drum",
    },
    paymentTerms: [
      "Cash on Delivery (COD)",
      "Days after Acceptance (DA)",
      "Delivery Point (DP)",
      "Letter of Credit (L/C)",
      "Letter of Credit at Sight (Sight L/C)",
      "Telegraphic Transfer (T/T)",
      "Paypal",
      "Cash Against Delivery (CAD)",
      "Western Union",
      "Cash in Advance (CID)",
      "Cheque",
      "Cash Advance (CA)",
    ],
    certifications: ["FIRM REGISTRATION"],
    suggestedProducts: ["benzyl-chloride", "benzaldehyde-99-5"],
  },
  "potassium-carbonate": {
    name: "Potassium Carbonate",
    image: potassium_carbonate,
    category: "Potassium Carbonate",
    description: "High purity potassium carbonate for glass and soap production.",
    specifications: {
      "Storage": "Room Temperature",
      "Color": "White",
    },
    priceInfo: {
      "Minimum Order Quantity": "1-2 MT",
      "Supply Ability": "1000 Ton Per Day",
      "Delivery Time": "1 Days",
      "Sample Available": "Yes",
      "Sample Policy": "Within a certain price range free samples are available",
      "Packaging Details": "25/50 kg HDPE woven bags",
    },
    paymentTerms: ["Cash on Delivery (COD)", "Cash Advance (CA)", "Letter of Credit (L/C)", "Telegraphic Transfer (T/T)"],
    certifications: ["FIRM REGISTRATION"],
    suggestedProducts: ["caustic-potash-flakes", "caustic-potash-lye"],
  },
};

// Default product template for products not in detailed list
const getDefaultProduct = (slug: string): Product => ({
  name: slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" "),
  category: "Chemical Products",
  description:
    "High quality chemical product for various industrial applications. Contact us for detailed specifications and pricing information.",
  specifications: {
    Usage: "Industrial",
    Grade: "Technical Grade",
    Purity: "As per industry standards",
  },
  priceInfo: {
    "Minimum Order Quantity": "As per requirement",
    "Supply Ability": "As per demand",
    "Delivery Time": "1-3 Days",
    "Sample Available": "Yes",
    Packaging: "Standard industrial packaging",
  },
  paymentTerms: ["Cash on Delivery (COD)", "Cash Advance (CA)", "Letter of Credit (L/C)"],
  certifications: ["FIRM REGISTRATION"],
  suggestedProducts: ["hydrochloric-acid", "caustic-soda-flakes", "hydrogen-peroxide"],
});

// All products from navigation
const allProducts = [
  // Caustic Soda
  { name: "Caustic Soda Lye", description: "High concentration liquid caustic soda for textile dyes and industrial applications.", slug: "caustic-soda-lye", category: "Caustic Soda", image: caustic_soda_lye },
  { name: "Caustic Soda Flakes", description: "Pure white caustic soda flakes ideal for textile dyes, soap making, and paper production.", slug: "caustic-soda-flakes", category: "Caustic Soda", image: caustic_soda_flakes },
  { name: "Caustic Soda Prills", description: "High purity caustic soda prills for industrial applications.", slug: "caustic-soda-prills", category: "Caustic Soda", image: caustic_soda_prill },
  // Industrial Acids
  { name: "Dilute Sulphuric Acid", description: "Diluted sulphuric acid solution for laboratory, textile, dyes, and alum manufacturing applications.", slug: "dilute-sulphuric-acid", category: "Industrial Acids", image: dilute_sulphuric_acid },
  { name: "Hydrochloric Acid", description: "High quality hydrochloric acid for industrial applications including metal cleaning and chemical synthesis.", slug: "hydrochloric-acid", category: "Industrial Acids", image: hydrochloric_acid },
  { name: "Sulphuric Acid", description: "Concentrated sulphuric acid with 98% purity for industrial applications.", slug: "sulphuric-acid", category: "Industrial Acids", image: sulphuric_acid },
  { name: "Phosphoric Acid", description: "High purity phosphoric acid for industrial applications.", slug: "phosphoric-acid", category: "Industrial Acids", image: phosphoric_acid },
  // Caustic Potash
  { name: "Caustic Potash Flakes", description: "High purity caustic potash flakes for industrial applications.", slug: "caustic-potash-flakes", category: "Caustic Potash", image: caustic_potash_flakes },
  { name: "Caustic Potash Lye", description: "High purity caustic potash lye for industrial applications.", slug: "caustic-potash-lye", category: "Caustic Potash", image: caustic_potash_lye },
  // Hydrogen Peroxide
  { name: "Hydrogen Peroxide", description: "Stabilized hydrogen peroxide for paper, textile, sugar, coir, tobacco industries, and as an oxidizing and antiseptic agent.", slug: "hydrogen-peroxide", category: "Hydrogen Peroxide", image: hydrogen_peroxide },
  // Chlorination Chemical
  { name: "Aluminium Chloride", description: "High purity aluminium chloride for industrial applications.", slug: "aluminium-chloride", category: "Chlorination Chemical", image: aluminium_chloride },
  { name: "Benzyl Chloride", description: "High purity benzyl chloride for industrial applications.", slug: "benzyl-chloride", category: "Chlorination Chemical", image: benzyl_chloride },
  // Sodium Chlorate
  { name: "Sodium Chlorate", description: "High purity sodium chlorate for pharmaceutical and acetylene gas applications.", slug: "sodium-chlorate", category: "Sodium Chlorate", image: sodium_chlorate },
  // Methylene Chloride MDC
  { name: "Methylene Chloride MDC", description: "High purity methylene chloride for industrial applications.", slug: "methylene-chloride-mdc", category: "Methylene Chloride MDC", image: methylene_chloride },
  // Potassium Permanganate
  { name: "Potassium Permanganate", description: "High purity potassium permanganate for technical applications.", slug: "potassium-permanganate", category: "Potassium Permanganate", image: potassium_permanganate },
  // Hydrazine Hydrate
  { name: "Hydrazine Hydrate", description: "High purity hydrazine hydrate for pharmaceutical and agricultural applications.", slug: "hydrazine-hydrate", category: "Hydrazine Hydrate", image: hydrazine_hydrate },
  // Stable Bleaching Powder
  { name: "Stable Bleaching Powder", description: "High purity stable bleaching powder for industrial applications.", slug: "stable-bleaching-powder", category: "Stable Bleaching Powder", image: stable_bleaching_powder },
  // Chloroform
  { name: "Chloroform", description: "High purity chloroform for laboratory and industrial applications.", slug: "chloroform", category: "Chloroform", image: chloroform },
  // Sodium Hypochlorite
  { name: "Sodium Hypochlorite", description: "High purity sodium hypochlorite for sanitization and industrial applications.", slug: "sodium-hypochlorite", category: "Sodium Hypochlorite", image: sodium_hypochlorite },
  // Poly Aluminium Chloride
  { name: "Poly Aluminium Chloride", description: "High purity poly aluminium chloride for water and wastewater treatment.", slug: "poly-aluminium-chloride", category: "Poly Aluminium Chloride", image: poly_aluminium_chloride },
  // Benzaldehyde
  { name: "Benzaldehyde", description: "High purity benzaldehyde for flavoring and pharmaceutical applications.", slug: "benzaldehyde", category: "Benzaldehyde", image: benzaldehyde },
  // Chlorinated Paraffin
  { name: "Chlorinated Paraffin", description: "Chlorinated paraffin used as a flame retardant and secondary plasticizer.", slug: "chlorinated-paraffin", category: "Chlorinated Paraffin", image: chlorinated_paraffin },
  // Liquid Chlorine
  { name: "Liquid Chlorine", description: "High purity liquid chlorine for synthetic rubber, chlorinated hydrocarbons, sanitizing, and water purification.", slug: "liquid-chlorine", category: "Liquid Chlorine", image: liquid_chlorine },
  // Benzyl Alcohol
  { name: "Benzyl Alcohol", description: "High purity benzyl alcohol for industrial applications as a solvent and preservative.", slug: "benzyl-alcohol", category: "Benzyl Alcohol", image: benzyl_alcohol },
  // Potassium Carbonate
  { name: "Potassium Carbonate", description: "High purity potassium carbonate for glass and soap production.", slug: "potassium-carbonate", category: "Potassium Carbonate", image: potassium_carbonate },
];

export default function ProductDetail() {
  useEffect(() => {
    document.title = product.name + " | Pilot Impex";
  }, []);

  const { slug } = useParams<{ slug: string }>();

  if (!slug) {
    return <div>Product not found</div>;
  }

  const product = productDetails[slug] || getDefaultProduct(slug);
  const suggestedProducts = allProducts.filter((p) => product.suggestedProducts.includes(p.slug));

  const scrollToInquiry = () => {
    window.location.href = `/contact?product=${encodeURIComponent(product.name)}`;
  };

  const handleWhatsAppClick = () => {
    const productName = product.name; // Keep the original product name with spaces
    const message = `Hello, I'm interested in ${productName}. Could you please provide more information?`;
    const phoneNumber = '918140444873'; // Updated WhatsApp number
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="pt-24">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
            <span>/</span>
            <Link to="/products" className="hover:text-primary">
              Products
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>
        </div>

        {/* Product Header */}
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Product Image */}
              <div className="lg:w-1/2">
                <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain rounded-lg"
                    />
                  ) : (
                    <Beaker className="w-24 h-24 text-primary/60" />
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="lg:w-1/2 space-y-6">
                <div>
                  <Badge variant="secondary" className="mb-2">
                    {product.category}
                  </Badge>
                  <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
                    {product.name}
                  </h1>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" onClick={scrollToInquiry} className="flex-1">
                      Send Inquiry
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                    <Button 
                      onClick={handleWhatsAppClick}
                      size="lg"
                      className="flex-1 bg-[#25D366] hover:bg-[#128C7E] text-white font-medium shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      WhatsApp Inquiry
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="border-2 border-border hover:border-foreground/40 transition-colors"
                      asChild
                    >
                      <Link to="/products" className="flex items-center">
                        <ArrowLeft className="mr-2 w-5 h-5" />
                        Back to Products
                      </Link>
                    </Button>
                  </div>
                  
                  {/* Price & Quantity Table */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <Clock className="mr-2 w-5 h-5 text-primary" />
                        Price & Quantity
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {Object.entries(product.priceInfo).map(([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between py-2 border-b border-border/50 last:border-0"
                          >
                            <span className="font-medium text-muted-foreground">{key}:</span>
                            <span className="text-foreground text-right">{value}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Details */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Specifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="mr-2 w-5 h-5 text-primary" />
                    Specifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between py-2 border-b border-border/50 last:border-0"
                      >
                        <span className="font-medium text-muted-foreground">{key}:</span>
                        <span className="text-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>


              {/* Payment Terms */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Terms</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {product.paymentTerms.map((term) => (
                      <Badge key={term} variant="outline">
                        {term}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Certifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="mr-2 w-5 h-5 text-primary" />
                    Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {product.certifications.map((cert) => (
                      <Badge key={cert} variant="secondary">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Suggested Products */}
        {suggestedProducts.length > 0 && (
          <section className="py-12 bg-muted/30">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-8 text-center">
                Related Products
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {suggestedProducts.map((suggestedProduct, index) => (
                  <div
                    key={suggestedProduct.slug}
                    className="stagger-fade"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <ProductCard {...suggestedProduct} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-4">
                Interested in {product.name}?
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Get in touch with our team for detailed specifications, pricing, and custom requirements.
              </p>
              <Button size="lg" onClick={scrollToInquiry} className="px-8 py-4">
                Send Inquiry Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}