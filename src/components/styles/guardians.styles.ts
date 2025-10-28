import { colors } from './colors';
import { shadows } from './shadows';
import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const createStyles = (isTablet: boolean) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    centralizer: {
      justifyContent: 'center',
      alignItems: 'center',
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: isTablet ? wp('4%') : wp('5%'),
      paddingTop: isTablet ? hp('4%') : hp('7%'),
      paddingBottom: isTablet ? hp('0.5%') : hp('3%'),
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.outlineBorder,
    },

    backButton: {
      width: isTablet ? hp('6%') : hp('5%'),
      height: isTablet ? hp('6%') : hp('5%'),
      borderRadius: isTablet ? hp('3%') : hp('2.5%'),
      backgroundColor: colors.secondary,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadows.shadowDefault,
    },

    errorBorder: {
      borderColor: 'red',
      borderWidth: 1.5,
      borderRadius: isTablet ? 16 : 12,
    },

    backButtonText: {
      fontSize: isTablet ? wp('7%') : wp('5%'),
      fontWeight: '600',
      color: colors.foreground,
      marginTop: isTablet ? wp('-1.5%') : wp('5%'),
    },

    headerTitle: {
      fontSize: isTablet ? wp('8%') : wp('6%'),
      fontWeight: '700',
      color: colors.foreground,
      textAlign: 'center',
    },

    headerSpacer: {
      width: isTablet ? hp('3%') : hp('5%'),
    },

    searchSection: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: isTablet ? wp('4%') : wp('5%'),
      paddingVertical: isTablet ? hp('2%') : hp('2.5%'),
      gap: isTablet ? wp('3%') : wp('3%'),
    },

    searchContainer: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: isTablet ? 16 : 12,
      borderWidth: 1,
      borderColor: colors.outlineBorder,
      ...shadows.shadowDefault,
    },

    searchInput: {
      paddingHorizontal: isTablet ? wp('3%') : wp('3%'),
      paddingVertical: isTablet ? hp('1.8%') : hp('2%'),
      fontSize: isTablet ? wp('3.5%') : wp('4%'),
      color: colors.foreground,
    },

    // --- Estilo do Botão de Filtro Atualizado ---
    filterButton: {
      width: isTablet ? hp('6%') : hp('5.5%'),
      height: isTablet ? hp('6%') : hp('5.5%'),
      borderRadius: isTablet ? 16 : 12,
      backgroundColor: colors.card, // Alterado de colors.primary
      borderWidth: 1, // Adicionado
      borderColor: colors.outlineBorder, // Adicionado
      alignItems: 'center',
      justifyContent: 'center',
      ...shadows.shadowDefault,
    },

    // --- Estilo do Texto do Botão de Filtro Atualizado ---
    filterButtonText: {
      fontSize: isTablet ? wp('4%') : wp('4.5%'),
      color: colors.foreground, // Alterado de colors.primaryForeground
    },

    guardianCreationSection: {
      paddingHorizontal: isTablet ? wp('4%') : wp('5%'),
      paddingBottom: isTablet ? hp('2%') : hp('2.5%'),
    },

    guardianActions: {
      marginLeft: isTablet ? wp('3%') : wp('3%'),
    },

    viewButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: isTablet ? wp('4%') : wp('4%'),
      paddingVertical: isTablet ? hp('1.2%') : hp('1.5%'),
      borderRadius: isTablet ? 12 : 10,
      ...shadows.shadowDefault,
    },

    viewButtonText: {
      fontSize: isTablet ? wp('3%') : wp('3.5%'),
      fontWeight: '600',
      color: colors.primaryForeground,
    },

    guardianCreationButton: {
      width: '100%',
      paddingVertical: isTablet ? hp('2%') : hp('2.2%'),
    },

    editGuardianButton: {
      alignSelf: 'flex-start',
      paddingVertical: isTablet ? hp('1.5%') : hp('2%'),
      paddingHorizontal: isTablet ? wp('2.5%') : wp('4%'),
    },

    listContainer: {
      flex: 1,
      paddingHorizontal: isTablet ? wp('4%') : wp('5%'),
      paddingTop: isTablet ? wp('3%') : wp('0%'),
    },

    guardiansList: {
      gap: isTablet ? hp('1.5%') : hp('2%'),
      paddingBottom: isTablet ? hp('3%') : hp('4%'),
    },

    guardianCard: {
      marginVertical: 0,
      padding: isTablet ? wp('4%') : wp('4%'),
      borderRadius: isTablet ? 20 : 16,
      ...shadows.shadowMedium,
    },

    guardianCardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    guardianInfo: {
      flex: 1,
      gap: isTablet ? hp('1%') : hp('1.2%'),
    },

    guardianHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: isTablet ? hp('0.5%') : hp('0.8%'),
    },

    guardianName: {
      fontSize: isTablet ? wp('4%') : wp('4.5%'),
      fontWeight: '600',
      color: colors.foreground,
      flex: 1,
      paddingBottom: isTablet ? wp('2%') : wp('0%'),
    },

    statusBadge: {
      paddingHorizontal: isTablet ? wp('2.5%') : wp('3%'),
      paddingVertical: isTablet ? hp('0.5%') : hp('0.6%'),
      borderRadius: isTablet ? 12 : 10,
      marginLeft: isTablet ? wp('2%') : wp('2%'),
    },

    statusText: {
      fontSize: isTablet ? wp('2.5%') : wp('3%'),
      fontWeight: '600',
      color: colors.primaryForeground,
    },

    guardianDetails: {
      gap: isTablet ? hp('0.3%') : hp('0.5%'),
    },

    guardianInput: {
      fontSize: isTablet ? wp('3%') : wp('3.5%'),
      color: colors.mutedForeground,
    },

    guardianCreationMargin: {
      marginBottom: isTablet ? wp('2%') : wp('3%'),
      marginTop: isTablet ? wp('2%') : wp('3%'),
      fontWeight: '600',
    },

    guardianLastTest: {
      fontSize: isTablet ? wp('3%') : wp('3.5%'),
      color: colors.mutedForeground,
    },

    guardianTestsCount: {
      fontSize: isTablet ? wp('3%') : wp('3.5%'),
      color: colors.mutedForeground,
    },

    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: isTablet ? wp('10%') : wp('8%'),
      gap: isTablet ? hp('2%') : hp('2.5%'),
    },

    emptyStateTitle: {
      fontSize: isTablet ? wp('4.5%') : wp('5%'),
      fontWeight: '600',
      color: colors.foreground,
      textAlign: 'center',
    },

    emptyStateDescription: {
      fontSize: isTablet ? wp('3%') : wp('4%'),
      color: colors.mutedForeground,
      textAlign: 'center',
      lineHeight: isTablet ? hp('2.5%') : hp('3%'),
    },

    emptyStateButton: {
      marginTop: isTablet ? hp('1%') : hp('1.5%'),
      paddingHorizontal: isTablet ? wp('8%') : wp('10%'),
    },

    // --- Novos Estilos do Modal (Copiados de patients.styles.ts) ---
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },

    modalContent: {
      width: isTablet ? wp('75%') : wp('90%'),
      maxWidth: isTablet ? 700 : 400,
      backgroundColor: colors.card,
      borderRadius: isTablet ? 20 : 16,
      padding: isTablet ? wp('3%') : wp('5%'),
      ...shadows.shadowMedium,
    },

    modalTitle: {
      fontSize: isTablet ? wp('3%') : wp('5.5%'),
      fontWeight: 'bold',
      marginBottom: isTablet ? hp('2%') : hp('2.5%'),
      color: colors.foreground,
      textAlign: 'center',
    },

    filterOption: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: isTablet ? hp('1%') : hp('1.5%'),
    },

    filterLabel: {
      fontSize: isTablet ? wp('2.2%') : wp('4%'),
      color: colors.foreground,
    },

    filterSectionTitle: {
      fontSize: isTablet ? wp('2.5%') : wp('4%'),
      fontWeight: '600',
      color: colors.mutedForeground,
      marginTop: isTablet ? hp('2%') : hp('2.5%'),
      marginBottom: isTablet ? hp('1%') : hp('1.5%'),
      borderBottomWidth: 1,
      borderBottomColor: colors.outlineBorder,
      paddingBottom: isTablet ? hp('0.5%') : hp('0.8%'),
    },

    filterInputContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: isTablet ? wp('2%') : wp('3%'),
    },

    filterInput: {
      flex: 1,
      backgroundColor: colors.background,
      borderColor: colors.outlineBorder,
      borderWidth: 1,
      borderRadius: isTablet ? 12 : 10,
      paddingVertical: isTablet ? hp('1.2%') : hp('1.5%'),
      paddingHorizontal: isTablet ? wp('3%') : wp('4%'),
      fontSize: isTablet ? wp('2.2%') : wp('3.5%'),
      color: colors.foreground,
    },

    sortContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: isTablet ? wp('1.5%') : wp('2%'),
    },

    sortButton: {
      backgroundColor: colors.card,
      borderColor: colors.primary,
      borderWidth: 1,
      borderRadius: isTablet ? 12 : 20,
      paddingVertical: isTablet ? hp('0.8%') : hp('1%'),
      paddingHorizontal: isTablet ? wp('2.5%') : wp('3%'),
    },

    sortButtonSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },

    sortButtonText: {
      fontSize: isTablet ? wp('2%') : wp('3%'),
      color: colors.primary,
      fontWeight: '500',
    },

    sortButtonTextSelected: {
      color: colors.primaryForeground,
      fontWeight: '600',
    },
    // --- Fim dos Novos Estilos do Modal ---
  });
};