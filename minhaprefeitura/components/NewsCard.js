import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StatusBadge from './StatusBadge';
import { formatRelativeTime } from '../utils/formatters.js';

export default function NewsCard({ item, onPress, showSummary = false }) {
  const [imageFailed, setImageFailed] = useState(false);
  const hasImage = Boolean(item?.imagem_capa_url) && !imageFailed;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {hasImage ? (
        <Image
          source={{ uri: item.imagem_capa_url }}
          style={styles.image}
          onError={() => setImageFailed(true)}
        />
      ) : (
        <View style={styles.imageFallback}>
          <Ionicons name="newspaper-outline" size={26} color="#1d4ed8" />
        </View>
      )}

      <View style={styles.info}>
        <StatusBadge label={item.categoria || 'Comunicado'} />
        <Text style={styles.title} numberOfLines={2}>
          {item.titulo}
        </Text>
        {showSummary && item.resumo ? (
          <Text style={styles.summary} numberOfLines={2}>
            {item.resumo}
          </Text>
        ) : null}
        <View style={styles.dateRow}>
          <Ionicons name="time-outline" size={12} color="#9ca3af" />
          <Text style={styles.dateText}>
            {formatRelativeTime(item.publicado_em)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  image: {
    width: 78,
    height: 78,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
  },
  imageFallback: {
    width: 78,
    height: 78,
    borderRadius: 8,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 4,
  },
  summary: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 3,
    lineHeight: 15,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  dateText: {
    fontSize: 10,
    color: '#9ca3af',
    marginLeft: 4,
  },
});
