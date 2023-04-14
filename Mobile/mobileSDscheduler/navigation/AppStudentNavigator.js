import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import AccountStudentScreen from "../app/screens/AccountProfessorScreen";
import CalendarStudentScreen from "../app/screens/CalendarStudentScreen";
import HomeStudentScreen from "../app/screens/HomeStudentScreen";
import styles from "../app/config/styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const TabArr = [
  {
    route: "Calendar",
    iconActive: "calendar-clock",
    iconInactive: "calendar-clock-outline",
    component: CalendarStudentScreen,
  },
  {
    route: "Home",
    iconActive: "home",
    iconInactive: "home-outline",
    component: HomeStudentScreen,
  },
  {
    route: "Account",
    iconActive: "account-circle",
    iconInactive: "account-circle-outline",
    component: AccountStudentScreen,
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
