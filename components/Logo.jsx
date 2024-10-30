import Svg, { Circle, Text } from "react-native-svg";

export const Logo = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={176} height={40} viewBox="0 0 300 100" {...props}>
    {/* Outer Yellow Circle */}
    <Circle cx="50" cy="50" r="48" fill="#FFCC33" />

    {/* Inner Black Circle */}
    <Circle cx="50" cy="50" r="40" fill="#000000" />

    {/* Letter 'M' in the Circle */}
    <Text x="50" y="68" fontFamily="Arial" fontSize="60" fontWeight="bold" textAnchor="middle" fill="#FFFFFF">M</Text>

    {/* "Minguard" Text */}
    <Text x="110" y="70" fontFamily="Arial" fontSize="36" fontWeight="normal" fill="white" >Minguard</Text>
  </Svg>
);
