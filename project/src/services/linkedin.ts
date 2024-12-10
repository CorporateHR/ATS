import { supabase } from '../lib/supabase';

interface LinkedInJobPost {
  title: string;
  description: string;
  location: string;
  companyId: string;
  employmentType: string;
  experience: string;
  skills: string[];
  clientId: string;
  agencyId: string;
}

export class LinkedInService {
  private static LINKEDIN_API_URL = 'https://api.linkedin.com/v2';
  
  // Initialize LinkedIn OAuth - this will need to be configured in your LinkedIn Developer Console
  static async initializeOAuth() {
    const clientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID;
    const redirectUri = `${window.location.origin}/linkedin/callback`;
    
    const scope = encodeURIComponent('w_member_social r_liteprofile w_organization_social');
    const state = crypto.randomUUID();
    
    // Store state for validation
    await supabase
      .from('oauth_states')
      .insert([{ state, provider: 'linkedin' }]);
    
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;
    
    window.location.href = authUrl;
  }

  // Post a job to LinkedIn
  static async postJob(jobData: LinkedInJobPost) {
    try {
      if (!jobData.clientId || !jobData.agencyId) {
        throw new Error('Client ID and Agency ID are required');
      }

      const accessToken = await this.getAccessToken();
      if (!accessToken) {
        throw new Error('LinkedIn access token not found');
      }

      // Get organization ID (required for job posting)
      const orgResponse = await fetch(`${this.LINKEDIN_API_URL}/organizationalEntityAcls?q=roleAssignee&clientId=${jobData.clientId}&agencyId=${jobData.agencyId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      });
      
      const orgData = await orgResponse.json();
      const organizationId = orgData.elements[0]?.organizationalTarget;

      if (!organizationId) {
        throw new Error('Organization ID not found');
      }

      // Create the job posting
      const response = await fetch(`${this.LINKEDIN_API_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          author: `urn:li:organization:${organizationId}`,
          title: jobData.title,
          description: jobData.description,
          locationId: jobData.location,
          employmentType: jobData.employmentType,
          experience: jobData.experience,
          skills: jobData.skills,
        })
      });

      if (!response.ok) {
        throw new Error('Failed to post job to LinkedIn');
      }

      return await response.json();
    } catch (error) {
      console.error('Error posting job to LinkedIn:', error);
      throw error;
    }
  }

  // Get LinkedIn access token from Supabase
  private static async getAccessToken(): Promise<string | null> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    const { data: tokens } = await supabase
      .from('linkedin_tokens')
      .select('access_token')
      .eq('user_id', session.user.id)
      .single();

    return tokens?.access_token || null;
  }
}
