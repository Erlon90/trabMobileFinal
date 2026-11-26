import React, { useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import ScreenHeader from '../components/ScreenHeader';
import SearchBar from '../components/SearchBar';
import UrbanIssueCard from '../components/UrbanIssueCard';
import UrbanIssueModal from '../components/UrbanIssueModal';
import EmptyState from '../components/EmptyState';
import { RADAR_CATEGORIES } from '../data/mockData.js';
import { filterUrbanIssues } from '../utils/domainLogic.js';

const CATEGORY_FILTERS = ['Todas', ...RADAR_CATEGORIES];

const STATUS_FILTERS = [
  'Todos',
  'Aberto',
  'Em análise',
  'Manutenção agendada',
  'Resolvido',
];

export default function UrbanIssuesScreen({ navigation }) {
  const { ocorrencias, addUrbanIssue, toggleSupportUrbanIssue } = useApp();
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [query, setQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [lastCreated, setLastCreated] = useState(null);

  const totalCount = ocorrencias.length;
  const recurrentCount = ocorrencias.filter(
    (item) => item.recorrente || Number(item.confirmacoes) >= 3
  ).length;
  const resolvedCount = ocorrencias.filter((item) => item.status === 'Resolvido').length;

  const matched = filterUrbanIssues(ocorrencias, {
    categoria: categoryFilter,
    status: statusFilter,
    q: query,
  });

  const filteredList = [...matched].sort((a, b) => {
    if (b.confirmacoes !== a.confirmacoes) {
      return b.confirmacoes - a.confirmacoes;
    }
    return String(b.criadoEm).localeCompare(String(a.criadoEm));
  });

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Radar Urbano"
        subtitle="Registre e apoie ocorrências urbanas na cidade"
        onBack={() => navigation.goBack()}
      />

      <View style={styles.topSection}>
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
          <Text style={styles.reportCtaText}>Registrar Nova Ocorrência</Text>
        </TouchableOpacity>

        {lastCreated ? (
          <View style={styles.successBanner}>
            <Ionicons name="checkmark-circle" size={20} color="#15803d" />
            <View style={styles.successInfo}>
              <Text style={styles.successTitle}>
                Ocorrência registrada • {lastCreated.protocolo}
              </Text>
              <Text style={styles.successSubtitle}>
                {lastCreated.categoria} em {lastCreated.endereco} ({lastCreated.bairro}) entrou na fila.
              </Text>
            </View>
            <TouchableOpacity onPress={() => setLastCreated(null)}>
              <Ionicons name="close" size={18} color="#166534" />
            </TouchableOpacity>
          </View>
        ) : null}

        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar por rua, bairro, categoria ou protocolo..."
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContent}
        >
          {CATEGORY_FILTERS.map((cat) => {
            const active = categoryFilter === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.chip, active && styles.chipCategoryActive]}
                onPress={() => setCategoryFilter(cat)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

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
                style={[styles.chip, active && styles.chipStatusActive]}
                onPress={() => setStatusFilter(status)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {status}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={filteredList}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <UrbanIssueCard
            item={item}
            onToggleSupport={toggleSupportUrbanIssue}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <EmptyState
            title="Nenhuma ocorrência encontrada"
            description="Ajuste os filtros ou registre uma nova ocorrência urbana no seu bairro."
            actionLabel="Limpar filtros"
            onAction={() => {
              setCategoryFilter('Todas');
              setStatusFilter('Todos');
              setQuery('');
            }}
          />
        }
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <UrbanIssueModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={addUrbanIssue}
        onSuccess={(created) => {
          setModalVisible(false);
          setLastCreated(created);
          setCategoryFilter('Todas');
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
  topSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 8,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 8,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 9,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  kpiValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1d4ed8',
  },
  kpiLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 1,
    fontWeight: '600',
  },
  reportCta: {
    backgroundColor: '#c2410c',
    borderRadius: 12,
    paddingVertical: 11,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  reportCtaText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  successBanner: {
    backgroundColor: '#dcfce7',
    borderWidth: 1,
    borderColor: '#86efac',
    borderRadius: 12,
    padding: 10,
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
  chipsContent: {
    gap: 8,
  },
  chip: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  chipCategoryActive: {
    backgroundColor: '#c2410c',
    borderColor: '#c2410c',
  },
  chipStatusActive: {
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
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 28,
  },
  separator: {
    height: 10,
  },
});
