import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const PRESET_TONES = {
  Saúde: { bg: '#dbeafe', text: '#1d4ed8' },
  Obras: { bg: '#fef3c7', text: '#b45309' },
  Educação: { bg: '#ede9fe', text: '#6d28d9' },
  Transporte: { bg: '#e0f2fe', text: '#0369a1' },
  'Meio Ambiente': { bg: '#dcfce7', text: '#15803d' },
  Cultura: { bg: '#fce7f3', text: '#be185d' },
  Pavimentação: { bg: '#ffedd5', text: '#c2410c' },
  'Iluminação Pública': { bg: '#fef9c3', text: '#a16207' },
  'Poda e Árvores': { bg: '#dcfce7', text: '#15803d' },
  Drenagem: { bg: '#e0f2fe', text: '#0369a1' },
  'Limpeza Urbana': { bg: '#f3e8ff', text: '#7e22ce' },
  Aberto: { bg: '#fee2e2', text: '#b91c1c' },
  'Em análise': { bg: '#fef3c7', text: '#b45309' },
  'Manutenção agendada': { bg: '#dbeafe', text: '#1d4ed8' },
  Resolvido: { bg: '#dcfce7', text: '#15803d' },
  Baixa: { bg: '#f3f4f6', text: '#4b5563' },
  Média: { bg: '#fef3c7', text: '#b45309' },
  Alta: { bg: '#fee2e2', text: '#b91c1c' },
  Confirmado: { bg: '#dcfce7', text: '#15803d' },
  Cancelado: { bg: '#f3f4f6', text: '#6b7280' },
  Ativa: { bg: '#dcfce7', text: '#15803d' },
  Encerrada: { bg: '#f3f4f6', text: '#4b5563' },
  Recorrente: { bg: '#ffedd5', text: '#c2410c' },
  'Prioridade de Bairro': { bg: '#dbeafe', text: '#1d4ed8' },
  'Projeto da Cidade': { bg: '#ede9fe', text: '#6d28d9' },
};

export default function StatusBadge({ label, bgColor, textColor, style }) {
  const preset = PRESET_TONES[label] || { bg: '#e5e7eb', text: '#374151' };

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: bgColor || preset.bg },
        style,
      ]}
    >
      <Text style={[styles.text, { color: textColor || preset.text }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  text: {
    fontSize: 10,
    fontWeight: '700',
  },
});
