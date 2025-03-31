
import React from 'react';
import Layout from '@/components/layout/Layout';
import Hero from '@/components/home/Hero';
import FeaturedStories from '@/components/home/FeaturedStories';
import HowItWorks from '@/components/home/HowItWorks';
import Testimonials from '@/components/home/Testimonials';
import CallToAction from '@/components/home/CallToAction';

const Index: React.FC = () => {
  return (
    <Layout>
      <Hero />
      <HowItWorks />
      <FeaturedStories />
      <Testimonials />
      <CallToAction />
    </Layout>
  );
};

export default Index;
