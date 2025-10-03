import React from 'react';
import { Image, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SplashScreen() {
  return (
    <>
      <SafeAreaView
      edges={['bottom']}
      style={{
        flex: 1,
       backgroundColor:"#0E80CE"
      }}
    >
   <View
     style={{
      flex: 1,
      backgroundColor: '#0E80CE',
     }}
>
     <View style={{backgroundColor:"#0E80CE",height:"100%",justifyContent:"center",alignItems:"center"}}>
        <Image
          source={require('../../assets/images/splash-icon.png')}
          resizeMode="contain"
        />
        <Text style={{fontSize:16,fontWeight:"600",color:"#fff",position:"absolute",bottom:30}}>.....Bank on your skill</Text>
      </View>
    </View>
      <StatusBar backgroundColor="#0E80CE" barStyle={"light-content"} /></SafeAreaView>
    </>
  );
}