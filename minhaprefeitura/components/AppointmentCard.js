import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StatusBadge from './StatusBadge';
import { formatDatePtBr } from '../utils/formatters.js';

export default function AppointmentCard({ item, onCancel }) {
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const isConfirmed = item.status === 'Confirmado';
  const categoryLabel =
    item.categoria === 'saude' ? 'Posto de Saúde' : 'Emissão de Documentos';

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.protocol}>{item.protocolo}</Text>
        <StatusBadge label={item.status} />
      </View>

      <Text style={styles.category}>{categoryLabel}</Text>
      <Text style={styles.service}>{item.servicoNome}</Text>

      <View style={styles.detailRow}>
        <Ionicons name="business-outline" size={14} color="#4b5563" />
        <Text style={styles.detailText}>{item.unidadeNome}</Text>
      </View>

      <View style={styles.detailRow}>
        <Ionicons name="calendar-outline" size={14} color="#4b5563" />
        <Text style={styles.detailText}>
          {formatDatePtBr(item.data)} às {item.horario}
        </Text>
      </View>

      <View style={styles.detailRow}>
        <Ionicons name="person-outline" size={14} color="#4b5563" />
        <Text style={styles.detailText}>
          {item.cidadaoNome} • CPF {item.cidadaoCpf}
        </Text>
      </View>

      {isConfirmed ? (
        <View style={styles.footer}>
          {confirmingCancel ? (
            <View style={styles.confirmBox}>
              <Text style={styles.confirmPrompt}>Cancelar este atendimento?</Text>
              <View style={styles.confirmButtons}>
                <TouchableOpacity
                  style={styles.keepBtn}
                  onPress={() => setConfirmingCancel(false)}
                >
                  <Text style={styles.keepBtnText}>Manter</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.confirmDeleteBtn}
                  onPress={() => {
                    setConfirmingCancel(false);
                    onCancel(item.id);
                  }}
                >
                  <Text style={styles.confirmDeleteText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setConfirmingCancel(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="close-circle-outline" size={16} color="#b91c1c" />
              <Text style={styles.cancelBtnText}>Cancelar agendamento</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : null}
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
    marginBottom: 6,
  },
  protocol: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1d4ed8',
  },
  category: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  service: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  detailText: {
    fontSize: 12,
    color: '#374151',
    marginLeft: 6,
    flex: 1,
  },
  footer: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    paddingVertical: 9,
    borderRadius: 8,
    gap: 6,
  },
  cancelBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#b91c1c',
  },
  confirmBox: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 10,
    padding: 10,
  },
  confirmPrompt: {
    fontSize: 12,
    fontWeight: '700',
    color: '#991b1b',
    marginBottom: 8,
  },
  confirmButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  keepBtn: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  keepBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
  confirmDeleteBtn: {
    flex: 1,
    backgroundColor: '#dc2626',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmDeleteText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
