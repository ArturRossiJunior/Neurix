import React from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';

interface ChartFullscreenModalProps {
  visible: boolean;
  onClose: () => void;
  lineData: {
    labels: string[];
    datasets: {
      data: number[];
      color: (opacity?: number) => string;
      strokeWidth: number;
    }[];
  };
  chartConfig: object;
  segments: number;
}

export const ChartFullscreenModal = ({
  visible,
  onClose,
  lineData,
  chartConfig,
  segments,
}: ChartFullscreenModalProps) => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const isLandscape = screenWidth > screenHeight;

  const HEADER_H = 48;
  const LEGEND_H = 40;
  const PADDING = 8;
  const safeTop = insets.top;
  const safeBottom = insets.bottom;

  const minRequiredHeight = Math.max(180, segments * 35);

  const availableH = screenHeight - safeTop - safeBottom - HEADER_H - LEGEND_H - PADDING * 2;

  const chartH = Math.max(availableH, minRequiredHeight);
  const chartW = Math.max(
    screenWidth - PADDING * 2,
    lineData.labels.length * (isLandscape ? 80 : 60)
  );

  const fullscreenChartConfig = {
    ...chartConfig,
    backgroundColor: '#EDE9FE',
    backgroundGradientFrom: '#EDE9FE',
    backgroundGradientTo: '#EDE9FE',
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <StatusBar hidden />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>

        <View style={[styles.header, { height: HEADER_H }]}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            Evolução por Rodada
            {!isLandscape && (
              <Text style={styles.rotateHint}>   🔄 Gire o celular</Text>
            )}
          </Text>
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeBtn}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={styles.closeBtnText}>✕ Fechar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={true}
          style={styles.chartScroll}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={styles.chartContent}
            persistentScrollbar
          >
            <LineChart
              data={lineData}
              width={chartW}
              height={chartH}
              chartConfig={fullscreenChartConfig}
              bezier
              fromZero
              segments={segments}
              yAxisInterval={1}
              withShadow={false}
              style={{ borderRadius: 12 }}
            />
          </ScrollView>
        </ScrollView>

        <View style={[styles.legend, { height: LEGEND_H }]}>
          {[
            { label: 'Corretos', color: 'rgba(76, 175, 80, 1)' },
            { label: 'Incorretos', color: 'rgba(244, 67, 54, 1)' },
            { label: 'Omissões', color: 'rgba(255, 152, 0, 1)' },
          ].map(item => (
            <View key={item.label} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: item.color }]} />
              <Text style={styles.legendText}>{item.label}</Text>
            </View>
          ))}
        </View>

      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 8,
  },
  headerTitle: {
    flex: 1,
    color: '#1E293B',
    fontSize: 15,
    fontWeight: '700',
  },
  rotateHint: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '400',
    fontStyle: 'italic',
  },
  closeBtn: {
    backgroundColor: '#A78BFA',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    flexShrink: 0,
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  chartScroll: {
    flex: 1,
  },
  chartContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    color: '#475569',
    fontSize: 13,
  },
});
