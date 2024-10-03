import { Tabs } from 'expo-router';
import React, {useEffect, useState} from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
// Remove useColorScheme if we want to force dark mode.
// import { useColorScheme } from '@/hooks/useColorScheme';
import { getDriverStatus } from '@/services/driverService'; // Import the driver service
export default function TabLayout() {
  // Force dark mode
  const colorScheme = 'dark';  // Set to 'dark' explicitly
  const [isDriverEligible, setIsDriverEligible] = useState(false);

  useEffect(() => {
    // Check if user has completed driver information
    async function checkDriverEligibility() {
      const eligible = await getDriverStatus();  // Fetch driver eligibility from Firestore
      setIsDriverEligible(eligible);
    }

    checkDriverEligibility();
  }, []);
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme].background,  // Ensure dark background for tab bar
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
        name={isDriverEligible ? 'driver' : 'driverForm'} 
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
          title:'Rides',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'flash' : 'flash-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title:'Account',  
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
