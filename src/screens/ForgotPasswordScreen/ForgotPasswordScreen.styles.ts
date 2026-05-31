import { StyleSheet } from 'react-native';

export const makeStyles = (sc: (n: number) => number) => StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { flexGrow: 1, padding: 30 },
  backButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#ffffff15', marginBottom: 20 },
  header: { alignItems: 'center', marginBottom: 32 },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: { fontSize: sc(26), fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: sc(14), textAlign: 'center', lineHeight: 20, paddingHorizontal: 20 },
  form: {
    width: '100%',
    borderRadius: 24,
    padding: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
  },

  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, marginBottom: 16, paddingHorizontal: 16, minHeight: 56, borderWidth: 1 },
  inputIcon: { marginRight: 12 },
  inputField: { flex: 1, fontSize: sc(16), paddingVertical: 12 },

  resetButton: {
    minHeight: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    shadowColor: '#34d399',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  buttonText: { color: '#0f172a', fontSize: sc(18), fontWeight: 'bold' },
  loginLink: { alignItems: 'center', marginTop: 24, minHeight: 44, justifyContent: 'center' },
  loginLinkText: { fontWeight: '600', fontSize: sc(14) },
});
