import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Briefcase, 
  MapPin, 
  Building, 
  Clock, 
  Bookmark, 
  CheckCircle, 
  ChevronDown,
  ChevronUp,
  Calendar,
  DollarSign,
  GraduationCap,
  Filter
} from "lucide-react";
import MainLayout from "@/components/layout/main-layout";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function JobsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState({
    type: "",
    location: "",
    salary: ""
  });
  const [expandedJobId, setExpandedJobId] = useState<number | null>(null);
  
  // Sample job listings data - in a real app, this would come from an API
  const jobListings = [
    {
      id: 1,
      title: "Software Engineering Intern",
      company: "Google",
      logo: "",
      location: "Bangalore, India",
      type: "Internship",
      salary: "₹40,000/month",
      description: "Join Google's internship program and work on cutting-edge technologies. This is a unique opportunity to gain experience in a world-class organization and make a real impact.",
      requirements: "Currently pursuing B.Tech/M.Tech in CS, IT, or related fields. Strong programming skills in Python, Java, or C++. Problem-solving abilities and algorithm knowledge.",
      isVerified: true,
      postedAt: "2 days ago",
      deadline: "30 May 2023",
      recruiter: {
        id: 1,
        name: "Priya Sharma",
        position: "Technical Recruiting Manager",
        avatar: ""
      }
    },
    {
      id: 2,
      title: "Frontend Developer",
      company: "Microsoft",
      logo: "",
      location: "Hyderabad, India",
      type: "Full-time",
      salary: "₹12-18 LPA",
      description: "Microsoft is looking for a talented Frontend Developer to join our growing team. You'll be responsible for building responsive web applications and collaborating with designers and backend developers.",
      requirements: "3+ years of experience with HTML, CSS, and JavaScript. Proficiency in React.js or Angular. Experience with modern frontend tools and practices.",
      isVerified: true,
      postedAt: "1 week ago",
      deadline: "15 June 2023",
      recruiter: {
        id: 2,
        name: "Rahul Verma",
        position: "HR Manager",
        avatar: ""
      }
    },
    {
      id: 3,
      title: "Data Science Intern",
      company: "Amazon",
      logo: "",
      location: "Delhi, India",
      type: "Internship",
      salary: "₹35,000/month",
      description: "Amazon is seeking a Data Science Intern to join our team for a 6-month internship. You'll work on real-world problems, analyzing large datasets and building machine learning models.",
      requirements: "Currently pursuing M.Tech/MS/PhD in CS, Statistics, or related fields. Strong programming skills in Python. Experience with data analysis libraries such as Pandas, NumPy, etc.",
      isVerified: true,
      postedAt: "3 days ago",
      deadline: "10 June 2023",
      recruiter: {
        id: 3,
        name: "Ankit Kumar",
        position: "Technical Recruiter",
        avatar: ""
      }
    },
    {
      id: 4,
      title: "Product Manager",
      company: "Flipkart",
      logo: "",
      location: "Bangalore, India",
      type: "Full-time",
      salary: "₹20-25 LPA",
      description: "Join Flipkart as a Product Manager to define and drive product strategy. You'll work with cross-functional teams to identify customer needs and deliver innovative solutions.",
      requirements: "5+ years of experience in product management. Strong analytical skills and business acumen. Excellent communication and leadership abilities.",
      isVerified: true,
      postedAt: "5 days ago",
      deadline: "20 June 2023",
      recruiter: {
        id: 4,
        name: "Neha Gupta",
        position: "Senior HR Manager",
        avatar: ""
      }
    },
    {
      id: 5,
      title: "UI/UX Designer",
      company: "Swiggy",
      logo: "",
      location: "Mumbai, India",
      type: "Part-time",
      salary: "₹30,000-50,000/month",
      description: "Swiggy is looking for a creative UI/UX Designer to join our design team on a part-time basis. You'll create user-centered designs for our mobile and web applications.",
      requirements: "3+ years of experience in UI/UX design. Proficiency in design tools like Figma, Sketch, or Adobe XD. Strong portfolio demonstrating your design process and outcomes.",
      isVerified: false,
      postedAt: "1 day ago",
      deadline: "25 May 2023",
      recruiter: {
        id: 5,
        name: "Vikram Singh",
        position: "Design Team Lead",
        avatar: ""
      }
    }
  ];
  
  // Sample applications data
  const myApplications = [
    {
      id: 1,
      jobId: 1,
      appliedAt: "April 10, 2023",
      status: "Applied",
      job: {
        title: "Software Engineering Intern",
        company: "Google",
        logo: "",
        location: "Bangalore, India",
        type: "Internship"
      }
    },
    {
      id: 2,
      jobId: 3,
      appliedAt: "April 15, 2023",
      status: "Under Review",
      job: {
        title: "Data Science Intern",
        company: "Amazon",
        logo: "",
        location: "Delhi, India",
        type: "Internship"
      }
    }
  ];
  
  // Sample bookmarks
  const myBookmarks = [
    {
      id: 1,
      jobId: 2,
      savedAt: "April 12, 2023",
      job: {
        title: "Frontend Developer",
        company: "Microsoft",
        logo: "",
        location: "Hyderabad, India",
        type: "Full-time"
      }
    },
    {
      id: 2,
      jobId: 4,
      savedAt: "April 16, 2023",
      job: {
        title: "Product Manager",
        company: "Flipkart",
        logo: "",
        location: "Bangalore, India",
        type: "Full-time"
      }
    }
  ];
  
  const handleBookmark = (jobId: number) => {
    toast({
      title: "Job Bookmarked",
      description: "This job has been saved to your bookmarks"
    });
  };
  
  const handleApply = (jobId: number) => {
    toast({
      title: "Application Started",
      description: "Please complete your application"
    });
  };
  
  const toggleJobExpansion = (jobId: number) => {
    if (expandedJobId === jobId) {
      setExpandedJobId(null);
    } else {
      setExpandedJobId(jobId);
    }
  };
  
  const filterJobs = () => {
    return jobListings.filter(job => {
      const matchesSearch = 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesType = !filter.type || job.type === filter.type;
      const matchesLocation = !filter.location || job.location.includes(filter.location);
      
      return matchesSearch && matchesType && matchesLocation;
    });
  };
  
  const filteredJobs = filterJobs();

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Job & Internship Board</h1>
        <p className="text-gray-500">Find verified opportunities from top companies</p>
      </div>
      
      <Tabs defaultValue="listings" className="w-full">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="listings" className="flex-1">
            <Briefcase className="mr-2 h-4 w-4" />
            Job Listings
          </TabsTrigger>
          <TabsTrigger value="applications" className="flex-1">
            <CheckCircle className="mr-2 h-4 w-4" />
            My Applications
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex-1">
            <Bookmark className="mr-2 h-4 w-4" />
            Saved Jobs
          </TabsTrigger>
        </TabsList>
        
        {/* Job Listings Tab */}
        <TabsContent value="listings" className="space-y-6">
          {/* Search & Filters */}
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                placeholder="Search jobs, companies, keywords..."
                className="pl-10 bg-gray-100 border-gray-100"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Select
                value={filter.type}
                onValueChange={(value) => setFilter({...filter, type: value})}
              >
                <SelectTrigger className="bg-white">
                  <div className="flex items-center">
                    <Briefcase className="mr-2 h-4 w-4 text-gray-500" />
                    <SelectValue placeholder="Job Type" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={filter.location}
                onValueChange={(value) => setFilter({...filter, location: value})}
              >
                <SelectTrigger className="bg-white">
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                    <SelectValue placeholder="Location" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Locations</SelectItem>
                  <SelectItem value="Bangalore">Bangalore</SelectItem>
                  <SelectItem value="Delhi">Delhi</SelectItem>
                  <SelectItem value="Mumbai">Mumbai</SelectItem>
                  <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                  <SelectItem value="Pune">Pune</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" onClick={() => setFilter({ type: "", location: "", salary: "" })}>
                <Filter className="mr-2 h-4 w-4" />
                Reset Filters
              </Button>
            </div>
          </div>
          
          {/* Jobs List */}
          {filteredJobs.length > 0 ? (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="overflow-hidden">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-12 w-12 rounded bg-gray-100">
                          <AvatarFallback className="text-primary font-semibold">
                            {job.company.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-semibold text-lg">{job.title}</h3>
                            {job.isVerified && (
                              <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-600 border-blue-200">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center text-gray-500 mt-1">
                            <Building className="h-4 w-4 mr-1" />
                            <span className="mr-3">{job.company}</span>
                            <MapPin className="h-4 w-4 mr-1" />
                            <span className="mr-3">{job.location}</span>
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{job.postedAt}</span>
                          </div>
                          <div className="flex mt-2 space-x-2">
                            <Badge variant="secondary">{job.type}</Badge>
                            <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">
                              <DollarSign className="h-3 w-3 mr-1" />
                              {job.salary}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleBookmark(job.id)}
                      >
                        <Bookmark className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-4 pt-2">
                    <div className={`${expandedJobId === job.id ? '' : 'line-clamp-2'} text-gray-600 mb-2`}>
                      {job.description}
                    </div>
                    
                    {expandedJobId === job.id && (
                      <div className="mt-4 space-y-4">
                        <div>
                          <h4 className="font-medium mb-1">Requirements</h4>
                          <p className="text-gray-600">{job.requirements}</p>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Deadline: {job.deadline}</span>
                          </div>
                          
                          <div className="flex items-center">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarFallback>{job.recruiter.name[0]}</AvatarFallback>
                            </Avatar>
                            <span>Posted by {job.recruiter.name}, {job.recruiter.position}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 text-primary"
                      onClick={() => toggleJobExpansion(job.id)}
                    >
                      {expandedJobId === job.id ? (
                        <>
                          <ChevronUp className="h-4 w-4 mr-1" />
                          Show Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4 mr-1" />
                          Show More
                        </>
                      )}
                    </Button>
                  </CardContent>
                  
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <Link href={`/jobs/${job.id}`}>
                      <Button variant="outline">View Details</Button>
                    </Link>
                    <Button onClick={() => handleApply(job.id)}>Apply Now</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-lg shadow-sm">
              <div className="inline-flex rounded-full p-4 bg-gray-100 mb-4">
                <Briefcase className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium mb-2">No Jobs Found</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                We couldn't find any jobs matching your search criteria. Try adjusting your filters or search terms.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery("");
                  setFilter({ type: "", location: "", salary: "" });
                }}
              >
                Clear All Filters
              </Button>
            </div>
          )}
          
          <div className="text-center mt-8">
            <Link href="/jobs/create">
              <Button>
                <Briefcase className="mr-2 h-4 w-4" />
                Post a Job
              </Button>
            </Link>
          </div>
        </TabsContent>
        
        {/* My Applications Tab */}
        <TabsContent value="applications">
          {myApplications.length > 0 ? (
            <div className="space-y-4">
              {myApplications.map((application) => (
                <Card key={application.id} className="overflow-hidden">
                  <CardHeader className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-10 w-10 rounded bg-gray-100">
                          <AvatarFallback className="text-primary font-semibold">
                            {application.job.company.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{application.job.title}</h3>
                          <div className="flex items-center text-gray-500 mt-1 text-sm">
                            <Building className="h-4 w-4 mr-1" />
                            <span className="mr-3">{application.job.company}</span>
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{application.job.location}</span>
                          </div>
                        </div>
                      </div>
                      <Badge 
                        className={
                          application.status === "Applied" 
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-100" 
                            : application.status === "Under Review" 
                            ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                            : "bg-green-100 text-green-800 hover:bg-green-100"
                        }
                      >
                        {application.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardFooter className="p-4 pt-0 flex justify-between text-sm text-gray-500">
                    <div>
                      Applied on {application.appliedAt}
                    </div>
                    <Link href={`/jobs/${application.jobId}`}>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-lg shadow-sm">
              <div className="inline-flex rounded-full p-4 bg-gray-100 mb-4">
                <CheckCircle className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium mb-2">No Applications Yet</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                You haven't applied to any jobs yet. Browse available opportunities and start your application process.
              </p>
              <Button onClick={() => document.querySelector('[data-state="inactive"][value="listings"]')?.click()}>
                Browse Jobs
              </Button>
            </div>
          )}
        </TabsContent>
        
        {/* Saved Jobs Tab */}
        <TabsContent value="saved">
          {myBookmarks.length > 0 ? (
            <div className="space-y-4">
              {myBookmarks.map((bookmark) => (
                <Card key={bookmark.id} className="overflow-hidden">
                  <CardHeader className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-10 w-10 rounded bg-gray-100">
                          <AvatarFallback className="text-primary font-semibold">
                            {bookmark.job.company.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{bookmark.job.title}</h3>
                          <div className="flex items-center text-gray-500 mt-1 text-sm">
                            <Building className="h-4 w-4 mr-1" />
                            <span className="mr-3">{bookmark.job.company}</span>
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{bookmark.job.location}</span>
                          </div>
                          <Badge variant="secondary" className="mt-2">{bookmark.job.type}</Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Bookmark className="h-5 w-5 fill-current" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <div className="text-sm text-gray-500">
                      Saved on {bookmark.savedAt}
                    </div>
                    <div className="space-x-2">
                      <Link href={`/jobs/${bookmark.jobId}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                      <Button size="sm" onClick={() => handleApply(bookmark.jobId)}>
                        Apply Now
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-lg shadow-sm">
              <div className="inline-flex rounded-full p-4 bg-gray-100 mb-4">
                <Bookmark className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium mb-2">No Saved Jobs</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                You haven't saved any jobs yet. Bookmark jobs to quickly find them later.
              </p>
              <Button onClick={() => document.querySelector('[data-state="inactive"][value="listings"]')?.click()}>
                Browse Jobs
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}