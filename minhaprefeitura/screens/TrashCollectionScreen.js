import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import ScreenHeader from '../components/ScreenHeader';
import EmptyState from '../components/EmptyState';
import { normalizeSearchText } from '../utils/formatters.js';

export default function TrashCollectionScreen() {
  const { coletaLixo, goBack } = useApp();
  const [selectedBairro, setSelectedBairro] = useState('Todos');
  const [query, setQuery] = useState('');

  const bairros = useMemo(
    () => ['Todos', ...coletaLixo.map((item) => item.bairro)],
    [coletaLixo]
  );

  const filteredList = useMemo(() => {
    const normQuery = normalizeSearchText(query);
    return coletaLixo.filter((item) => {
      if (selectedBairro !== 'Todos' && item.bairro !== selectedBairro) {
        return false;
      }
      if (!normQuery) return true;
      return normalizeSearchText(
        `${item.bairro} ${item.coletaComum} ${item.coletaSeletiva} ${item.pontoEntregaVoluntaria}`
      ).includes(normQuery);
    });
  }, [coletaLixo, selectedBairro, query]);

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Coleta de Lixo"
        subtitle="Horários de coleta comum e seletiva por bairro"
        onBack={goBack}
      />

      <View style={styles.filterSection}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={17} color="#9ca3af" style={styles.searchIcon} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar por bairro ou ponto de entrega..."
            placeholderTextColor="#9ca3af"
            style={styles.searchInput}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContent}
        >
          {bairros.map((bairro) => {
            const active = selectedBairro === bairro;
            return (
              <TouchableOpacity
                key={bairro}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setSelectedBairro(bairro)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {bairro}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {filteredList.length === 0 ? (
          <EmptyState
            title="Nenhum bairro encontrado"
            description="Limpe os filtros para visualizar todos os roteiros de coleta."
            actionLabel="Mostrar todos"
            onAction={() => {
              setSelectedBairro('Todos');
              setQuery('');
            }}
          />
        ) : (
          filteredList.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.bairroIcon}>
                  <MaterialCommunityIcons
                    name="trash-can-outline"
                    size={20}
                    color="#15803d"
                  />
                </View>
                <Text style={styles.bairroTitle}>{item.bairro}</Text>
              </View>

              <View style={styles.infoBlock}>
                <Text style={styles.label}>Coleta Domiciliar (Orgânico / Rejeito)</Text>
                <Text style={styles.value}>{item.coletaComum}</Text>
              </View>

              <View style={styles.infoBlock}>
                <Text style={styles.label}>Coleta Seletiva (Recicláveis)</Text>
                <Text style={styles.value}>{item.coletaSeletiva}</Text>
              </View>

              <View style={styles.infoBlock}>
                <Text style={styles.label}>Ponto de Entrega Voluntária (PEV)</Text>
                <Text style={styles.value}>{item.pontoEntregaVoluntaria}</Text>
              </View>

              <View style={styles.tipBox}>
                <Ionicons name="information-circle-outline" size={16} color="#15803d" />
                <Text style={styles.tipText}>{item.observacao}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  filterSection: {
    paddingTop: 12,
    gap: 10,
  },
  searchBox: {
    marginHorizontal: 16,
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
    paddingRight: 12,
    fontSize: 13,
    color: '#1f2937',
  },
  chipsContent: {
    paddingHorizontal: 16,
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
    backgroundColor: '#15803d',
    borderColor: '#15803d',
  },
  chipText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#ffffff',
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 12,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  bairroIcon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  bairroTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  infoBlock: {
    marginTop: 8,
  },
  label: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '600',
  },
  value: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '500',
    marginTop: 2,
  },
  tipBox: {
    marginTop: 12,
    backgroundColor: '#f0fdf4',
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    color: '#166534',
    marginLeft: 8,
    lineHeight: 16,
  },
});
