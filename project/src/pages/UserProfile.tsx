import React from 'react';
import { useParams } from 'react-router-dom';
import { User, Mail, Phone, Briefcase, MapPin } from 'lucide-react';
import { useAuthStore } from '@/store/auth';

const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();

  // Dummy data in case no real data is available
  const dummyUser = {
    id: id || user?.id || '1',
    name: user?.name || 'John Doe',
    email: user?.email || 'john.doe@example.com',
    role: user?.role || 'recruiter',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    company: 'Tech Innovations Inc.',
    joinDate: 'January 15, 2023',
    bio: 'Passionate recruiter with 5+ years of experience in tech talent acquisition. Specializing in finding top-tier software engineering talent.',
    skills: ['Talent Acquisition', 'Tech Recruiting', 'Team Building', 'Interview Coaching'],
    recentActivity: [
      { type: 'Job Posting', title: 'Senior Software Engineer', date: '2 days ago' },
      { type: 'Candidate Interview', title: 'Frontend Developer Role', date: '5 days ago' },
      { type: 'Team Expansion', title: 'Hired 3 New Engineers', date: '10 days ago' }
    ]
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gray-100 p-6 flex items-center">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mr-6">
            <User className="w-12 h-12 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{dummyUser.name}</h1>
            <p className="text-gray-600">{dummyUser.role.charAt(0).toUpperCase() + dummyUser.role.slice(1)}</p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-3 text-gray-500" />
                  <span>{dummyUser.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-3 text-gray-500" />
                  <span>{dummyUser.phone}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-3 text-gray-500" />
                  <span>{dummyUser.location}</span>
                </div>
              </div>
            </div>

            {/* Professional Details */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Professional Details</h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Briefcase className="w-5 h-5 mr-3 text-gray-500" />
                  <span>{dummyUser.company}</span>
                </div>
                <div>
                  <strong>Join Date:</strong> {dummyUser.joinDate}
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">About</h2>
            <p className="text-gray-600">{dummyUser.bio}</p>
          </div>

          {/* Skills */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {dummyUser.skills.map((skill, index) => (
                <span 
                  key={index} 
                  className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {dummyUser.recentActivity.map((activity, index) => (
                <div 
                  key={index} 
                  className="bg-gray-50 p-4 rounded-lg"
                >
                  <div className="font-medium">{activity.type}</div>
                  <div className="text-gray-600">{activity.title}</div>
                  <div className="text-sm text-gray-500">{activity.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
