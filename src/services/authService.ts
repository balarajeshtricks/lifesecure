import { supabase } from '../lib/supabase';

// Fallback authentication for demo purposes when Supabase is not connected
const DEMO_ADMIN = {
  username: 'admin',
  password: 'admin123'
};

export const authenticateAdmin = async (username: string, password: string): Promise<boolean> => {
  try {
    // Check if we're using placeholder Supabase credentials
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
      // Use demo authentication
      return username === DEMO_ADMIN.username && password === DEMO_ADMIN.password;
    }

    // First, sign in with Supabase auth using email/password
    // For demo purposes, we'll use a fixed email format
    const email = `${username}@lifesecure-admin.com`;
    
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError || !authData.user) {
      // If auth fails, try to sign up the admin user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password
      });

      if (signUpError) {
        console.error('Authentication failed:', signUpError);
        return false;
      }

      // Create admin record
      if (signUpData.user) {
        const { error: insertError } = await supabase
          .from('admins')
          .insert([{
            id: signUpData.user.id,
            username,
            password_hash: 'hashed' // In production, this would be properly hashed
          }]);

        if (insertError) {
          console.error('Error creating admin record:', insertError);
        }
      }

      return true;
    }

    // Verify admin exists in admins table
    const { data: adminData, error: adminError } = await supabase
      .from('admins')
      .select('*')
      .eq('username', username)
      .single();

    if (adminError || !adminData) {
      // Create admin record if it doesn't exist
      if (authData.user) {
        const { error: insertError } = await supabase
          .from('admins')
          .insert([{
            id: authData.user.id,
            username,
            password_hash: 'hashed'
          }]);

        if (insertError) {
          console.error('Error creating admin record:', insertError);
        }
      }
    }

    return true;
  } catch (error) {
    console.error('Authentication error:', error);
    return false;
  }
};

export const signOutAdmin = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error signing out:', error);
  }
};

export const getCurrentAdmin = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data: adminData, error } = await supabase
    .from('admins')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching admin data:', error);
    return null;
  }

  return adminData;
};