import React from 'react';

const About = () => {
    return (
        <main className="max-w-4xl mx-auto px-6 py-16 flex-grow">
            <h1 className="text-4xl font-bold mb-6 text-zen-black dark:text-white">Visit Us</h1>

            <p className="mb-4 text-zen-brown dark:text-gray-300">
                Experience AMAI in person.
            </p>

            <div className="bg-[#f8f8f6] dark:bg-zen-highlight-dark p-6 rounded-lg text-zen-black dark:text-white">
                <p><strong>Flagship Store:</strong></p>
                <p>Ginza, Tokyo</p>
                <p>Open: 11 AM – 8 PM</p>
            </div>

            <p className="mt-6 text-text-secondary dark:text-gray-400">
                Tastings, workshops, and seasonal showcases available.
            </p>

            <div className="mt-12">
                <h2 className="text-2xl font-bold mb-4 text-zen-black dark:text-white">Our Heritage</h2>
                <p className="mb-4 text-zen-brown dark:text-gray-300">
                    Amai is a premium artisanal chocolate brand inspired by Japanese minimalism and handcrafted culinary traditions.
                    Our limited-edition, small-batch chocolates are infused with traditional Japanese flavors such as Matcha, Yuzu, Hojicha, and Sakura.
                </p>
            </div>
        </main>
    );
};

export default About;
