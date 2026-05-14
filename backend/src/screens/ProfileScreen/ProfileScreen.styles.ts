import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 40 },
  headerMinimal: { alignItems: 'center', marginTop: 24, marginBottom: 40 },
  avatarWrapper: { position: 'relative', marginBottom: 24 },
  avatarGlow: { position: 'absolute', top: -10, left: -10, right: -10, bottom: -10, borderRadius: 100, opacity: 0.2, transform: [{ scale: 1.1 }] },
  avatarCircle: { width: 112, height: 112, borderRadius: 56, borderWidth: 4, padding: 4 },
  avatarFallback: { flex: 1, borderRadius: 56, justifyContent: 'center', alignItems: 'center' },
  avatarImage: { width: '100%', height: '100%', borderRadius: 56, resizeMode: 'cover' },
  avatarText: { fontSize: 32, fontWeight: 'bold' },
  userName: { fontSize: 28, fontWeight: 'bold', marginBottom: 4 },
  userSub: { fontSize: 14 },
  
  alertCard: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 32, marginBottom: 32, borderWidth: 1, gap: 16 },
  alertIconBox: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  alertLabel: { fontSize: 10, fontWeight: 'bold', letterSpacing: 1.5, marginBottom: 2 },
  alertValue: { fontSize: 18, fontWeight: 'bold' },

  glassCard: { borderRadius: 24, borderWidth: 1, marginBottom: 32, overflow: 'hidden' },
  gridRow: { flexDirection: 'row' },
  gridItem3: { flex: 1, padding: 24, alignItems: 'center' },
  gridItem2: { flex: 1, flexDirection: 'row', padding: 24, alignItems: 'center', justifyContent: 'center', gap: 16 },
  iconCenter: { marginBottom: 8 },
  iconBoxSm: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  statLabel: { fontSize: 10, fontWeight: 'bold', letterSpacing: 1, color: '#94a3b8', marginBottom: 4, textAlign: 'center' },
  statValue: { fontSize: 14, fontWeight: 'bold', textAlign: 'center' },

  themeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  themeLabel: { flex: 1, marginLeft: 12, fontSize: 16, fontWeight: '600' },

  buttonContainer: { gap: 16 },
  primaryBtn: { flexDirection: 'row', minHeight: 64, borderRadius: 20, justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#34d399', shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  primaryBtnText: { fontWeight: 'bold', marginLeft: 12, fontSize: 16 },
  secondaryBtn: { minHeight: 64, borderRadius: 32, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  secondaryBtnText: { fontWeight: 'bold', fontSize: 16 },
  logoutBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, paddingVertical: 16 },
  logoutBtnText: { fontSize: 14 },
});
