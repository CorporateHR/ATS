import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Briefcase } from 'lucide-react';
import JobCard from '../components/JobCard';
import AddJobForm from '../components/AddJobForm';
import JobDetailsModal from '../components/JobDetailsModal';
import EmptyState from '../components/EmptyState';
import useJobsStore from '../store/jobs';
import type { Job, JobInsert } from '../types';

// TODO: Get these from auth context or user store
const AGENCY_ID = '123e4567-e89b-12d3-a456-426614174000';
const USER_ID = '123e4567-e89b-12d3-a456-426614174001';

export default function Jobs() {
  const { jobs, loading, error, fetchJobs, addJob, updateJob, deleteJob } = useJobsStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showJobDetails, setShowJobDetails] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleAddJob = async (newJob: JobInsert) => {
    try {
      await addJob(newJob);
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to add job:', error);
    }
  };

  const handleUpdateJob = async (id: string, updatedJob: Partial<Job>) => {
    try {
      await updateJob(id, updatedJob);
      setSelectedJob(null);
    } catch (error) {
      console.error('Failed to update job:', error);
    }
  };

  const handleDeleteJob = async (id: string) => {
    try {
      await deleteJob(id);
      setSelectedJob(null);
      setShowJobDetails(false);
    } catch (error) {
      console.error('Failed to delete job:', error);
    }
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center text-red-600">
          <p>Error loading jobs: {error}</p>
          <button
            onClick={() => fetchJobs()}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-[2000px]">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <button className="inline-flex items-center px-3 py-2 border rounded-lg hover:bg-gray-50 whitespace-nowrap">
            <Filter className="h-5 w-5 mr-2" />
            Filter
          </button>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 whitespace-nowrap"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Job
        </button>
      </div>

      {showAddForm && (
        <div className="mb-6">
          <AddJobForm
            onSubmit={handleAddJob}
            onCancel={() => setShowAddForm(false)}
            agencyId={AGENCY_ID}
            userId={USER_ID}
          />
        </div>
      )}

      {filteredJobs.length === 0 && !showAddForm ? (
        <EmptyState
          icon={Briefcase}
          title="No jobs found"
          description="Get started by creating a new job posting."
          actionLabel="Add Job"
          onAction={() => setShowAddForm(true)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onView={() => {
                setSelectedJob(job);
                setShowJobDetails(true);
              }}
              onEdit={() => {
                setSelectedJob(job);
                setShowJobDetails(true);
              }}
              onDelete={() => handleDeleteJob(job.id)}
            />
          ))}
        </div>
      )}

      {showJobDetails && selectedJob && (
        <JobDetailsModal
          isOpen={showJobDetails}
          onClose={() => {
            setShowJobDetails(false);
            setSelectedJob(null);
          }}
          job={selectedJob}
          onEdit={() => {
            // For now, editing is handled through the details modal
            // You can implement a separate edit form if needed
          }}
          onDelete={() => {
            if (selectedJob) {
              handleDeleteJob(selectedJob.id);
            }
          }}
        />
      )}
    </div>
  );
}
