import { StyleSheet } from 'react-native';

export const makeStyles = (sc: (n: number) => number) => StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 40 },
  headerContainer: { marginBottom: 32 },
  headerSubtitle: { fontSize: sc(16), fontWeight: '600', marginBottom: 4, letterSpacing: 0.5 },
  headerTitle: { fontSize: sc(32), fontWeight: 'bold' },

  recommendationCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  zapBg: { position: 'absolute', top: -10, right: -10 },
  recContent: { flexDirection: 'row', gap: 16, zIndex: 1 },
  recIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  recTextContainer: { flex: 1 },
  recTitle: { fontSize: sc(16), fontWeight: 'bold', marginBottom: 4 },
  recDesc: { fontSize: sc(12), lineHeight: 18 },

  uploadBox: {
    borderRadius: 40,
    borderWidth: 2,
    borderStyle: 'dashed',
    padding: 32,
    marginBottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIconBox: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  uploadTitle: { fontSize: sc(24), fontWeight: 'bold', marginBottom: 12 },
  uploadSubtitle: { fontSize: sc(14), textAlign: 'center', paddingHorizontal: 20 },

  actionButtonsRow: { flexDirection: 'row', gap: 16, marginBottom: 40 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 20, gap: 10 },
  actionBtnText: { fontSize: sc(16), fontWeight: '700' },

  cameraSection: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  imageContainer: { position: 'relative' },
  foodImage: { width: '100%', height: 280, resizeMode: 'cover' },
  retakeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 4,
  },

  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: { fontSize: sc(18), fontWeight: 'bold', marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gridItem: { flex: 1, minWidth: '45%', padding: 16, borderRadius: 16, borderWidth: 1 },
  gridLabel: { fontSize: sc(12), marginBottom: 4 },
  gridValue: { fontSize: sc(20), fontWeight: 'bold' },

  itemDetail: { borderTopWidth: 1, paddingTop: 16, marginTop: 16 },
  itemTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 12 },
  idBox: { width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  idText: { color: '#fff', fontWeight: 'bold', fontSize: sc(14) },
  itemName: { fontSize: sc(18), fontWeight: 'bold', flex: 1 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statBox: { flex: 1 },
  statLabel: { fontSize: sc(11), marginBottom: 4 },
  statValue: { fontSize: sc(14), fontWeight: 'bold' },

  saveButton: {
    flexDirection: 'row',
    minHeight: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    gap: 12,
  },
  saveButtonText: { color: '#0f172a', fontWeight: 'bold', fontSize: sc(18) },

  // Resumen Diario / Progress
  dailySummaryCard: {
    borderRadius: 24,
    padding: 24,
    marginTop: 12,
    borderWidth: 1,
  },
  dailySummaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  quickStatsLabel: { fontSize: sc(12) },
  
  circularProgressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  circularProgressInner: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  caloriesValue: {
    fontSize: sc(36),
    fontWeight: '800',
  },
  caloriesLabel: {
    fontSize: sc(14),
    marginTop: 4,
  },
  
  macroRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  macroItem: {
    alignItems: 'center',
    flex: 1,
  },
  macroCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
  },
  macroValue: {
    fontSize: sc(16),
    fontWeight: '700',
  },
  macroLabel: {
    fontSize: sc(12),
  },
});
