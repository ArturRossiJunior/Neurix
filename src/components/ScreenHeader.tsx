import { Button } from './Button'; 
import React, { useMemo } from 'react'; 
import { colors } from './styles/colors'; 
import { View, TouchableOpacity } from 'react-native';
import { createScreenHeaderStyles } from './styles/screenHeader.styles'; 
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface ScreenHeaderProps {
  onBackPress: () => void;
  isTablet: boolean;
  actionText?: string;
  onActionPress?: () => void;
}

export const ScreenHeader = ({ 
  onBackPress, 
  isTablet,
  actionText, 
  onActionPress 
}: ScreenHeaderProps) => {

  const styles = useMemo(() => createScreenHeaderStyles(isTablet), [isTablet]);
  
  return (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={onBackPress}
      >
        <MaterialCommunityIcons 
          name="arrow-u-left-bottom"
          size={isTablet ? 34 : 22}
          color={colors.text}
        />
      </TouchableOpacity>

      {actionText && onActionPress && (
        <Button 
          variant="soft"
          size="default" 
          style={styles.editButton}
          onPress={onActionPress}
        > 
          {actionText}
        </Button>
      )}
    </View>
  );
};

export default ScreenHeader;