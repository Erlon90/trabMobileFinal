import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import ScreenHeader from '../components/ScreenHeader';
import EmptyState from '../components/EmptyState';
import { formatDatePtBr, formatRelativeTime } from '../utils/formatters.js';

const TYPE_STYLES = {
  emergencia: {
    bg: '#fef2f2',
    border: '#dc2626',
    titleColor: '#b91c1c',
    icon: 'alert-circle',
    label: 'Emergência',
  },
  alerta: {
    bg: '#fef3c7',
    border: '#d97706',
    titleColor: '#b45309',
    icon: 'warning',
    label: 'Alerta',
  },
  campanha: {
    bg: '#eff6ff',
    border: '#1d4ed8',
    titleColor: '#1d4ed8',
    icon: 'megaphone',
    label: 'Campanha',
  },
  utilidade_publica: {
    bg: '#f0fdf4',
    border: '#15803d',
    titleColor: '#15803d',
    icon: 'information-circle',
    label: 'Utilidade Pública',
  },
};

export default function NotificationsScreen({ navigation }) {
  const { notificacoes } = useApp();

  function renderNotification({ item }) {
    const tone = TYPE_STYLES[item.tipo] || TYPE_STYLES.utilidade_publica;
    return (
      <View
        style={[
          styles.card,
          { backgroundColor: tone.bg, borderLeftColor: tone.border },
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.typeRow}>
            <Ionicons name={tone.icon} size={18} color={tone.border} />
            <Text style={[styles.typeLabel, { color: tone.titleColor }]}>
              {tone.label.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.timeText}>{formatRelativeTime(item.enviado_em)}</Text>
        </View>

        <Text style={styles.cardTitle}>{item.titulo}</Text>
        <Text style={styles.cardMessage}>{item.mensagem}</Text>

        <View style={styles.cardFooter}>
          <Text style={styles.expireText}>
            Válido até {formatDatePtBr(item.expira_em)}
          </Text>

          {item.link_acao ? (
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: tone.border }]}
              onPress={() => navigation.navigate(item.link_acao)}
              activeOpacity={0.8}
            >
              <Text style={styles.actionBtnText}>Abrir módulo →</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Avisos e Comunicados"
        subtitle={`${notificacoes.length} comunicados oficiais ativos`}
        onBack={() => navigation.goBack()}
      />

      <FlatList
        data={notificacoes}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderNotification}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <EmptyState
            icon="notifications-off-outline"
            title="Nenhum aviso ativo no momento"
            description="Quando a administração publicar novos alertas, eles aparecerão aqui."
          />
        }
        style={styles.list}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  list: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 28,
  },
  separator: {
    height: 12,
  },
  card: {
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  timeText: {
    fontSize: 11,
    color: '#6b7280',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  cardMessage: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 19,
  },
  cardFooter: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  expireText: {
    fontSize: 11,
    color: '#6b7280',
  },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
});
