import { StyleSheet } from 'react-native';

export const makeStyles = (sc: (n: number) => number) => StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 50 },
  header: { marginBottom: 32 },
  stepText: { textAlign: 'center', fontWeight: '600', marginBottom: 8, fontSize: sc(12) },
  progressBarBg: { width: '100%', height: 6, borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { width: '100%', height: '100%', borderRadius: 3, shadowColor: '#34d399', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 10, elevation: 2 },
  
  iaContainer: { flexDirection: 'row', gap: 16, marginBottom: 32 },
  iaButton: { flex: 1, padding: 16, borderRadius: 24, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  iaIconBox: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  iaButtonTitle: { fontWeight: 'bold', fontSize: sc(14), textAlign: 'center', marginBottom: 4 },
  iaButtonSub: { fontSize: sc(10), textAlign: 'center' },
  
  formCard: { borderRadius: 24, padding: 24, borderWidth: 1, marginBottom: 24 },
  formTitle: { fontSize: sc(18), fontWeight: 'bold', marginBottom: 24 },
  
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, marginBottom: 16, paddingHorizontal: 16, minHeight: 56, borderWidth: 1 },
  inputIcon: { marginRight: 12 },
  inputField: { flex: 1, fontSize: sc(16), paddingVertical: 12 },
  
  row: { flexDirection: 'row' },
  sectionSubtitle: { fontSize: sc(12), fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginTop: 8 },
  
  diabetesRow: { flexDirection: 'row', marginBottom: 16 },
  radioBtn: { flexDirection: 'row', alignItems: 'center', marginRight: 16, minHeight: 48, paddingHorizontal: 16, borderRadius: 16, borderWidth: 1 },
  radioText: { marginLeft: 8, fontSize: sc(16), fontWeight: '600' },
  
  tipoContainer: { marginBottom: 16 },
  gridTipos: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tipoTag: { borderWidth: 1, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 20, minHeight: 48, justifyContent: 'center' },
  tipoTagText: { fontSize: sc(14) },
  
  termsContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 16, minHeight: 48 },
  termsText: { flex: 1, marginLeft: 12, fontSize: sc(12), lineHeight: 18 },
  termsLink: { fontWeight: 'bold' },
  
  mainButton: { minHeight: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginTop: 8, elevation: 4, shadowColor: '#34d399', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10 },
  mainButtonText: { color: '#0f172a', fontWeight: 'bold', fontSize: sc(18) },
  
  loginContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 32 },
  loginText: { fontSize: sc(14) },
  loginLink: { fontWeight: 'bold', fontSize: sc(14) },
});
