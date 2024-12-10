import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { LinkedInService } from '../../services/linkedin';
import { Share2, Loader2 } from 'lucide-react';

interface LinkedInShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobData: {
    title: string;
    description: string;
    location: string;
    companyId: string;
    employmentType: string;
    experience: string;
    skills: string[];
    clientId: string;
    agencyId: string;
  };
}

export function LinkedInShareModal({ isOpen, onClose, jobData }: LinkedInShareModalProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleShare = async () => {
    try {
      setIsSharing(true);
      setError(null);
      await LinkedInService.postJob(jobData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to share job on LinkedIn');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Share Job on LinkedIn
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Would you like to share this job posting on LinkedIn? This will create a job post on your company's LinkedIn page.
                  </p>
                </div>

                {error && (
                  <div className="mt-2 p-2 bg-red-50 text-red-600 rounded-md text-sm">
                    {error}
                  </div>
                )}

                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={handleShare}
                    disabled={isSharing}
                  >
                    {isSharing ? (
                      <>
                        <Loader2 className="animate-spin mr-2 h-4 w-4" />
                        Sharing...
                      </>
                    ) : (
                      <>
                        <Share2 className="mr-2 h-4 w-4" />
                        Share on LinkedIn
                      </>
                    )}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
