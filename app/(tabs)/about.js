import { Pressable, ScrollView , Text } from "react-native";
import { Link } from "expo-router";
import { HomeIcon } from "../../components/Icons";
import {styled} from "nativewind";
import { Screen } from "../../components/Screen";

const StyledPressable = styled(Pressable);

export default function About() {
    return (
        <Screen>
            <ScrollView className = "pt-24 bg-black">
                <Link asChild href="/Main.jsx" >
                    <StyledPressable className={`active:opacity-80`}>
                    <HomeIcon/>
                    </StyledPressable>
                </Link>

                <Text className="text-white font-bold mb-8 text-2xl">
                    Sobre El Proyecto 
                </Text>

                <Text className="text-white text-white/90 mb-4">
                    This is a simple app that uses React Native Web to 
                    render the same code on the web and on mobile devices.
                </Text>

                <Link asChild href="/overview" >
                    <StyledPressable className={`active:opacity-80`}>
                    <HomeIcon/>
                    </StyledPressable>
                </Link>
                
            </ScrollView>
        </Screen>
    );

}