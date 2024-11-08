import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function TabLayout() {
  const colorScheme = 'dark'; // Set to 'dark' explicitly

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        headerShown: false, // Hide header for tabs
        tabBarStyle: {
          backgroundColor: Colors[colorScheme].background, // Ensure dark background for tab bar
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="driver"
        options={{
          title: 'Driver',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'car' : 'car-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="rider"
        options={{
          title: 'Rides',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'flash' : 'flash-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
