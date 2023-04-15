import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import AccountScreen from "../app/screens/AccountScreen";
import CalendarScreen from "../app/screens/CalendarScreen";
import HomeScreen from "../app/screens/HomeScreen";
import styles from "../app/config/styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const TabArr = [
  {
    route: "Calendar",
    iconActive: "calendar-clock",
    iconInactive: "calendar-clock-outline",
    component: CalendarScreen,
  },
  {
    route: "Home",
    iconActive: "home",
    iconInactive: "home-outline",
    component: HomeScreen,
  },
  {
    route: "Account",
    iconActive: "account-circle",
    iconInactive: "account-circle-outline",
    component: AccountScreen,
  },
];

const AppNavigator = () => (
  <Tab.Navigator
    initialRouteName="Home"
    screenOptions={{
      headerShown: false,
      keyboardHidesTabBar: true,
      tabBarInactiveBackgroundColor: styles.colors.gold,
      tabBarActiveBackgroundColor: styles.colors.gold,
      tabBarActiveTintColor: styles.colors.grayDark,
      tabBarInactiveTintColor: styles.colors.grayMedium,
    }}
  >
    {TabArr.map((_, index) => {
      return (
        <Tab.Screen
          key={index}
          name={_.route}
          component={_.component}
          options={{
            tabBarLabel: _.route,
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons
                name={focused ? _.iconActive : _.iconInactive}
                color={color}
                size={focused ? 30 : 24}
                //style={{ backgroundColor: "red" }}
              />
            ),
            tabBarLabelStyle: { fontSize: 12 },
          }}
        />
      );
    })}
  </Tab.Navigator>
);

export default AppNavigator;
