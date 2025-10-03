import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

interface IStepIndicator{
    currentStep: number;
}
const StepIndicator = ({ currentStep }:IStepIndicator) => {
    const animatedValues = useRef([new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]).current

    useEffect(() => {
        animatedValues.forEach((animatedValue, index) => {
            Animated.timing(animatedValue, {
                toValue: currentStep === index + 1 ? 1 : 0,
                duration: 300,
                useNativeDriver: false,
            }).start()
        })
    }, [currentStep])

    return (
        <View style={{flexDirection:"row",gap:5}}>
            {[1, 2, 3].map((step, index) => {
                const width = animatedValues[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [15, 20],
                })

                const backgroundColor = animatedValues[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: ['#D0D5DD', '#020B12'],
                })

                return (
                    <Animated.View
                        key={step}
                        style={{
                            width,
                            height: 4,
                            backgroundColor,
                            borderRadius: 2,
                        }}
                    />
                )
            })}
        </View>
    )
}

export default StepIndicator
