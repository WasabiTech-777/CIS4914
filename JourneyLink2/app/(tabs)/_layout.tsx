import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Driver from './driver'; // Adjust the path as necessary
import DriverForm from '../auth/driverform'; // Import the DriverForm component
import { useAuth } from '../../hooks/useAuth'; // Assuming this hook provides user context
import { getDriverStatus } from '@/services/driverService'; // Import your driver eligibility logic

const Stack = createNativeStackNavigator();

const DriverStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Driver"
        component={Driver}
        options={{ title: 'Driver' }} // Title for the Driver screen
      />
      <Stack.Screen
        name="DriverForm"
        component={DriverForm}
        options={{ title: 'Driver Form' }} // Title for the DriverForm screen
      />
    </Stack.Navigator>
  );
};

export default function TabLayout() {
  const colorScheme = 'dark'; // Set to 'dark' explicitly
  const { user } = useAuth(); // Get the user context
  const [isEligible, setIsEligible] = useState(false); // State to manage eligibility

  useEffect(() => {
    async function checkDriverEligibility() {
      const eligible = await getDriverStatus(); // Check if the driver is eligible
      setIsEligible(eligible);
    }

    checkDriverEligibility();
  }, []);

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
        component={DriverStack} // Use the component prop to specify DriverStack
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
