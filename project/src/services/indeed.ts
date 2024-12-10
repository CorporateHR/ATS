import { supabase } from '../lib/supabase';

interface IndeedJobPost {
  title: string;
  description: string;
  location: string;
  companyId: string;
  employmentType: string;
  experience: string;
  skills: string[];
  clientId: string;
  agencyId: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
    interval: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';
  };
}

export class IndeedService {
  private static INDEED_API_URL = 'https://apis.indeed.com/v2';
  
  // Initialize Indeed OAuth
  static async initializeOAuth() {
    const clientId = import.meta.env.VITE_INDEED_CLIENT_ID;
    const redirectUri = `${window.location.origin}/indeed/callback`;
    
    const scope = encodeURIComponent('employer_access jobs_access');
    const state = crypto.randomUUID();
    
    // Store state for validation
    await supabase
      .from('oauth_states')
      .insert([{ state, provider: 'indeed' }]);
    
    const authUrl = `https://secure.indeed.com/oauth/v2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&state=${state}&scope=${scope}`;
    
    window.location.href = authUrl;
  }

  // Post a job to Indeed
  static async postJob(jobData: IndeedJobPost) {
    try {
      if (!jobData.clientId || !jobData.agencyId) {
        throw new Error('Client ID and Agency ID are required');
      }

      const accessToken = await this.getAccessToken();
      if (!accessToken) {
        throw new Error('Indeed access token not found');
      }

      // Create job posting
      const response = await fetch(`${this.INDEED_API_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Indeed-Client-Id': import.meta.env.VITE_INDEED_CLIENT_ID
        },
        body: JSON.stringify({
          title: jobData.title,
          description: jobData.description,
          location: {
            country: 'US', // You might want to make this dynamic
            city: jobData.location
          },
          company: {
            id: jobData.companyId
          },
          employmentType: this.mapEmploymentType(jobData.employmentType),
          jobRequirements: {
            experience: jobData.experience,
            skills: jobData.skills
          },
          compensation: jobData.salary ? {
            salary: {
              min: jobData.salary.min,
              max: jobData.salary.max,
              currency: jobData.salary.currency,
              interval: jobData.salary.interval
            }
          } : undefined
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to post job to Indeed: ${errorData.message}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error posting job to Indeed:', error);
      throw error;
    }
  }

  // Get Indeed access token from Supabase
  private static async getAccessToken(): Promise<string | null> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    const { data: tokens } = await supabase
      .from('indeed_tokens')
      .select('access_token')
      .eq('user_id', session.user.id)
      .single();

    return tokens?.access_token || null;
  }

  // Map employment type to Indeed's format
  private static mapEmploymentType(type: string): string {
    const mappings: { [key: string]: string } = {
      'FULL_TIME': 'FULL_TIME',
      'PART_TIME': 'PART_TIME',
      'CONTRACT': 'CONTRACTOR',
      'TEMPORARY': 'TEMPORARY',
      'INTERNSHIP': 'INTERN'
    };
    return mappings[type] || type;
  }
}
