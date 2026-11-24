import React from 'react';
import HeroSection from '../components/home/HeroSection';
import ServicesSection from '../components/home/ServicesSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import CooperativeEcosystemSection from '../components/home/CooperativeEcosystemSection';
import TrustVerificationSection from '../components/home/TrustVerificationSection';
import JoinCTASection from '../components/home/JoinCTASection';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. 3D Hero Section */}
      <HeroSection />

      {/* 2. Services Section */}
      <ServicesSection />

      {/* 3. How It Works Section */}
      <HowItWorksSection />

      {/* 4. Cooperative Ecosystem Section */}
      <CooperativeEcosystemSection />

      {/* 5. Trust and Verification Section */}
      <TrustVerificationSection />

      {/* 6. Join SahkarSathi CTA Section */}
      <JoinCTASection />
    </div>
  );
}
