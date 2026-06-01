import { StyleSheet } from 'react-native';
import { Colors } from '../../constants/theme';

export const makeStyles = (sc: (n: number) => number) => StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    paddingTop: 10,
    marginBottom: 20,
  },
  accessibilityIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContainer: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  iconBox: {
    width: 96,
    height: 96,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: sc(32),
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: sc(16),
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  featuresContainer: {
    marginBottom: 40,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  featureIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: sc(16),
    fontWeight: '700',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: sc(14),
  },
  buttonContainer: {
    width: '100%',
    marginTop: 'auto',
  },
  primaryButton: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    flexDirection: 'row',
  },
  primaryButtonText: {
    fontSize: sc(18),
    fontWeight: '700',
    color: '#0f172a',
    marginRight: 8,
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: sc(15),
  },
  loginLink: {
    fontSize: sc(15),
    fontWeight: '700',
  },
});
