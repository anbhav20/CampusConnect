import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function CTASection() {
  return (
    <section className="py-16 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get connected?</span>
            <span className="block">Join Campus Connect today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-primary-100">
            Start networking, finding jobs, and sharing resources with your college community.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-md shadow">
              <Link href="/auth">
                <Button variant="secondary" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50">
                  Sign up for free
                </Button>
              </Link>
            </div>
            <div className="ml-3 inline-flex">
              <a href="#features">
                <Button variant="outline" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-800 hover:bg-primary-700">
                  Learn more
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
