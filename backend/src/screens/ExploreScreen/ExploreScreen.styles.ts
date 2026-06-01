import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 40 },
  mainTitle: { fontSize: 32, fontWeight: 'bold', marginBottom: 32, marginTop: 16 },

  glassCard: { borderRadius: 24, borderWidth: 1, padding: 24, marginBottom: 32, overflow: 'hidden' },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 24 },

  overviewContainer: { flexDirection: 'row', alignItems: 'center', gap: 24 },
  pieContainer: { position: 'relative', width: 140, height: 140 },
  pieCenterBox: { position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  pieCenterTitle: { fontSize: 14, fontWeight: 'bold', marginTop: 4 },
  pieCenterSub: { fontSize: 10 },
  pieCenterPercent: { fontSize: 18, fontWeight: 'bold', marginTop: 4 },
  
  macroList: { flex: 1, gap: 20 },
  macroRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  macroIconBox: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  macroTextCol: { flex: 1 },
  macroHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  macroName: { fontSize: 14, fontWeight: 'bold' },
  macroPct: { fontSize: 10, fontWeight: 'bold' },
  macroData: { fontSize: 10 },

  barChartContainer: { flex: 1, minHeight: 200 },
  barsArea: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 8 },
  barColumn: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', marginHorizontal: 4 },
  barWrapper: { width: 24, height: '100%', borderRadius: 12, justifyContent: 'flex-end', overflow: 'hidden' },
  barFillInner: { width: '100%', borderRadius: 12 },
  dayText: { fontSize: 10, marginTop: 12 },

  weeklyFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, paddingTop: 24, borderTopWidth: 1 },
  weeklyFooterText: { fontSize: 12 },
  viewMoreText: { fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
});
