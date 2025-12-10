import React from 'react';

const AboutSection: React.FC = () => {
    
    return (
        <section id="about" className="py-20 sm:py-32 bg-[--background]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="overflow-hidden rounded-3xl">
                        <img 
                            src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=3456&auto=format&fit=crop"
                            alt="Serene interior of AURA Med Spa"
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                    </div>
                    <div className="text-center lg:text-left">
                        <p className="text-base font-semibold text-[--accent] tracking-wider">Our Philosophy</p>
                        <h2 className="mt-4 text-4xl sm:text-5xl font-extrabold text-[--foreground] tracking-tight">
                            Science-Backed Serenity.
                        </h2>
                        <p className="mt-6 max-w-xl mx-auto lg:mx-0 text-lg text-[--foreground-secondary] leading-relaxed">
                            At AURA, we believe in a holistic approach to beauty, blending advanced aesthetic technology with personalized care. Our mission is to enhance your natural radiance through safe, effective treatments tailored to your unique skin and wellness goals.
                        </p>
                         <div className="mt-8">
                            <a href="#contact" className="inline-block bg-[--accent] text-[--accent-foreground] font-semibold px-8 py-3 rounded-full hover:opacity-90 transition-opacity">
                                Meet Our Experts
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;