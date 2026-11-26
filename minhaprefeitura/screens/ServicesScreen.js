import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import EmptyState from '../components/EmptyState';
import { normalizeSearchText } from '../utils/formatters.js';

export default function ServicesScreen() {
  const {
    coletaLixo,
    buracos,
    agendamentos,
    enquetes,
    searchQuery,
    setSearchQuery,
    navigate,
  } = useApp();

  const openBuracosCount = buracos.filter((b) => b.status !== 'Resolvido').length;
  const activeAgendamentosCount = agendamentos.filter((a) => a.status === 'Confirmado').length;
  const activeEnquetesCount = enquetes.filter((e) => e.status === 'ativa').length;

  const catalog = useMemo(
    () => [
      {
        id: 'buracos',
        route: 'buracos',
        title: 'Curadoria de Buracos',
        badge: `${openBuracosCount} em andamento`,
        tag: 'Novo Módulo',
        description:
          'Denuncie buracos recorrentes em vias públicas, confirme ocorrências de outros moradores e acompanhe o status de reparo.',
        bg: '#ffedd5',
        color: '#c2410c',
        family: 'mci',
        icon: 'road-variant',
      },
      {
        id: 'agendamento',
        route: 'agendamento',
        title: 'Agendamento Municipal',
        badge: `${activeAgendamentosCount} agendamentos ativos`,
        tag: 'Novo Módulo',
        description:
          'Agende atendimentos em Unidades Básicas de Saúde (UBS) ou emissão de documentos sem filas e gerencie suas reservas.',
        bg: '#dbeafe',
        color: '#1d4ed8',
        family: 'ion',
        icon: 'calendar-outline',
      },
      {
        id: 'enquetes',
        route: 'enquetes',
        title: 'Enquetes e Consulta Popular',
        badge: `${activeEnquetesCount} consultas abertas`,
        tag: 'Novo Módulo',
        description:
          'Vote nas prioridades do seu bairro, acompanhe resultados em tempo real e envie opiniões sobre projetos da cidade.',
        bg: '#ede9fe',
        color: '#6d28d9',
        family: 'ion',
        icon: 'bar-chart-outline',
      },
      {
        id: 'coletaLixo',
        route: 'coletaLixo',
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
    ],
    [openBuracosCount, activeAgendamentosCount, activeEnquetesCount, coletaLixo.length]
  );

  const normalizedQuery = normalizeSearchText(searchQuery);
  const filteredCatalog = useMemo(() => {
    if (!normalizedQuery) return catalog;
    return catalog.filter((item) =>
      normalizeSearchText(`${item.title} ${item.description} ${item.tag}`).includes(
        normalizedQuery
      )
    );
  }, [catalog, normalizedQuery]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Serviços Municipais</Text>
        <Text style={styles.headerSubtitle}>
          Acesse os módulos digitais da prefeitura em um só lugar
        </Text>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#9ca3af" style={styles.searchIcon} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Buscar serviço municipal..."
            placeholderTextColor="#9ca3af"
            style={styles.searchInput}
          />
          {searchQuery.length > 0 ? (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
              <Ionicons name="close-circle" size={18} color="#9ca3af" />
            </TouchableOpacity>
          ) : null}
        </View>
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
              onPress={() => navigate(item.route)}
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
  searchContainer: {
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
    paddingLeft: 38,
    paddingRight: 36,
    fontSize: 13,
    color: '#1f2937',
  },
  clearBtn: {
    position: 'absolute',
    right: 10,
    zIndex: 1,
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
