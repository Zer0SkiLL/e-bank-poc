import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Spacing, BorderRadius, Typography } from '../constants';

interface ChartDataPoint {
  date: string;
  value: number;
}

interface CustomBarChartProps {
  data: ChartDataPoint[];
  height?: number;
}

const MONTH_ABBREVS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const CustomBarChart: React.FC<CustomBarChartProps> = ({ data, height = 160 }) => {
  const { colors } = useTheme();

  if (!data || data.length === 0) {
    return null;
  }

  const values = data.map((d) => d.value);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const range = maxValue - minValue || 1;

  const getMonthLabel = (dateStr: string): string => {
    const date = new Date(dateStr);
    return MONTH_ABBREVS[date.getMonth()];
  };

  return (
    <View style={[styles.container, { height: height + 30 }]}>
      <View style={[styles.chartArea, { height }]}>
        {data.map((item, index) => {
          const normalizedHeight = ((item.value - minValue) / range) * (height - 20) + 10;
          const barWidth = Math.max(24, (100 / data.length) - 4);

          return (
            <View key={index} style={[styles.barWrapper, { width: `${100 / data.length}%` }]}>
              <View style={[styles.barContainer, { height }]}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: normalizedHeight,
                      backgroundColor: colors.primary,
                      width: barWidth,
                      opacity: index === data.length - 1 ? 1 : 0.6,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                {getMonthLabel(item.date)}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.sm,
  },
  chartArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.xs,
  },
  barWrapper: {
    alignItems: 'center',
  },
  barContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    borderRadius: BorderRadius.sm,
    minHeight: 8,
  },
  label: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.medium,
    marginTop: Spacing.xs,
  },
});

export default CustomBarChart;
