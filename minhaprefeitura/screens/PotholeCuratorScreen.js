import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import ScreenHeader from '../components/ScreenHeader';
import PotholeCard from '../components/PotholeCard';
import PotholeReportModal from '../components/PotholeReportModal';
import EmptyState from '../components/EmptyState';
import { filterPotholes } from '../utils/domainLogic.js';

const STATUS_FILTERS = [
  'Todos',
  'Aberto',
  'Em análise',
  'Recapeamento agendado',
  'Resolvido',
];

export default function PotholeCuratorScreen() {
  const { buracos, addPothole, toggleConfirmPothole, goBack } = useApp();
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [query, setQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [lastCreated, setLastCreated] = useState(null);

  const totalCount = buracos.length;
  const recurrentCount = buracos.filter((b) => b.recorrente || b.recorrencias >= 3).length;
  const resolvedCount = buracos.filter((b) => b.status === 'Resolvido').length;

  const filteredList = useMemo(() => {
    const matched = filterPotholes(buracos, { status: statusFilter, q: query });
    return [...matched].sort((a, b) => {
      if (b.recorrencias !== a.recorrencias) {
        return b.recorrencias - a.recorrencias;
      }
      return String(b.criadoEm).localeCompare(String(a.criadoEm));
    });
  }, [buracos, statusFilter, query]);

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Curadoria de Buracos"
        subtitle="Denuncie e confirme pontos críticos nas vias"
        onBack={goBack}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.kpiRow}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>{totalCount}</Text>
            <Text style={styles.kpiLabel}>Registros</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={[styles.kpiValue, { color: '#c2410c' }]}>{recurrentCount}</Text>
            <Text style={styles.kpiLabel}>Recorrentes</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={[styles.kpiValue, { color: '#15803d' }]}>{resolvedCount}</Text>
            <Text style={styles.kpiLabel}>Resolvidos</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.reportCta}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.85}
        >
          <Ionicons name="add-circle" size={20} color="#ffffff" />
          <Text style={styles.reportCtaText}>Denunciar Novo Buraco</Text>
        </TouchableOpacity>

        {lastCreated ? (
          <View style={styles.successBanner}>
            <Ionicons name="checkmark-circle" size={20} color="#15803d" />
            <View style={styles.successInfo}>
              <Text style={styles.successTitle}>
                Denúncia registrada • {lastCreated.protocolo}
              </Text>
              <Text style={styles.successSubtitle}>
                {lastCreated.endereco} ({lastCreated.bairro}) entrou na fila de curadoria.
              </Text>
            </View>
            <TouchableOpacity onPress={() => setLastCreated(null)}>
              <Ionicons name="close" size={18} color="#166534" />
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={styles.searchBox}>
          <Ionicons name="search" size={17} color="#9ca3af" style={styles.searchIcon} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar por rua, bairro ou protocolo..."
            placeholderTextColor="#9ca3af"
            style={styles.searchInput}
          />
          {query.length > 0 ? (
            <TouchableOpacity onPress={() => setQuery('')} style={styles.clearBtn}>
              <Ionicons name="close-circle" size={18} color="#9ca3af" />
            </TouchableOpacity>
          ) : null}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContent}
        >
          {STATUS_FILTERS.map((status) => {
            const active = statusFilter === status;
            return (
              <TouchableOpacity
                key={status}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setStatusFilter(status)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {status}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {filteredList.length === 0 ? (
          <EmptyState
            title="Nenhuma ocorrência encontrada"
            description="Ajuste os filtros ou registre um novo ponto crítico na sua rua."
            actionLabel="Limpar filtros"
            onAction={() => {
              setStatusFilter('Todos');
              setQuery('');
            }}
          />
        ) : (
          <View style={styles.list}>
            {filteredList.map((item) => (
              <PotholeCard
                key={item.id}
                item={item}
                onToggleConfirm={toggleConfirmPothole}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <PotholeReportModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={addPothole}
        onSuccess={(created) => {
          setModalVisible(false);
          setLastCreated(created);
          setStatusFilter('Todos');
          setQuery('');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 12,
    paddingBottom: 28,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 8,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1d4ed8',
  },
  kpiLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
    fontWeight: '600',
  },
  reportCta: {
    backgroundColor: '#c2410c',
    borderRadius: 12,
    paddingVertical: 13,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  reportCtaText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  successBanner: {
    backgroundColor: '#dcfce7',
    borderWidth: 1,
    borderColor: '#86efac',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  successInfo: {
    flex: 1,
  },
  successTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#166534',
  },
  successSubtitle: {
    fontSize: 11,
    color: '#15803d',
    marginTop: 2,
  },
  searchBox: {
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
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingLeft: 36,
    paddingRight: 36,
    fontSize: 13,
    color: '#1f2937',
  },
  clearBtn: {
    position: 'absolute',
    right: 10,
    zIndex: 1,
  },
  chipsContent: {
    gap: 8,
  },
  chip: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  chipActive: {
    backgroundColor: '#1d4ed8',
    borderColor: '#1d4ed8',
  },
  chipText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#ffffff',
  },
  list: {
    gap: 10,
  },
});
