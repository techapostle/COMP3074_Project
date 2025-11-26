import { Slot, SplashScreen, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function InitialLayout() {
    const { loading, token } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        const inAuthGroup = segments[0] === '(auth)';

        if (token && inAuthGroup) {
            // User is signed in and in the auth group, so redirect to the main app.
            router.replace('/(tabs)');
        } else if (!token && !inAuthGroup) {
            // User is not signed in and not in the auth group, so redirect to the sign-in page.
            router.replace('/(auth)/sign-in');
        }

        SplashScreen.hideAsync();

    }, [loading, token, segments, router]);

    if (loading) {
        return null;
    }

    return <Slot />;
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <InitialLayout />
        </AuthProvider>
    );
}