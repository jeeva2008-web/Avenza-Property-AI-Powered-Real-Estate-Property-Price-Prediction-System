import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { HousesPage } from './pages/HousesPage';
import { LandPage } from './pages/LandPage';
import { PredictionPage } from './pages/PredictionPage';
import { LocationsPage } from './pages/LocationsPage';
import { AboutPage } from './pages/AboutPage';
import { UserDashboardPage } from './pages/UserDashboardPage';
import { HostDashboardPage } from './pages/HostDashboardPage';
import { PropertyDetailsModal } from './components/PropertyDetailsModal';
import { AuthModal } from './components/AuthModal';
import { BookingModal } from './components/BookingModal';
import { VisitModal } from './components/VisitModal';
import { ContactModal } from './components/ContactModal';
import { Property } from './types';
import { api } from './services/api';

function MainLayout() {
  const { user, isAuthModalOpen, authModalMode, closeAuthModal, openAuthModal } = useAuth();
  
  // Navigation State
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [pageFilters, setPageFilters] = useState<any>(null);

  // Modal States
  const [detailsProperty, setDetailsProperty] = useState<Property | null>(null);
  const [visitingProperty, setVisitingProperty] = useState<Property | null>(null);
  const [bookingProperty, setBookingProperty] = useState<Property | null>(null);
  const [contactingProperty, setContactingProperty] = useState<Property | null>(null);

  // Wishlist State
  const [savedIds, setSavedIds] = useState<string[]>([]);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Load user saved properties on login
  useEffect(() => {
    async function loadSaved() {
      if (user) {
        try {
          const props = await api.getSavedProperties();
          setSavedIds(props.map(p => p.id));
        } catch (err) {
          console.error(err);
        }
      } else {
        setSavedIds([]);
      }
    }
    loadSaved();
  }, [user]);

  const handleToggleSave = async (propertyId: string) => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    try {
      if (savedIds.includes(propertyId)) {
        await api.removeSavedProperty(propertyId);
        setSavedIds(prev => prev.filter(id => id !== propertyId));
        showToast('Property removed from saved listings');
      } else {
        await api.saveProperty(propertyId);
        setSavedIds(prev => [...prev, propertyId]);
        showToast('Property saved to your wishlist');
      }
    } catch (err: any) {
      showToast(err.message || 'Action failed');
    }
  };

  const handleNavigate = (page: string, filters?: any) => {
    setCurrentPage(page);
    setPageFilters(filters || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewDetails = (property: Property) => {
    setDetailsProperty(property);
  };

  const handleRequestVisit = (property: Property) => {
    setVisitingProperty(property);
  };

  const handleContactHost = (property: Property) => {
    setContactingProperty(property);
  };

  const handleBookProperty = (property: Property) => {
    setBookingProperty(property);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-gray-900 selection:bg-emerald-800 selection:text-white font-sans antialiased">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-5 z-50 bg-emerald-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-emerald-700 text-xs font-bold animate-in fade-in slide-in-from-top-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        savedCount={savedIds.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onViewDetails={handleViewDetails}
            onRequestVisit={handleRequestVisit}
            onContactHost={handleContactHost}
            onBookProperty={handleBookProperty}
            savedIds={savedIds}
            onToggleSave={handleToggleSave}
          />
        )}

        {currentPage === 'houses' && (
          <HousesPage
            initialFilters={pageFilters}
            onViewDetails={handleViewDetails}
            onRequestVisit={handleRequestVisit}
            onContactHost={handleContactHost}
            onBookProperty={handleBookProperty}
            savedIds={savedIds}
            onToggleSave={handleToggleSave}
          />
        )}

        {currentPage === 'land' && (
          <LandPage
            initialFilters={pageFilters}
            onViewDetails={handleViewDetails}
            onRequestVisit={handleRequestVisit}
            onContactHost={handleContactHost}
            onBookProperty={handleBookProperty}
            savedIds={savedIds}
            onToggleSave={handleToggleSave}
          />
        )}

        {currentPage === 'prediction' && (
          <PredictionPage
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'locations' && (
          <LocationsPage
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage />
        )}

        {currentPage === 'user-dashboard' && (
          <UserDashboardPage
            onNavigate={handleNavigate}
            onViewDetails={handleViewDetails}
            onRequestVisit={handleRequestVisit}
            onContactHost={handleContactHost}
            onBookProperty={handleBookProperty}
            savedIds={savedIds}
            onToggleSave={handleToggleSave}
          />
        )}

        {currentPage === 'host-dashboard' && (
          <HostDashboardPage
            onNavigate={handleNavigate}
            onViewDetails={handleViewDetails}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Modals */}
      {detailsProperty && (
        <PropertyDetailsModal
          property={detailsProperty}
          onClose={() => setDetailsProperty(null)}
          onRequestVisit={(p) => { setDetailsProperty(null); handleRequestVisit(p); }}
          onContactHost={(p) => { setDetailsProperty(null); handleContactHost(p); }}
          onBookProperty={(p) => { setDetailsProperty(null); handleBookProperty(p); }}
          isSaved={savedIds.includes(detailsProperty.id)}
          onToggleSave={handleToggleSave}
        />
      )}

      {visitingProperty && (
        <VisitModal
          property={visitingProperty}
          onClose={() => setVisitingProperty(null)}
          onSuccess={() => {
            showToast('Visit request submitted! You can track this in your dashboard.');
            if (user?.accountType === 'user') {
              // optional: user feedback
            }
          }}
        />
      )}

      {bookingProperty && (
        <BookingModal
          property={bookingProperty}
          onClose={() => setBookingProperty(null)}
          onSuccess={() => {
            showToast('Property booking consultation requested! We will reach out shortly.');
          }}
        />
      )}

      {contactingProperty && (
        <ContactModal
          property={contactingProperty}
          onClose={() => setContactingProperty(null)}
          onSuccess={() => {
            showToast('Enquiry sent directly to listing host!');
          }}
        />
      )}

      {isAuthModalOpen && (
        <AuthModal />
      )}

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
