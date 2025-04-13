import React from 'react';
import Title from '../components/Title';
import NewsletterBox from '../components/NewsletterBox';
import { assets } from '../assets/assets';

const Contact = () => {
    return (
        <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]"> {/* Add container padding */}
            <div className="text-center text-2xl pt-10 border-t">
                <div className="inline-flex gap-2 items-center mb-3">
                    <Title text1="CONTACT" text2="US" /> {/* No need for curly braces around string literals */}
                </div>
            </div>

            <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28">
                <img
                    className="w-full md:max-w-[480px]"
                    src={assets.contact_img}
                    alt="Contact Us" // Descriptive alt text is crucial
                />
                <div className="flex flex-col justify-center items-start gap-6">
                    <div className="font-semibold text-xl text-gray-600">Our Store</div> {/* Use divs for semantic grouping */}
                    <div className="text-gray-500">
                        54709 Willms Station<br />
                        Suite 350, Washington, USA
                    </div>
                    <div className="text-gray-500">
                        Tel: (415) 555-0132<br />
                        Email: admin@forever.com
                    </div>
                    <div className="font-semibold text-xl text-gray-600">Careers at Forever</div>
                    <div className="text-gray-500">
                        Learn more about our teams and job openings.
                    </div>
                    <button className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500">
                        Explore Jobs
                    </button>
                </div>
            </div>

            {/*... (Rest of your contact content, like the newsletter signup) */}

            <NewsletterBox/>
        </div>
    );
};

export default Contact;