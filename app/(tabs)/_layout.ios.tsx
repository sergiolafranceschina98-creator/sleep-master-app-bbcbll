
import React from 'react';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger key="home" name="(home)">
        <Icon sf="moon.stars.fill" />
        <Label>Sleep</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
