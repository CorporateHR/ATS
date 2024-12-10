import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface SignUpData {
  email: string;
  password: string;
  name: string;
  mobile: string;
  companyName: string;
  teamSize: number;
}

interface AuthState {
  agency: {
    id: string;
    name: string;
    subscription: 'basic' | 'pro' | 'enterprise';
  } | null;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'recruiter' | 'manager';
  } | null;
  initialized: boolean;
  setAgency: (agency: AuthState['agency']) => void;
  setUser: (user: AuthState['user']) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  signOut: () => Promise<void>;
  inviteTeamMember: (email: string, name: string, role: 'recruiter' | 'manager') => Promise<void>;
  acceptInvite: (password: string) => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  agency: null,
  user: null,
  initialized: false,
  setAgency: (agency) => set({ agency }),
  setUser: (user) => set({ user }),
  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select(`
            id,
            name,
            email,
            role,
            agency:agencies (
              id,
              name,
              subscription
            )
          `)
          .eq('id', session.user.id)
          .single();

        if (userError) throw userError;

        set({
          user: {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role
          },
          agency: userData.agency ? {
            id: userData.agency.id,
            name: userData.agency.name,
            subscription: userData.agency.subscription
          } : null,
          initialized: true
        });
      } else {
        set({ initialized: true });
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      set({ initialized: true });
    }
  },
  signIn: async (email: string, password: string) => {
    try {
      console.log('Attempting sign in for:', email);
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error('Auth error:', authError);
        throw new Error('Invalid login credentials');
      }

      console.log('Auth successful, fetching user data');
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select(`
          id,
          name,
          email,
          role,
          agency:agencies (
            id,
            name,
            subscription
          )
        `)
        .eq('id', authData.user.id)
        .single();

      if (userError) {
        console.error('User data fetch error:', userError);
        throw new Error('Failed to fetch user data');
      }

      console.log('Setting user data:', userData);
      set({
        user: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role
        },
        agency: userData.agency ? {
          id: userData.agency.id,
          name: userData.agency.name,
          subscription: userData.agency.subscription
        } : null
      });
      
      console.log('Sign in complete');
    } catch (error) {
      console.error('Sign in failed:', error);
      throw error instanceof Error ? error : new Error('Failed to sign in');
    }
  },
  signUp: async (data: SignUpData) => {
    try {
      // Step 1: Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
          }
        }
      });

      if (authError) {
        console.error('Auth Error:', authError);
        if (authError.status === 429) {
          throw new Error('Too many signup attempts. Please wait a few minutes before trying again.');
        }
        throw new Error(authError.message || 'Failed to create account');
      }

      if (!authData.user?.id) {
        throw new Error('Failed to create account. Please try again.');
      }

      // Step 2: Create agency
      const { data: agencyData, error: agencyError } = await supabase
        .from('agencies')
        .insert({
          name: data.companyName,
          team_size: data.teamSize,
          subscription: 'basic'
        })
        .select('id, name, subscription')
        .single();

      if (agencyError) {
        console.error('Agency Error:', agencyError);
        // Clean up auth user since agency creation failed
        await supabase.auth.signOut();
        throw new Error('Failed to create organization. Please try again.');
      }

      // Step 3: Create user profile
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          name: data.name,
          email: data.email,
          mobile: data.mobile,
          role: 'admin',
          agency_id: agencyData.id
        })
        .select('id, name, email, role')
        .single();

      if (userError) {
        console.error('User Error:', userError);
        // Clean up agency since user creation failed
        await supabase.from('agencies').delete().eq('id', agencyData.id);
        await supabase.auth.signOut();
        throw new Error('Failed to create user profile. Please try again.');
      }

      // Set the state
      set({
        user: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role
        },
        agency: {
          id: agencyData.id,
          name: agencyData.name,
          subscription: agencyData.subscription
        }
      });

    } catch (error: any) {
      console.error('Signup process failed:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred. Please try again later.');
    }
  },
  signOut: async () => {
    try {
      await supabase.auth.signOut();
      set({ user: null, agency: null });
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  },
  inviteTeamMember: async (email: string, name: string, role: 'recruiter' | 'manager') => {
    try {
      // Get current user's agency
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('You must be logged in to invite team members');

      const { data: currentUser } = await supabase
        .from('users')
        .select('agency_id')
        .eq('id', user.id)
        .single();

      if (!currentUser?.agency_id) throw new Error('No agency found');

      // Call the invite-user edge function
      const { data, error } = await supabase.functions.invoke('invite-user', {
        body: {
          email,
          name,
          role,
          agencyId: currentUser.agency_id
        }
      });

      if (error) throw error;

      // The edge function returns the reset link
      // You can now send this link via email to the user
      console.log('Invite sent successfully, reset link:', data.resetLink);

    } catch (error) {
      console.error('Failed to invite team member:', error);
      throw error instanceof Error ? error : new Error('Failed to invite team member');
    }
  },

  acceptInvite: async (password: string) => {
    try {
      // Update the user's password
      const { error: updateError } = await supabase.auth.updateUser({
        password
      });

      if (updateError) throw updateError;

      // Get the updated user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Get user profile with agency
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select(`
          id,
          name,
          email,
          role,
          agency:agencies (
            id,
            name,
            subscription
          )
        `)
        .eq('id', user.id)
        .single();

      if (userError) throw userError;

      // Update the state
      set({
        user: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role
        },
        agency: userData.agency ? {
          id: userData.agency.id,
          name: userData.agency.name,
          subscription: userData.agency.subscription
        } : null
      });
    } catch (error) {
      console.error('Failed to accept invite:', error);
      throw error instanceof Error ? error : new Error('Failed to accept invite');
    }
  },
}));
