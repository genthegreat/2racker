import { Metadata } from "next";
import ContactForm from "./ContactForm"

export const metadata: Metadata = {
    title: "Contact Us | 2racker | Debt Payment Planner by Prince Kwesi",
    description: "Contact the 2racker team.",
};
  
export default function Page() {
    return (
        <div className="relative pb-[50px] pt-[50px]">
            <div className="container">
                <div className="-mx-4 flex flex-wrap">
                    <div className="w-full px-4 lg:w-5/12">
                        <div className="hero-content">
                            <h1 className="mb-5 text-4xl font-bold !leading-[1.208] text-gray-200 sm:text-[42px] lg:text-[40px] xl:text-5xl">
                                Contact Us
                            </h1>
                            <p className="mb-8 max-w-[480px] text-gray-600 text-justify">
                                We would like to hear from you. Let us know about your experience using 2racker!
                            </p>
                            < div className="w-full space-y-8 p-10 bg-white rounded-xl shadow-lg" >
                                <ContactForm />
                            </div>
                        </div>
                    </div>
                    <div className="hidden px-4 lg:block lg:w-1/12"></div>
                    <div className="w-full px-4 lg:w-6/12">
                        <div className="lg:ml-auto lg:text-right">
                            <div className="inline-block pt-11 lg:pt-0">
                                <img
                                    src="/logo.png"
                                    alt="2racker Logo"
                                    className="max-w-full lg:ml-auto rounded-xl"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
