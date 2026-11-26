import React, { useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import ScreenHeader from '../components/ScreenHeader';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import { normalizeSearchText } from '../utils/formatters.js';

export default function TrashCollectionScreen({ navigation }) {
  const { coletaLixo } = useApp();
  const [selectedBairro, setSelectedBairro] = useState('Todos');
  const [query, setQuery] = useState('');

  const bairros = ['Todos', ...coletaLixo.map((item) => item.bairro)];
  const normQuery = normalizeSearchText(query);

  const filteredList = coletaLixo.filter((item) => {
    if (selectedBairro !== 'Todos' && item.bairro !== selectedBairro) {
      return false;
    }
    if (!normQuery) return true;
    return normalizeSearchText(
      `${item.bairro} ${item.coletaComum} ${item.coletaSeletiva} ${item.pontoEntregaVoluntaria}`
    ).includes(normQuery);
  });

  function renderItem({ item }) {
    return (
      <View style={styles.card}>
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
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Coleta de Lixo"
        subtitle="Horários de coleta comum e seletiva por bairro"
        onBack={() => navigation.goBack()}
      />

      <View style={styles.filterSection}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar por bairro ou ponto de entrega..."
          containerStyle={styles.searchBox}
        />

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

      <FlatList
        data={filteredList}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <EmptyState
            title="Nenhum bairro encontrado"
            description="Limpe os filtros para visualizar todos os roteiros de coleta."
            actionLabel="Mostrar todos"
            onAction={() => {
              setSelectedBairro('Todos');
              setQuery('');
            }}
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
  filterSection: {
    paddingTop: 12,
    paddingBottom: 4,
    gap: 10,
  },
  searchBox: {
    marginHorizontal: 16,
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
  list: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 24,
  },
  separator: {
    height: 12,
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
