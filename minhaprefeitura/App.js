import React from 'react';
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AppProvider, useApp } from './context/AppContext';
import BottomNav from './components/BottomNav';
import HomeScreen from './screens/HomeScreen';
import ServicesScreen from './screens/ServicesScreen';
import NewsListScreen from './screens/NewsListScreen';
import ProfileScreen from './screens/ProfileScreen';
import NewsDetailScreen from './screens/NewsDetailScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import TrashCollectionScreen from './screens/TrashCollectionScreen';
import PotholeCuratorScreen from './screens/PotholeCuratorScreen';
import AppointmentScreen from './screens/AppointmentScreen';
import PollsScreen from './screens/PollsScreen';

function AppRouter() {
  const { loading, error, activeTab, currentRoute, switchTab } = useApp();

  if (loading) {
    return (
      <SafeAreaView style={styles.safeTop}>
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
      <SafeAreaView style={styles.safeTop}>
        <StatusBar barStyle="light-content" backgroundColor="#1d4ed8" />
        <View style={styles.centered}>
          <Text style={styles.errorTitle}>Ops! Algo deu errado</Text>
          <Text style={styles.errorSubtitle}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  function renderContent() {
    if (currentRoute) {
      switch (currentRoute.name) {
        case 'newsDetail':
          return <NewsDetailScreen routeParams={currentRoute.params} />;
        case 'notificacoes':
          return <NotificationsScreen />;
        case 'coletaLixo':
          return <TrashCollectionScreen />;
        case 'buracos':
          return <PotholeCuratorScreen />;
        case 'agendamento':
          return <AppointmentScreen />;
        case 'enquetes':
          return <PollsScreen />;
        default:
          break;
      }
    }

    switch (activeTab) {
      case 'servicos':
        return <ServicesScreen />;
      case 'noticias':
        return <NewsListScreen />;
      case 'perfil':
        return <ProfileScreen />;
      case 'home':
      default:
        return <HomeScreen />;
    }
  }

  return (
    <SafeAreaView style={styles.safeTop}>
      <StatusBar barStyle="light-content" backgroundColor="#1d4ed8" />
      <View style={styles.contentWrapper}>{renderContent()}</View>
      {!currentRoute ? (
        <BottomNav activeTab={activeTab} onSelectTab={switchTab} />
      ) : null}
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  safeTop: {
    flex: 1,
    backgroundColor: '#1d4ed8',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: '#f3f4f6',
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
