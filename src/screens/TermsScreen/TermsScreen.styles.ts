import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 50 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 },
  backBtn: { minHeight: 44, minWidth: 44, justifyContent: 'center' },
  backIconBox: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#ffffff15' },
  title: { fontSize: 22, fontWeight: 'bold' },
  
  card: { borderRadius: 24, padding: 24, borderWidth: 1, marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 24, marginBottom: 12 },
  paragraph: { fontSize: 14, lineHeight: 24 },
  updateDate: { fontSize: 12, marginTop: 40, textAlign: 'center', fontStyle: 'italic' },
  
  closeButton: { minHeight: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginTop: 8, elevation: 4, shadowColor: '#34d399', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10 },
  closeButtonText: { color: '#0f172a', fontWeight: 'bold', fontSize: 18 },
});
