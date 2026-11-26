import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';

export default function Header({
  cityName,
  unreadCount = 0,
  onPressNotifications,
  searchValue = '',
  onChangeSearch,
  placeholder = 'Buscar serviços ou notícias...',
}) {
  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View style={styles.headerBrand}>
          <View style={styles.logoIconContainer}>
            <FontAwesome5 name="city" size={18} color="#ffffff" />
          </View>
          <View style={styles.brandTextBox}>
            <Text style={styles.welcomeText}>Bem-vindo ao</Text>
            <Text style={styles.appTitle}>Minha Prefeitura</Text>
            {cityName ? (
              <Text style={styles.citySubtitle} numberOfLines={1}>
                {cityName}
              </Text>
            ) : null}
          </View>
        </View>

        <TouchableOpacity
          style={styles.notificationBtn}
          onPress={onPressNotifications}
          activeOpacity={0.75}
          accessibilityLabel="Abrir avisos e notificações"
        >
          <Ionicons name="notifications-outline" size={20} color="#ffffff" />
          {unreadCount > 0 ? (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </Text>
            </View>
          ) : null}
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#9ca3af" style={styles.searchIcon} />
        <TextInput
          value={searchValue}
          onChangeText={onChangeSearch}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          style={styles.searchInput}
          returnKeyType="search"
          autoCorrect={false}
        />
        {searchValue.length > 0 ? (
          <TouchableOpacity
            onPress={() => onChangeSearch && onChangeSearch('')}
            style={styles.clearBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close-circle" size={18} color="#9ca3af" />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#1d4ed8',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 22,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  headerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  logoIconContainer: {
    width: 38,
    height: 38,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  brandTextBox: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 11,
    color: '#bfdbfe',
  },
  appTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  citySubtitle: {
    fontSize: 11,
    color: '#dbeafe',
    marginTop: 1,
  },
  notificationBtn: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1d4ed8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  searchContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  searchInput: {
    backgroundColor: '#ffffff',
    height: 42,
    borderRadius: 10,
    paddingLeft: 38,
    paddingRight: 36,
    fontSize: 13,
    color: '#1f2937',
  },
  clearBtn: {
    position: 'absolute',
    right: 10,
    zIndex: 1,
  },
});
