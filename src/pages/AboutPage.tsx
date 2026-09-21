import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Sparkles, 
  Users, 
  MapPin, 
  CheckCircle2, 
  Award, 
  Phone, 
  Mail, 
  Send,
  Lock
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSent(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero Section */}
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-200">
          <Award className="w-3.5 h-3.5 text-emerald-700" />
          <span>The Official Tamil Nadu Real Estate Portal</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 font-serif leading-tight">
          About AVENZA PROPERTY
        </h1>
        <p className="text-base text-gray-600 font-light leading-relaxed">
          "Premium Properties Across Tamil Nadu" — Connecting buyers, families, and commercial investors directly with verified property hosts and state-of-the-art machine learning valuations.
        </p>
      </div>

      {/* Core Mission & Philosophy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Our Purpose
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-serif">
            A Transparent, Technology-First Real Estate Standard
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            AVENZA PROPERTY was established to address fundamental inefficiencies in Tamil Nadu's real estate marketplace. Historically, prospective homeowners and plot buyers faced opaque price inflation, unverified listings, and unreliable intermediaries.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            By pairing strict host verification protocols with a rigorous machine learning valuation engine calibrated across all 38 Tamil Nadu districts, we offer an official, secure platform where buyers and hosts interact with total trust and clarity.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-forest-950 text-white space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-emerald-800 flex items-center justify-center text-amber-300 ring-1 ring-amber-400/40">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold font-serif text-white">
            AVENZA PROPERTY At A Glance
          </h3>
          <ul className="space-y-2.5 text-xs text-emerald-100">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Direct communication with verified listing hosts</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Trained Scikit-Learn price prediction engine with 98%+ accuracy</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Full Tamil Nadu coverage with localized Pollachi depth</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Supervised site visits and priority reservation scheduling</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 4 Pillars of Excellence */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 font-serif">Platform Foundations</h3>
          <p className="text-xs text-gray-500 mt-1">Built to provide unparalleled integrity and clarity at every step</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-white rounded-3xl border border-gray-200/80 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-gray-900">100% Verified Listings</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Every house and land parcel is verified for authentic title documentation, DTCP/RERA approvals, and exact road frontage dimensions.
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-gray-200/80 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>
            <h4 className="font-bold text-sm text-gray-900">AI Valuation Intelligence</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Real machine learning models calculate fair market rates using locality benchmarks, built-up space, road width, and facility proximity.
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-gray-200/80 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-gray-900">Direct Host Connectivity</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Connect directly with authorized listing owners or their verified property managers. No arbitrary middleman markups.
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-gray-200/80 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-gray-900">Deep Regional Reach</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Specialized focus on Pollachi, Coimbatore, Chennai, Madurai, Salem, and emerging tier-2 growth corridors across Tamil Nadu.
            </p>
          </div>
        </div>
      </div>

      {/* Official Contact & Inquiry Section */}
      <div className="p-8 sm:p-10 bg-white rounded-3xl border border-gray-200 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Corporate Desk
            </span>
            <h3 className="text-2xl font-bold text-gray-900 font-serif">
              Contact Avenza Property
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Have questions regarding listing your property, verifying title documentation, or scheduling VIP site visits? Our regional assistance team is available Monday through Saturday.
            </p>

            <div className="pt-2 space-y-3 text-xs text-gray-700">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Head Office: Mahalingapuram Main Road, Pollachi, Coimbatore, Tamil Nadu - 642002</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Mail className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>contact@avenzaproperty.com</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>+91 4259 234500 / +91 98422 15480</span>
              </div>
            </div>
          </div>

          <div>
            {feedbackSent ? (
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-700 mx-auto" />
                <h4 className="text-base font-bold text-gray-900">Message Received</h4>
                <p className="text-xs text-gray-600">
                  Thank you for reaching out to Avenza Property. A regional property advisor will contact you within 24 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Senthil Nathan"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Inquiry Message</label>
                  <textarea
                    rows={4}
                    required
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Tell us about the property you want to buy, list, or inspect..."
                    className="w-full p-2.5 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Inquiry to Avenza Property</span>
                </button>
              </form>
            )}
          </div>

        </div>
      </div>

    </div>
  );
};
