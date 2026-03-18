import React from 'react';
import { Tabs } from 'expo-router';
import { TabIcon } from '../../components/ui/icon-symbol';
import { useColors } from '../../hooks/use-colors';

export default function TabsLayout() {
  const colors = useColors();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '账单',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="house"
              focusedName="house.fill"
              focused={focused}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: '记账',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="plus.circle"
              focusedName="plus.circle.fill"
              focused={focused}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: '统计',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="chart.bar"
              focusedName="chart.bar.fill"
              focused={focused}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}