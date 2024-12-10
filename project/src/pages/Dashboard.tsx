import React from 'react';
import { BarChart3, Users, Briefcase, Building2, TrendingUp, Clock } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, Sarah!</h1>
        <p className="mt-2 text-gray-600">Here's what's happening with your recruitment today.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Briefcase className="w-6 h-6 text-blue-600" />}
          title="Active Jobs"
          value="24"
          trend="+5%"
          trendLabel="vs last month"
          bgColor="bg-blue-50"
        />
        <StatCard
          icon={<Users className="w-6 h-6 text-green-600" />}
          title="Total Candidates"
          value="142"
          trend="+12%"
          trendLabel="vs last month"
          bgColor="bg-green-50"
        />
        <StatCard
          icon={<Building2 className="w-6 h-6 text-purple-600" />}
          title="Active Clients"
          value="8"
          trend="+2"
          trendLabel="this month"
          bgColor="bg-purple-50"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6 text-orange-600" />}
          title="Placement Rate"
          value="68%"
          trend="+8%"
          trendLabel="vs last month"
          bgColor="bg-orange-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <UpcomingInterviews />
      </div>
    </div>
  );
}

function StatCard({ 
  icon, 
  title, 
  value, 
  trend, 
  trendLabel,
  bgColor 
}: { 
  icon: React.ReactNode; 
  title: string; 
  value: string; 
  trend: string;
  trendLabel: string;
  bgColor: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${bgColor}`}>{icon}</div>
      </div>
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        <span className="text-sm text-green-600 flex items-center gap-1">
          {trend}
          <span className="text-gray-600">{trendLabel}</span>
        </span>
      </div>
    </div>
  );
}

function RecentActivity() {
  const activities = [
    { id: 1, text: "New candidate applied for Senior Developer position", time: "2h ago" },
    { id: 2, text: "Interview scheduled with John Doe", time: "4h ago" },
    { id: 3, text: "New job posted: UX Designer", time: "6h ago" },
    { id: 4, text: "Candidate status updated", time: "8h ago" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div className="p-2 bg-gray-50 rounded-full">
              <Clock className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <p className="text-gray-800">{activity.text}</p>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UpcomingInterviews() {
  const interviews = [
    { id: 1, candidate: "John Doe", position: "Senior Developer", time: "Today, 2:00 PM" },
    { id: 2, candidate: "Jane Smith", position: "Product Manager", time: "Today, 4:30 PM" },
    { id: 3, candidate: "Mike Johnson", position: "UX Designer", time: "Tomorrow, 10:00 AM" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Interviews</h2>
      <div className="space-y-3">
        {interviews.map((interview) => (
          <div key={interview.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">{interview.candidate}</h3>
              <p className="text-sm text-gray-600">{interview.position}</p>
            </div>
            <span className="text-sm font-medium text-gray-600">{interview.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
