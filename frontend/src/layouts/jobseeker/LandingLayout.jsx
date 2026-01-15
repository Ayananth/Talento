import React, { useEffect } from 'react';
import { Navbar } from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { Outlet, useLocation } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from 'framer-motion';

const LandingLayout = () => {
  const location = useLocation();
  const hideFooter = location.pathname.startsWith("/messages");

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <Toaster position="top-right" />

      <main
  className="flex-1 w-full min-h-0 overflow-hidden"
  style={{ paddingTop: "72px" }}
>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            className="h-full min-h-0 flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {!hideFooter && <Footer />}
    </div>
  );
};

export default LandingLayout;
