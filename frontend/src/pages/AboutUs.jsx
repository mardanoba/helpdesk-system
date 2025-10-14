
import React from 'react';
import LogoutButton from '../components/LogoutButton';


export default function AboutUs() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#dff6ff] to-[#b8e0ff] font-poppins text-gray-800 px-4 py-10 flex items-center justify-center">
      {/* Top-left Language Switcher */}
      <div className="absolute top-4 left-6 z-10">

      </div>

      {/* Top-right Logout Button */}
      <div className="absolute top-4 right-6 z-10">
        <LogoutButton />
      </div>

      {/* About Card */}
      <div className="relative z-10 w-full max-w-4xl bg-white/40 backdrop-blur-md rounded-xl shadow-xl p-8 md:p-12 space-y-6">
        <header className="text-center">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-2">About Us</h1>
          <p className="text-blue-700 font-medium">
            Learn more about our Help Desk System and how we serve BahirDar ICT Incubation Center.
          </p>
        </header>

        <main className="space-y-8 text-blue-900 leading-relaxed text-[15px] md:text-base">
          {/* Intro Section */}
          <section className="space-y-4">
            <p>
              Welcome to the <strong>BahirDar ICT Help Desk Ticketing System</strong> — your centralized platform for efficient IT support and service management.
            </p>
            <p>
              This system is designed to streamline the way users report issues, technicians resolve them, and administrators oversee support operations. Built with a focus on transparency, accountability, and ITIL best practices, our goal is to deliver faster response times, better service quality, and clear communication throughout the support process.
            </p>
          </section>

          {/* Offerings Section */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-blue-800">What We Offer</h2>
            <ul className="list-disc list-inside space-y-2 text-blue-800">
              <li>
                <strong>User-Friendly Interface:</strong> Easily submit support tickets and track their progress.
              </li>
              <li>
                <strong>Role-Based Access:</strong> Users, technicians, and administrators each have their own dedicated dashboards.
              </li>
              <li>
                <strong>Efficient Ticket Management:</strong> Automatic technician assignment, status tracking, and historical logs.
              </li>
              <li>
                <strong>Reports & Analytics:</strong> Real-time insights into ticket volumes, resolution times, and performance.
              </li>
              <li>
                <strong>Secure & Scalable:</strong> Built with modern technologies using React, Node.js, and MySQL for reliability and performance.
              </li>
            </ul>
          </section>

          {/* Mission Section */}
          <section className="space-y-4">
            <p>
              Our mission is to support the <strong>BahirDar ICT Incubation Center</strong> by ensuring that all technical issues are addressed swiftly and effectively. Whether you're facing a minor glitch or a major disruption, our system ensures your concern is documented, tracked, and resolved with precision.
            </p>
            <p>
              Contact us anytime via <strong>Facebook</strong>, <strong>Telegram</strong>, or email for assistance or inquiries.
            </p>
            <p className="font-semibold text-blue-700">
              Thank you for trusting us to support your ICT needs!
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
