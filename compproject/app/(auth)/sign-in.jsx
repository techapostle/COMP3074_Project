import { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { useAuth } from '../../hooks/useAuth';

export default function SignInPage() {
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const submit = async () => { // Removed 'e' since it's not a web event
    const { loginError } = await signIn(email, password);
    if (loginError) {
      setError(loginError.message); 
    } else {
      setError(null);
    }
  };

  const RegisterModal = () => {
    const [signUpData, setSignUpData] = useState({
      email: '',
      password: '',
      confirmPassword: '',
    });

    return (
      <View className="registerModal" style={styles.registerModal}>
        {/* Form fields for registration would go here */}
        <View style={styles.modalContent}>
          <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 12 }}>Create an account</Text>

          <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 }}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={signUpData.email}
            onChangeText={(text) => setSignUpData(prev => ({ ...prev, email: text }))}
          />

          <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 }}
            placeholder="Password"
            secureTextEntry
            value={signUpData.password}
            onChangeText={(text) => setSignUpData(prev => ({ ...prev, password: text }))}
          />

          <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 14, paddingHorizontal: 10 }}
            placeholder="Confirm Password"
            secureTextEntry
            value={signUpData.confirmPassword}
            onChangeText={(text) => setSignUpData(prev => ({ ...prev, confirmPassword: text }))}
          />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Button title="Cancel" onPress={() => setRegisterModalOpen(false)} />

            <Button
              title="Register"
              onPress={() => {
                // simple client-side validation
                if (!signUpData.email || !signUpData.password || !signUpData.confirmPassword) {
                  setSignUpData(prev => ({ ...prev, error: 'Please fill out all fields.' }));
                  return;
                }
                if (signUpData.password !== signUpData.confirmPassword) {
                  setSignUpData(prev => ({ ...prev, error: "Passwords don't match." }));
                  return;
                }

                setSignUpData(prev => ({ ...prev, error: null }));
                signUp(signUpData.email, signUpData.password);
                setRegisterModalOpen(false);
              }}
            />
          </View>

          {signUpData.error ? (
            <Text style={{ color: 'red', marginTop: 12, textAlign: 'center' }}>{signUpData.error}</Text>
          ) : null}
        </View>
      </View>
    )
  };

  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  const openRegisterModal = () => {
    setRegisterModalOpen(true);
  }

  return (
    <View style={styles.container}>
      {registerModalOpen && <RegisterModal />}
      <TextInput
        style={styles.input}
        placeholder="example@email.com"
        value={email}
        onChangeText={setEmail} // Use onChangeText for TextInput
        keyboardType="email-address"
        autoCapitalize="none"
        required
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword} // Use onChangeText for TextInput
        secureTextEntry
        required
      />
      <Button title="Sign In" onPress={submit} />
      <Button title="Register Now" onPress={openRegisterModal} />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative', // allow absolutely positioned children to overlay
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
  registerModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    elevation: 9999, // Android
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
  },
});