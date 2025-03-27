"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useEffect, useState } from "react";

import { About } from "./components/About";
import { Cta } from "./components/Cta";
import { FAQ } from "./components/FAQ";
import { Features } from "./components/Features";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { Newsletter } from "./components/Newsletter";
import { Pricing } from "./components/Pricing";
import { ScrollToTop } from "./components/ScrollToTop";
import { Services } from "./components/Services";
import { Sponsors } from "./components/Sponsors";
import { Testimonials } from "./components/Testimonials";

export default function Home() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  console.log(user);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      console.log(user);
    };

    getUser();
  }, []);

  return (
    <div className="font-medium">
      <Button variant="outline" className="p-0 fixed right-16 top-6">
        <Link href="/login" className="px-6 py-2">
          Login
        </Link>
      </Button>
      <div className="px-20 py-6">
        <div className="bg-background py-2 px-4 rounded-lg fixed top-8 left-16 flex items-center">
          <div className="doto text-[1.8rem]">
            <span className="text-primary">B</span>ITZ
          </div>
        </div>
        <Hero />
        <Sponsors />
        <About />
        <HowItWorks />
        <Features />
        <Services />
        <Cta />
        <Testimonials />
        <Pricing />
        <Newsletter />
        <FAQ />
        <Footer />
        <ScrollToTop />
      </div>
    </div>
  );
}
