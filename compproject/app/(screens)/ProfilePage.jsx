import { View, Text, StyleSheet, Button } from 'react-native';
import { useAuth } from '../../hooks/useAuth';

const ProfilePage = () => {
  const { user, signOut } = useAuth();

  if (!user) {
    // This should not happen if the navigation is set up correctly,
    // but as a fallback, we can show a loading or empty state.
    return (
      <View style={styles.container}>
        <Text>No user profile found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{user.name || 'User'}</Text>
      <Text>{user.email}</Text>
      <Text style={styles.small}>ID: {user.id}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Sign Out" onPress={signOut} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  name: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
  small: { marginTop: 8, color: '#666' },
  buttonContainer: {
    marginTop: 20,
  }
});

export default ProfilePage;
