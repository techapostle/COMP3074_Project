const { supabase } = require('../supabaseClient');

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ error: 'Authentication token required.' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error) {
        return res.status(403).json({ error: 'Invalid token.' });
    }

    req.user = user;
    next();
};

module.exports = { authenticateToken };
