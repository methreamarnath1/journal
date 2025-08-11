import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PenTool, Search, Lock, Cloud, Smartphone, Star } from 'lucide-react';
import heroImage from '@/assets/hero-journal.jpg';

const Home: React.FC = () => {
  const features = [
    {
      icon: PenTool,
      title: 'Rich Writing Experience',
      description: 'Create beautiful journal entries with our intuitive editor. Add images, tags, and organize your thoughts effortlessly.',
    },
    {
      icon: Search,
      title: 'Powerful Search',
      description: 'Find any journal entry instantly with our advanced search functionality. Never lose a memory again.',
    },
    {
      icon: Lock,
      title: 'Private & Secure',
      description: 'Your thoughts are safe with us. Keep entries private or choose what to share with the world.',
    },
    {
      icon: Cloud,
      title: 'Cloud Sync',
      description: 'Access your journal from anywhere. All your entries are automatically synced across devices.',
    },
    {
      icon: Smartphone,
      title: 'Mobile Optimized',
      description: 'Write on the go with our responsive design that works perfectly on all devices.',
    },
    {
      icon: Star,
      title: 'Tag & Organize',
      description: 'Keep your entries organized with custom tags and categories for easy retrieval.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
        <img 
          src={heroImage} 
          alt="Journal Hero" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              Your Digital
              <span className="block bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-2 mt-4 inline-block">
                Journal
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
              Capture your thoughts, preserve your memories, and reflect on your journey. 
              The perfect place for your personal stories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-elegant">
                  Start Writing Today
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-background to-accent/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to
              <span className="text-primary"> journal beautifully</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover features designed to make journaling a delightful daily habit
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-0">
                <CardContent className="p-8">
                  <div className="mb-4">
                    <feature.icon className="h-12 w-12 text-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-90" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to start your journaling journey?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Join thousands of writers who have made journaling a beautiful part of their daily routine.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-elegant">
              Create Your Free Account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;