import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Router } from '@/services/router';
import { useEffect } from 'react';

export default function NotFoundScreen() {

  const params = useLocalSearchParams();

  useEffect(() => {
    Router.push("/(tabs)/mainApp")
  }, [])
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title">This screen does not exist.</ThemedText>
        <TouchableOpacity onPress={() => Router.back()} style={styles.link}>
          <ThemedText type="link">Go Back !</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
