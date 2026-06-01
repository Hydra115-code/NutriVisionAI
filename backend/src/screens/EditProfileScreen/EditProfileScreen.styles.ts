import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 40 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 },
  backBtn: { minHeight: 44, minWidth: 44, justifyContent: 'center' },
  backIconBox: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#ffffff15' },
  title: { fontSize: 22, fontWeight: 'bold' },
  
  avatarSection: { alignItems: 'center', marginBottom: 32 },
  avatarWrapper: { position: 'relative' },
  avatarGlow: { position: 'absolute', top: -5, left: -5, right: -5, bottom: -5, borderRadius: 50, opacity: 0.2, transform: [{ scale: 1.1 }] },
  avatarCircle: { width: 90, height: 90, borderRadius: 45, borderWidth: 3, padding: 3 },
  avatarFallback: { flex: 1, borderRadius: 45, justifyContent: 'center', alignItems: 'center' },
  avatarImage: { width: '100%', height: '100%', borderRadius: 45, resizeMode: 'cover' },
  avatarText: { fontSize: 24, fontWeight: 'bold' },

  formCard: { borderRadius: 24, padding: 24, borderWidth: 1, marginBottom: 24 },
  row: { flexDirection: 'row' },
  
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, marginBottom: 16, paddingHorizontal: 16, minHeight: 56, borderWidth: 1 },
  inputIcon: { marginRight: 12 },
  inputField: { flex: 1, fontSize: 16, paddingVertical: 12 },

  sectionSubtitle: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginTop: 8 },
  
  diabetesRow: { flexDirection: 'row', marginBottom: 16 },
  radioBtn: { flexDirection: 'row', alignItems: 'center', marginRight: 16, minHeight: 48, paddingHorizontal: 16, borderRadius: 16, borderWidth: 1 },
  radioText: { marginLeft: 8, fontSize: 16, fontWeight: '600' },
  
  tipoContainer: { marginBottom: 16 },
  gridTipos: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tipoTag: { borderWidth: 1, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 20, minHeight: 48, justifyContent: 'center' },
  tipoTagText: { fontSize: 14 },
  
  saveBtn: { minHeight: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginTop: 16, elevation: 4, shadowColor: '#34d399', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10 },
  saveBtnText: { color: '#0f172a', fontWeight: 'bold', fontSize: 18 },
});
