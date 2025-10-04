// Supabase configuration
const SUPABASE_URL = 'https://0ec90b57d6e95fcbda19832f.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw';

// Initialize Supabase client
export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Auth functions
export const auth = {
    // Register new user
    async register(email, password, firstName, lastName) {
        try {
            // Sign up user with Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        first_name: firstName,
                        last_name: lastName
                    }
                }
            });

            if (authError) throw authError;

            // Insert additional user data into profiles table
            if (authData.user) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert([
                        {
                            id: authData.user.id,
                            email: email,
                            first_name: firstName,
                            last_name: lastName,
                            created_at: new Date().toISOString()
                        }
                    ]);

                if (profileError) throw profileError;
            }

            return { success: true, user: authData.user };
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, error: error.message };
        }
    },

    // Login user
    async login(email, password) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) throw error;

            return { success: true, user: data.user };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    },

    // Logout user
    async logout() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            return { success: false, error: error.message };
        }
    },

    // Get current user
    async getCurrentUser() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            return user;
        } catch (error) {
            console.error('Get user error:', error);
            return null;
        }
    },

    // Get user profile
    async getUserProfile(userId) {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Get profile error:', error);
            return null;
        }
    }
};

// Auth state listener
supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
        console.log('User signed in:', session.user);
        updateUIForLoggedInUser(session.user);
    } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        updateUIForLoggedOutUser();
    }
});

// UI update functions
function updateUIForLoggedInUser(user) {
    const userButton = document.querySelector('a[href="/login"] button');
    if (userButton) {
        userButton.innerHTML = '<i class="fas fa-user-check"></i>';
        userButton.title = `Hola, ${user.user_metadata?.first_name || user.email}`;
    }

    // Show logout option
    const userLink = document.querySelector('a[href="/login"]');
    if (userLink) {
        userLink.addEventListener('click', async (e) => {
            e.preventDefault();
            const result = await auth.logout();
            if (result.success) {
                window.location.reload();
            }
        });
    }
}

function updateUIForLoggedOutUser() {
    const userButton = document.querySelector('a[href="/login"] button');
    if (userButton) {
        userButton.innerHTML = '<i class="fas fa-user"></i>';
        userButton.title = 'Iniciar sesión';
    }
}

// Initialize auth state on page load
document.addEventListener('DOMContentLoaded', async () => {
    const user = await auth.getCurrentUser();
    if (user) {
        updateUIForLoggedInUser(user);
    }
});