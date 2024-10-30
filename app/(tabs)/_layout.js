import { Tabs } from "expo-router";
import { View } from "react-native";

import { HomeIcon , InfoIcon , LoginIcon } from "../../components/Icons";

export default function TabsLayout() {
    return(
        <Tabs
            screenOptions = {{
                headerShown: false,
                tabBarStyle: { backgroundColor: "black" },
                tabBarActiveTintColor: "yellow",

            }}
        >
            <Tabs.Screen 
                name="index"
                options={{
                    title: "Inicio",
                    tabBarIcon: HomeIcon
                }}
            />
            <Tabs.Screen 
                name="about"
                options={{
                    title: "Acerca",
                    tabBarIcon: InfoIcon
                }}
            />
            <Tabs.Screen
                name="overview"
                options={{
                    title: "over",
                    tabBarIcon: LoginIcon
                }}
            />
            <Tabs.Screen
                name="ReportIncident"
                options={{
                    title: "Report",
                    tabBarIcon: LoginIcon
                }}
            />
            <Tabs.Screen
                name="Tickets"
                options={{
                    title: "Tickets",
                    tabBarIcon: LoginIcon
                }}
            />
            <Tabs.Screen
                name="Historialincidente"
                options={{
                    title: "Historial",
                    tabBarIcon: LoginIcon
                }}
            />
        </Tabs>
    );
}