import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import { normalizeSearchText } from '../utils/formatters.js';

export default function ServicesScreen({ navigation }) {
  const {
    coletaLixo,
    ocorrencias,
    agendamentos,
    enquetes,
    searchQuery,
    setSearchQuery,
  } = useApp();

  const openIssuesCount = ocorrencias.filter((o) => o.status !== 'Resolvido').length;
  const activeAgendamentosCount = agendamentos.filter((a) => a.status === 'Confirmado').length;
  const activeEnquetesCount = enquetes.filter((e) => e.status === 'ativa').length;

  const catalog = [
    {
      id: 'radarUrbano',
      route: 'RadarUrbano',
      title: 'Radar Urbano',
      badge: `${openIssuesCount} em aberto`,
      tag: 'Módulo Cidadão',
      description:
        'Registre e apoie ocorrências de pavimentação, iluminação pública, poda de árvores, drenagem e limpeza urbana na cidade.',
      bg: '#ffedd5',
      color: '#c2410c',
      family: 'mci',
      icon: 'radar',
    },
    {
      id: 'agendamento',
      route: 'Appointment',
      title: 'Agendamento Municipal',
      badge: `${activeAgendamentosCount} agendamentos ativos`,
      tag: 'Módulo Cidadão',
      description:
        'Agende atendimentos em Unidades Básicas de Saúde (UBS) ou emissão de documentos sem filas e gerencie suas reservas.',
      bg: '#dbeafe',
      color: '#1d4ed8',
      family: 'ion',
      icon: 'calendar-outline',
    },
    {
      id: 'enquetes',
      route: 'Polls',
      title: 'Enquetes e Consulta Popular',
      badge: `${activeEnquetesCount} consultas abertas`,
      tag: 'Módulo Cidadão',
      description:
        'Vote nas prioridades do seu bairro, acompanhe resultados em tempo real e envie opiniões sobre projetos da cidade.',
      bg: '#ede9fe',
      color: '#6d28d9',
      family: 'ion',
      icon: 'bar-chart-outline',
    },
    {
      id: 'coletaLixo',
      route: 'TrashCollection',
      title: 'Coleta de Lixo e Seletiva',
      badge: `${coletaLixo.length} bairros atendidos`,
      tag: 'Utilidade Base',
      description:
        'Consulte os dias e horários da coleta comum, coleta seletiva e pontos de entrega voluntária no seu bairro.',
      bg: '#dcfce7',
      color: '#15803d',
      family: 'mci',
      icon: 'trash-can-outline',
    },
  ];

  const normalizedQuery = normalizeSearchText(searchQuery);
  const filteredCatalog = normalizedQuery
    ? catalog.filter((item) =>
        normalizeSearchText(`${item.title} ${item.description} ${item.tag}`).includes(
          normalizedQuery
        )
      )
    : catalog;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Serviços Municipais</Text>
        <Text style={styles.headerSubtitle}>
          Acesse os módulos digitais da prefeitura em um só lugar
        </Text>

        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Buscar serviço municipal..."
        />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {filteredCatalog.length === 0 ? (
          <EmptyState
            title="Serviço não encontrado"
            description="Nenhum módulo corresponde ao termo pesquisado."
            actionLabel="Mostrar todos os serviços"
            onAction={() => setSearchQuery('')}
          />
        ) : (
          filteredCatalog.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() => navigation.navigate(item.route)}
              activeOpacity={0.85}
            >
              <View style={styles.cardTop}>
                <View style={[styles.iconBox, { backgroundColor: item.bg }]}>
                  {item.family === 'mci' ? (
                    <MaterialCommunityIcons name={item.icon} size={24} color={item.color} />
                  ) : (
                    <Ionicons name={item.icon} size={24} color={item.color} />
                  )}
                </View>

                <View style={styles.cardHeaderInfo}>
                  <View style={styles.tagRow}>
                    <View style={styles.tagPill}>
                      <Text style={styles.tagPillText}>{item.tag}</Text>
                    </View>
                    <Text style={styles.liveCountText}>{item.badge}</Text>
                  </View>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                </View>

                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </View>

              <Text style={styles.cardDescription}>{item.description}</Text>
            </TouchableOpacity>
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
  header: {
    backgroundColor: '#1d4ed8',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 18,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#dbeafe',
    marginTop: 2,
    marginBottom: 12,
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
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardHeaderInfo: {
    flex: 1,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  tagPill: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
  },
  tagPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1d4ed8',
  },
  liveCountText: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '500',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  cardDescription: {
    fontSize: 12,
    color: '#4b5563',
    lineHeight: 18,
    marginTop: 10,
  },
});
