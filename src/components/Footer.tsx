import React from 'react';
import { Building2, Mail, Phone, MapPin, Shield, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-emerald-950 text-emerald-100 border-t border-emerald-900/60 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center text-amber-300 ring-1 ring-amber-400/40">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white font-serif">
                AVENZA <span className="text-emerald-400">PROPERTY</span>
              </span>
            </div>
            
            <p className="text-sm text-emerald-200/80 leading-relaxed max-w-sm">
              Premium Properties Across Tamil Nadu. Connecting home seekers and investors with verified residential houses, luxury villas, and prime land parcels backed by transparent location-aware valuation.
            </p>

            <div className="pt-2 space-y-2 text-xs text-emerald-300/80">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Regional Offices in Pollachi, Coimbatore & Chennai, Tamil Nadu</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>enquiries@avenzaproperty.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>+91 4259 234500 / +91 98422 15480</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-4 font-sans">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button 
                  onClick={() => onNavigate('home')} 
                  className="hover:text-white transition-colors text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('houses')} 
                  className="hover:text-white transition-colors text-left"
                >
                  Houses
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('land')} 
                  className="hover:text-white transition-colors text-left"
                >
                  Land
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('prediction')} 
                  className="hover:text-white transition-colors text-left flex items-center gap-1.5"
                >
                  <span>AI Price Prediction</span>
                  <span className="px-1.5 py-0.2 text-[10px] bg-amber-400/20 text-amber-300 rounded font-semibold border border-amber-400/30">ML</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('locations')} 
                  className="hover:text-white transition-colors text-left"
                >
                  Locations
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('about')} 
                  className="hover:text-white transition-colors text-left"
                >
                  About
                </button>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-4 font-sans">
              Support
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button 
                  onClick={() => onNavigate('about')} 
                  className="hover:text-white transition-colors text-left"
                >
                  Contact
                </button>
              </li>
              <li>
                <span className="text-emerald-300/70 hover:text-white cursor-pointer">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-emerald-300/70 hover:text-white cursor-pointer">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="text-emerald-300/70 hover:text-white cursor-pointer">
                  Host Verification Guidelines
                </span>
              </li>
              <li>
                <span className="text-emerald-300/70 hover:text-white cursor-pointer">
                  DTCP & RERA Assistance
                </span>
              </li>
            </ul>
          </div>

          {/* Trust & Guarantee */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-4 font-sans">
              Trust & Standards
            </h3>
            <div className="space-y-3 text-xs text-emerald-200/80">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>100% verified Tamil Nadu listings directly from authorized hosts</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Supervised site visits and transparent direct negotiations</span>
              </div>
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Machine learning valuation powered by Tamil Nadu real estate market data</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-emerald-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-400/80">
          <p>© 2026 Avenza Property. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Official Tamil Nadu Property Portal</span>
            <span>•</span>
            <span>English / Tamil Real Estate Network</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
