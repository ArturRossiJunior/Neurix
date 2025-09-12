import { colors } from './colors';
import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const createStyles = (isTablet: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  contentContainer: {
    // Aumentamos o padding para dar mais respiro aos componentes maiores
    paddingVertical: isTablet ? hp('8%') : hp('4%'),
    flexGrow: 1,
    justifyContent: 'center', // Essencial para centralizar na tela grande
  },
  
  content: {
    // Ocupa mais tela no tablet, com um limite máximo generoso
    width: isTablet ? wp('90%') : wp('90%'), 
    maxWidth: isTablet ? 1600 : 500, // Aumentado para telas de alta resolução
    alignSelf: 'center',
    gap: isTablet ? hp('6%') : hp('5%'), // Mais espaço entre o header e o grid
  },
  
  header: {
    alignItems: 'center',
    gap: isTablet ? hp('2%') : hp('1.5%'), // Aumenta o espaçamento do cabeçalho
  },
  
  // --- FONTES MAIORES ---
  welcomeText: {
    fontSize: isTablet ? wp('8%') : wp('7%'), // Aumentado de 4% para 5.5%
    fontWeight: '700',
    color: colors.foreground,
    textAlign: 'center',
  },
  
  subtitle: {
    fontSize: isTablet ? wp('2.5%') : wp('4%'), // Aumentado de 2% para 2.5%
    color: colors.mutedForeground,
    textAlign: 'center',
    lineHeight: isTablet ? hp('4%') : hp('3%'),
  },

  // --- GRID E CARDS MAIORES ---
  optionsGrid: {
    flexDirection: isTablet ? 'row' : 'column',
    flexWrap: isTablet ? 'wrap' : 'nowrap',
    justifyContent: 'center', // Centraliza os cards no container
    // Gap maior para dar mais espaço entre os cards grandes
    gap: isTablet ? wp('3%') : hp('2.5%'),
  },
  
  optionCard: {
    // Mantemos 2 colunas, mas o aumento do gap vai espaçá-las melhor
    width: isTablet ? '48%' : '100%', 
    // Aumento significativo na altura mínima para os cards ficarem bem maiores
    minHeight: isTablet ? hp('30%') : undefined,
  },
  
  cardContent: {
    flex: 1,
    justifyContent: 'space-around', // 'space-around' para distribuir melhor o conteúdo interno
    alignItems: 'center',
    // Mais padding interno para o conteúdo respirar
    padding: isTablet ? wp('3%') : wp('4%'),
  },
  
  cardTitle: {
    fontSize: isTablet ? wp('4%') : wp('5%'), // Aumentado de 2.5% para 3%
    fontWeight: '600',
    color: colors.foreground,
    textAlign: 'center',
  },
  
  cardDescription: {
    fontSize: isTablet ? wp('2.5%') : wp('3.5%'), // Aumentado de 1.8% para 2%
    color: colors.mutedForeground,
    textAlign: 'center',
    lineHeight: isTablet ? hp('2%') : hp('2.5%'),
    paddingHorizontal: wp('1%'),
  },
  
  actionButton: {
    // O botão vai parecer maior por causa do padding do seu componente
    // e do aumento geral do card. Mantemos a largura relativa.
    width: '85%',
    // Podemos adicionar um padding vertical maior no próprio componente do botão se necessário
    // Ex: paddingVertical: isTablet ? hp('2%') : hp('1.5%') (no estilo do componente Button)
    marginTop: hp('1%'),
  },
});