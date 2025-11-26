const API_BASE_URL = 'http://192.168.50.51:4000/api'; // <- adjust host/port if needed

export async function fetchProfile(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/user/profile?id=${encodeURIComponent(id)}`);
        const data = await response.json();

        return data.profile ?? data;
    } catch (error) {
        throw new Error(`Failed to fetch profile: ${error.message}`);
    }
}