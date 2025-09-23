import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { commonStyles } from '../styles/common.styles';

export const dashboardStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: commonStyles.padding.padding,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  patientSelectorContainer: {
    marginBottom: 20,
  },
  patientSelectorLabel: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.outlineBorder,
    paddingHorizontal: 10,
  },
  chartContainer: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
  },
  noDataText: {
    textAlign: 'center',
    color: colors.text,
    fontSize: 16,
    marginTop: 20,
  },
});

