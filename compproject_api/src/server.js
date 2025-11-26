require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { authenticateToken } = require('./middleware/auth');
const { supabase } = require('./supabaseClient');

const app = express();
const LOCAL_IP_ADDRESS = process.env.LOCAL_IP_ADDRESS || '127.0.0.1';
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/status', (req, res) => {
    res.status(200).json({ status: 'API is running' });
});

// Auth related routes
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    console.log(`Login attempt for email: ${email}`);

    const { data, error } = await supabase.auth.signInWithPassword({ 
        email: email,
        password: password,
    });

    if (error) {
        console.error('Supabase login error:', error.message);
        return res.status(401).json({ message: error.message });
    }

    console.log(`Successfully authenticated user ${data.user.email}`);

    // The 'data' object contains session and user details.
    // The session contains the access_token which is the JWT.
    res.json({
        message: 'Login successful',
        token: data.session.access_token,
        user: data.user,
    });
});

app.post('/api/auth/register', async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
    });

    if (error) {
        console.error('Supabase registration error:', error.message);
        return res.status(400).json({ message: error.message });
    }

    console.log(`User registered with email: ${data.user.email}`);

    // The 'data' object contains user details.
    res.status(201).json({
        message: 'Registration successful',
        token: data.session ? data.session.access_token : null,
        user: data.user,
    });
});

app.post('/api/auth/logout', authenticateToken, async (req, res) => {
    const { user } = req;
    console.log(`Logout requested for user ID: ${user.id}`);

    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error('Supabase logout error:', error.message);
        return res.status(500).json({ message: error.message });
    }

    res.status(200).json({ message: 'Logout successful' });
});

app.get('/api/user/profile', authenticateToken, async (req, res) => {
    // The user object from the token is in req.user
    const userId = req.user.id;
    console.log(`Profile requested for user ID: ${userId}`);

    // Fetch the complete user profile from your 'profiles' table
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Error fetching profile:', error.message);
        return res.status(500).json({ error: 'Failed to fetch user profile.' });
    }
    
    if (!data) {
        return res.status(404).json({ error: 'Profile not found.' });
    }

    res.status(200).json(data);
});

app.listen(PORT, LOCAL_IP_ADDRESS, () => {
    console.log(`API Server is listening at http://${LOCAL_IP_ADDRESS}:${PORT}`);
});
