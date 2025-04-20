import { 
  BookOpen, 
  Briefcase, 
  User, 
  Video, 
  Users, 
  Search 
} from "lucide-react";

type FeatureItem = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const features: FeatureItem[] = [
  {
    icon: <BookOpen className="h-6 w-6 text-white" />,
    title: "Home Feed",
    description: "Stay updated with posts from your network, job updates, and academic content in one centralized feed."
  },
  {
    icon: <Briefcase className="h-6 w-6 text-white" />,
    title: "Verified Job Listings",
    description: "Discover and apply to verified job opportunities posted by users and companies directly within the app."
  },
  {
    icon: <User className="h-6 w-6 text-white" />,
    title: "Customizable Profile",
    description: "Showcase your skills, hobbies, education, and more with a personalized profile to stand out."
  },
  {
    icon: <Video className="h-6 w-6 text-white" />,
    title: "Stories",
    description: "Share 30-second stories with your network in a vertical scrollable format, similar to Instagram."
  },
  {
    icon: <Users className="h-6 w-6 text-white" />,
    title: "College Groups",
    description: "Join official college groups to share academic resources, notes, PDFs, and collaborate with classmates."
  },
  {
    icon: <Search className="h-6 w-6 text-white" />,
    title: "Advanced Search",
    description: "Easily find jobs, profiles, posts, and groups with our comprehensive search functionality."
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to connect on campus
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Campus Connect offers a wide range of features designed specifically for college students.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-primary rounded-md shadow-lg">
                        {feature.icon}
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">{feature.title}</h3>
                    <p className="mt-5 text-base text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
