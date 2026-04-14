import { colors } from './colors';
import { shadows } from './shadows';
import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const createScreenHeaderStyles = (isTablet: boolean) => {
    return StyleSheet.create({
        header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: isTablet ? wp('4%') : wp('5%'),
        paddingTop: isTablet ? hp('3%') : hp('5%'),
        paddingBottom: isTablet ? hp('0.5%') : hp('0.5%'),
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
        editButton: {
        alignSelf: 'flex-start',
        paddingVertical: isTablet ? hp('1.5%') : hp('1.5%'),
        paddingHorizontal: isTablet ? wp('2.5%') : wp('4%'),
        },
    });
};