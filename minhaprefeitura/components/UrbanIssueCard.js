import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import StatusBadge from './StatusBadge';
import { formatDatePtBr } from '../utils/formatters.js';

export default function UrbanIssueCard({ item, onToggleSupport }) {
  const isRecurrent = Boolean(item.recorrente) || Number(item.confirmacoes) >= 3;
  const isResolved = item.status === 'Resolvido';
  const supported = Boolean(item.confirmadoPeloUsuario);

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.protocol}>{item.protocolo}</Text>
        <Text style={styles.date}>{formatDatePtBr(item.criadoEm)}</Text>
      </View>

      <View style={styles.badgesRow}>
        {item.categoria ? <StatusBadge label={item.categoria} /> : null}
        <StatusBadge label={item.status} />
        <StatusBadge
          label={`Gravidade: ${item.gravidade}`}
          bgColor="#f3f4f6"
          textColor="#374151"
        />
        {isRecurrent ? <StatusBadge label="Recorrente" /> : null}
      </View>

      <Text style={styles.title}>{item.titulo}</Text>

      <View style={styles.locationBox}>
        <Ionicons name="location-outline" size={14} color="#4b5563" />
        <Text style={styles.locationText}>
          {item.endereco} • {item.bairro}
        </Text>
      </View>

      {item.pontoReferencia ? (
        <Text style={styles.reference}>Ref.: {item.pontoReferencia}</Text>
      ) : null}

      <Text style={styles.description}>{item.descricao}</Text>

      <View style={styles.footer}>
        <View style={styles.countInfo}>
          <MaterialCommunityIcons name="account-group-outline" size={16} color="#4b5563" />
          <Text style={styles.countText}>
            {item.confirmacoes}{' '}
            {item.confirmacoes === 1 ? 'confirmação' : 'confirmações'}
          </Text>
        </View>

        {isResolved ? (
          <View style={styles.resolvedTag}>
            <Ionicons name="checkmark-circle" size={15} color="#15803d" />
            <Text style={styles.resolvedText}>Demanda concluída</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.supportBtn, supported && styles.supportBtnActive]}
            onPress={() => onToggleSupport(item.id)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={supported ? 'checkmark-circle' : 'add-circle-outline'}
              size={16}
              color={supported ? '#ffffff' : '#c2410c'}
            />
            <Text style={[styles.supportBtnText, supported && styles.supportBtnTextActive]}>
              {supported ? 'Ocorrência apoiada' : 'Apoiar ocorrência'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  protocol: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#6b7280',
  },
  date: {
    fontSize: 11,
    color: '#9ca3af',
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 6,
  },
  locationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  locationText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 4,
    flex: 1,
  },
  reference: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 6,
  },
  description: {
    fontSize: 12,
    color: '#4b5563',
    lineHeight: 18,
    marginTop: 4,
  },
  footer: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  countInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4b5563',
    marginLeft: 5,
  },
  supportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff7ed',
    borderWidth: 1,
    borderColor: '#fdba74',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    gap: 5,
  },
  supportBtnActive: {
    backgroundColor: '#c2410c',
    borderColor: '#c2410c',
  },
  supportBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#c2410c',
  },
  supportBtnTextActive: {
    color: '#ffffff',
  },
  resolvedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  resolvedText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803d',
  },
});
