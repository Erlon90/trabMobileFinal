import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SearchBar({
  value = '',
  onChangeText,
  placeholder = 'Buscar...',
  containerStyle,
}) {
  return (
    <View style={[styles.container, containerStyle]}>
      <Ionicons name="search" size={18} color="#9ca3af" style={styles.searchIcon} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        style={styles.input}
        returnKeyType="search"
        autoCorrect={false}
      />
      {value.length > 0 ? (
        <TouchableOpacity
          onPress={() => onChangeText && onChangeText('')}
          style={styles.clearBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel="Limpar busca"
        >
          <Ionicons name="close-circle" size={18} color="#9ca3af" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  input: {
    backgroundColor: '#ffffff',
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
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
