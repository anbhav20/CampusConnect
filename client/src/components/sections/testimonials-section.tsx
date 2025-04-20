import { Star } from "lucide-react";

type Testimonial = {
  name: string;
  role: string;
  imageUrl: string;
  content: string;
  stars: number;
};

const testimonials: Testimonial[] = [
  {
    name: "Sarah Johnson",
    role: "Computer Science, Stanford",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    content: "Campus Connect helped me find an internship at a tech startup. The job listings are verified and relevant to my major, which saved me so much time!",
    stars: 5
  },
  {
    name: "Michael Rodriguez",
    role: "Business, NYU",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    content: "The college groups feature is amazing for sharing resources. Our study group uses it to exchange notes and prepare for exams together. It's been a game-changer!",
    stars: 5
  },
  {
    name: "Aisha Patel",
    role: "Engineering, MIT",
    imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    content: "I love the stories feature! It's a great way to see what events are happening on campus and connect with people who share my interests. The sign-up process was so easy too!",
    stars: 5
  }
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Testimonials</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Hear from our users
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Students across campuses are already loving Campus Connect.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <img
                  className="h-12 w-12 rounded-full"
                  src={testimonial.imageUrl}
                  alt={`Avatar of ${testimonial.name}`}
                />
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">{testimonial.name}</h4>
                  <p className="text-gray-500">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-600">"{testimonial.content}"</p>
              <div className="mt-4 flex text-yellow-400">
                {Array.from({ length: testimonial.stars }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
