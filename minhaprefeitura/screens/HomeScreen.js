import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import NewsCard from '../components/NewsCard';
import EmptyState from '../components/EmptyState';
import { normalizeSearchText, stripHtml } from '../utils/formatters.js';

const SERVICE_SHORTCUTS = [
  {
    key: 'coletaLixo',
    label: 'Coleta de Lixo',
    keywords: 'coleta lixo reciclagem seletiva bairro',
    route: 'TrashCollection',
    bg: '#dcfce7',
    color: '#15803d',
    family: 'mci',
    icon: 'trash-can-outline',
  },
  {
    key: 'radarUrbano',
    label: 'Radar Urbano',
    keywords:
      'radar urbano ocorrencia pavimentacao buraco asfalto iluminacao poste luz poda arvore drenagem bueiro alagamento limpeza entulho',
    route: 'RadarUrbano',
    bg: '#ffedd5',
    color: '#c2410c',
    family: 'mci',
    icon: 'radar',
  },
  {
    key: 'agendamento',
    label: 'Agendamento',
    keywords: 'agendamento saude posto ubs documentos rg vacina',
    route: 'Appointment',
    bg: '#dbeafe',
    color: '#1d4ed8',
    family: 'ion',
    icon: 'calendar-outline',
  },
  {
    key: 'enquetes',
    label: 'Enquetes',
    keywords: 'enquetes consulta popular votacao opiniao bairro projeto',
    route: 'Polls',
    bg: '#ede9fe',
    color: '#6d28d9',
    family: 'ion',
    icon: 'bar-chart-outline',
  },
];

export default function HomeScreen({ navigation, onSwitchTab }) {
  const {
    tenant,
    noticias,
    notificacoes,
    searchQuery,
    setSearchQuery,
  } = useApp();

  const normalizedQuery = normalizeSearchText(searchQuery);

  const filteredServices = normalizedQuery
    ? SERVICE_SHORTCUTS.filter((item) =>
        normalizeSearchText(`${item.label} ${item.keywords}`).includes(normalizedQuery)
      )
    : SERVICE_SHORTCUTS;

  const filteredNews = normalizedQuery
    ? noticias.filter((item) =>
        normalizeSearchText(
          `${item.titulo} ${item.resumo} ${item.categoria} ${stripHtml(item.conteudo)}`
        ).includes(normalizedQuery)
      )
    : noticias.slice(0, 4);

  const featuredAlert = notificacoes[0];
  const noMatches =
    normalizedQuery.length > 0 &&
    filteredServices.length === 0 &&
    filteredNews.length === 0;

  return (
    <ScrollView
      style={styles.screen}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <Header
        cityName={tenant?.nome}
        unreadCount={notificacoes.length}
        onPressNotifications={() => navigation.navigate('Notifications')}
        searchValue={searchQuery}
        onChangeSearch={setSearchQuery}
      />

      {!normalizedQuery && featuredAlert ? (
        <View style={styles.sectionContainer}>
          <TouchableOpacity
            style={styles.alertCard}
            onPress={() => navigation.navigate('Notifications')}
            activeOpacity={0.85}
          >
            <Ionicons name="warning" size={22} color="#d97706" style={styles.alertIcon} />
            <View style={styles.alertTextBox}>
              <Text style={styles.alertTitle}>{featuredAlert.titulo}</Text>
              <Text style={styles.alertText} numberOfLines={2}>
                {featuredAlert.mensagem}
              </Text>
              <Text style={styles.alertLink}>Ver todos os avisos →</Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : null}

      {noMatches ? (
        <View style={styles.sectionContainer}>
          <EmptyState
            title={`Nenhum resultado para "${searchQuery.trim()}"`}
            description="Não encontramos serviços ou notícias correspondentes. Tente outro termo."
            actionLabel="Limpar busca"
            onAction={() => setSearchQuery('')}
          />
        </View>
      ) : null}

      {filteredServices.length > 0 ? (
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Serviços e Utilidades</Text>
            <TouchableOpacity onPress={() => onSwitchTab && onSwitchTab('servicos')}>
              <Text style={styles.sectionAction}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.utilitiesGrid}>
            {filteredServices.map((service) => (
              <TouchableOpacity
                key={service.key}
                style={styles.utilityItem}
                onPress={() => navigation.navigate(service.route)}
                activeOpacity={0.8}
              >
                <View style={[styles.utilityIconBox, { backgroundColor: service.bg }]}>
                  {service.family === 'mci' ? (
                    <MaterialCommunityIcons
                      name={service.icon}
                      size={22}
                      color={service.color}
                    />
                  ) : (
                    <Ionicons name={service.icon} size={22} color={service.color} />
                  )}
                </View>
                <Text style={styles.utilityText} numberOfLines={2}>
                  {service.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : null}

      {filteredNews.length > 0 ? (
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {normalizedQuery ? 'Notícias encontradas' : 'Últimas Notícias'}
            </Text>
            <TouchableOpacity onPress={() => onSwitchTab && onSwitchTab('noticias')}>
              <Text style={styles.sectionAction}>Ver mais</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.newsList}>
            {filteredNews.map((item) => (
              <NewsCard
                key={item.id}
                item={item}
                onPress={() => navigation.navigate('NewsDetail', { slug: item.slug })}
              />
            ))}
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  alertCard: {
    backgroundColor: '#fef3c7',
    borderLeftWidth: 4,
    borderLeftColor: '#d97706',
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  alertIcon: {
    marginTop: 2,
  },
  alertTextBox: {
    flex: 1,
    marginLeft: 10,
  },
  alertTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#b45309',
  },
  alertText: {
    fontSize: 12,
    color: '#4b5563',
    marginTop: 2,
    lineHeight: 17,
  },
  alertLink: {
    fontSize: 11,
    fontWeight: '700',
    color: '#b45309',
    marginTop: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  sectionAction: {
    fontSize: 12,
    color: '#1d4ed8',
    fontWeight: '600',
  },
  utilitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  utilityItem: {
    width: '48.5%',
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  utilityIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  utilityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  newsList: {
    gap: 10,
  },
});
