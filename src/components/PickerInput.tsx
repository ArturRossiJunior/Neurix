import React, { useRef } from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface PickerInputProps {
  selectedValue: any;
  onValueChange: (value: any) => void;
  enabled?: boolean;
  containerStyle?: ViewStyle | ViewStyle[];
  pickerStyle?: ViewStyle;
  children: React.ReactNode;
}

const PickerInput = ({
  selectedValue,
  onValueChange,
  enabled = true,
  containerStyle,
  pickerStyle,
  children,
}: PickerInputProps) => {
  const pickerRef = useRef<any>(null);

  const handlePress = () => {
    if (enabled && pickerRef.current) {
      pickerRef.current.focus();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={1}
      style={[{ justifyContent: 'center' }, containerStyle]}
      disabled={!enabled}
    >
      <View pointerEvents="none">
        <Picker
          ref={pickerRef}
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          enabled={enabled}
          style={pickerStyle}
        >
          {children}
        </Picker>
      </View>
    </TouchableOpacity>
  );
};

export default PickerInput;
