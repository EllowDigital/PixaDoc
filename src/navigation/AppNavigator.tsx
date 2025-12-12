import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import HomeScreen from '../screens/HomeScreen';
import ImageEditorScreen from '../screens/ImageEditorScreen';
import ImagePickerScreen from '../screens/ImagePickerScreen';
import ImageReorderScreen from '../screens/ImageReorderScreen';
import PdfPreviewScreen from '../screens/PdfPreviewScreen';

export type RootStackParamList = {
  Home: undefined;
  ImagePicker: undefined;
  ImageReorder: undefined;
  ImageEditor: { imageId: string };
  PdfPreview: { uri: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#f8fafc',
  },
};

const screenOptions = {
  headerStyle: { backgroundColor: '#0f172a' },
  headerTintColor: '#f8fafc',
  headerTitleStyle: { fontWeight: '600' },
  headerBackTitleVisible: false,
};

const AppNavigator = () => (
  <NavigationContainer theme={navTheme}>
    <Stack.Navigator initialRouteName="Home" screenOptions={screenOptions}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'PixaDoc' }} />
      <Stack.Screen name="ImagePicker" component={ImagePickerScreen} options={{ title: 'Pick Images' }} />
      <Stack.Screen name="ImageReorder" component={ImageReorderScreen} options={{ title: 'Arrange Pages' }} />
      <Stack.Screen name="ImageEditor" component={ImageEditorScreen} options={{ title: 'Edit Image' }} />
      <Stack.Screen name="PdfPreview" component={PdfPreviewScreen} options={{ title: 'Preview PDF' }} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
