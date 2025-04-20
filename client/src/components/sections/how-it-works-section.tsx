export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">How It Works</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Simple steps to get started
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Campus Connect makes it easy to connect with your college community. Here's how to get started.
          </p>
        </div>

        <div className="mt-16">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div className="relative">
              <img
                className="w-full rounded-lg shadow-lg"
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                alt="Students using Campus Connect"
              />
            </div>
            <div className="mt-10 lg:mt-0">
              <div className="space-y-10">
                {[
                  {
                    step: 1,
                    title: "Sign up",
                    description: "Create an account using Google, GitHub, or Email. Choose a unique username to get started."
                  },
                  {
                    step: 2,
                    title: "Complete your profile",
                    description: "Set up your profile with personal details, skills, hobbies, and college information."
                  },
                  {
                    step: 3,
                    title: "Join your college group",
                    description: "Connect with your official college group to access resources and meet peers."
                  },
                  {
                    step: 4,
                    title: "Start connecting",
                    description: "Share posts, browse job opportunities, create stories, and network with other students."
                  }
                ].map((item) => (
                  <div key={item.step} className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                        <span className="text-lg font-bold">{item.step}</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg leading-6 font-medium text-gray-900">{item.title}</h4>
                      <p className="mt-2 text-base text-gray-500">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
