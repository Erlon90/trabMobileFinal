import React, { useState } from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AppProvider, useApp } from './context/AppContext';
import BottomNav from './components/BottomNav';
import HomeScreen from './screens/HomeScreen';
import ServicesScreen from './screens/ServicesScreen';
import NewsListScreen from './screens/NewsListScreen';
import ProfileScreen from './screens/ProfileScreen';
import NewsDetailScreen from './screens/NewsDetailScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import TrashCollectionScreen from './screens/TrashCollectionScreen';
import UrbanIssuesScreen from './screens/UrbanIssuesScreen';
import AppointmentScreen from './screens/AppointmentScreen';
import PollsScreen from './screens/PollsScreen';

const Stack = createNativeStackNavigator();

function MainTabs({ navigation }) {
  const [activeTab, setActiveTab] = useState('home');

  function renderActiveTab() {
    switch (activeTab) {
      case 'servicos':
        return <ServicesScreen navigation={navigation} onSwitchTab={setActiveTab} />;
      case 'noticias':
        return <NewsListScreen navigation={navigation} onSwitchTab={setActiveTab} />;
      case 'perfil':
        return <ProfileScreen navigation={navigation} onSwitchTab={setActiveTab} />;
      case 'home':
      default:
        return <HomeScreen navigation={navigation} onSwitchTab={setActiveTab} />;
    }
  }

  return (
    <View style={styles.tabsContainer}>
      <View style={styles.tabBody}>{renderActiveTab()}</View>
      <BottomNav activeTab={activeTab} onSelectTab={setActiveTab} />
    </View>
  );
}

function AppContent() {
  const { loading, error } = useApp();

  if (loading) {
    return (
      <SafeAreaView style={styles.safeTop} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="light-content" backgroundColor="#1d4ed8" />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#1d4ed8" />
          <Text style={styles.loadingText}>Carregando Minha Prefeitura...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeTop} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="light-content" backgroundColor="#1d4ed8" />
        <View style={styles.centered}>
          <Text style={styles.errorTitle}>Ops! Algo deu errado</Text>
          <Text style={styles.errorSubtitle}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeTop} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#1d4ed8" />
      <View style={styles.contentWrapper}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="MainTabs"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="NewsDetail" component={NewsDetailScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="TrashCollection" component={TrashCollectionScreen} />
            <Stack.Screen name="RadarUrbano" component={UrbanIssuesScreen} />
            <Stack.Screen name="Appointment" component={AppointmentScreen} />
            <Stack.Screen name="Polls" component={PollsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
      <SafeAreaView edges={['bottom']} style={styles.safeBottom} />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeTop: {
    flex: 1,
    backgroundColor: '#1d4ed8',
  },
  safeBottom: {
    backgroundColor: '#ffffff',
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  tabsContainer: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  tabBody: {
    flex: 1,
  },
  centered: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#b91c1c',
    marginBottom: 6,
  },
  errorSubtitle: {
    fontSize: 13,
    color: '#4b5563',
    textAlign: 'center',
  },
});
