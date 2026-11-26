import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TABS = [
  { key: 'home', label: 'Início', icon: 'home-outline', activeIcon: 'home' },
  { key: 'servicos', label: 'Serviços', icon: 'grid-outline', activeIcon: 'grid' },
  { key: 'noticias', label: 'Notícias', icon: 'newspaper-outline', activeIcon: 'newspaper' },
  { key: 'perfil', label: 'Perfil', icon: 'person-outline', activeIcon: 'person' },
];

export default function BottomNav({ activeTab, onSelectTab }) {
  return (
    <View style={styles.bottomNav}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.navItem}
            onPress={() => onSelectTab(tab.key)}
            activeOpacity={0.75}
          >
            <Ionicons
              name={isActive ? tab.activeIcon : tab.icon}
              size={22}
              color={isActive ? '#1d4ed8' : '#9ca3af'}
            />
            <Text style={[styles.navText, isActive && styles.navTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    paddingBottom: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 2,
  },
  navTextActive: {
    color: '#1d4ed8',
    fontWeight: 'bold',
  },
});
