import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { API_CONFIG } from '../services/api.js';

export default function ProfileScreen({ navigation }) {
  const {
    tenant,
    ocorrencias,
    agendamentos,
    votedPollIds,
    reportedIssueIds,
  } = useApp();

  const supportedIssuesCount = ocorrencias.filter((o) => o.confirmadoPeloUsuario).length;
  const activeAppointmentsCount = agendamentos.filter((a) => a.status === 'Confirmado').length;
  const votedPollsCount = Object.keys(votedPollIds).length;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={32} color="#1d4ed8" />
        </View>
        <Text style={styles.name}>Mariana Oliveira</Text>
        <Text style={styles.role}>Cidadã Cadastrada • {tenant?.nome || 'Minha Prefeitura'}</Text>
        <View style={styles.verifiedBadge}>
          <Ionicons name="shield-checkmark" size={13} color="#dcfce7" />
          <Text style={styles.verifiedText}>Conta verificada no portal municipal</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumo da Minha Participação</Text>

        <View style={styles.statsRow}>
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => navigation.navigate('RadarUrbano')}
            activeOpacity={0.85}
          >
            <MaterialCommunityIcons name="radar" size={22} color="#c2410c" />
            <Text style={styles.statNumber}>{supportedIssuesCount}</Text>
            <Text style={styles.statLabel}>Ocorrências apoiadas</Text>
            {reportedIssueIds.length > 0 ? (
              <Text style={styles.statSub}>+{reportedIssueIds.length} novas</Text>
            ) : null}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statCard}
            onPress={() => navigation.navigate('Appointment')}
            activeOpacity={0.85}
          >
            <Ionicons name="calendar" size={22} color="#1d4ed8" />
            <Text style={styles.statNumber}>{activeAppointmentsCount}</Text>
            <Text style={styles.statLabel}>Agendamentos ativos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statCard}
            onPress={() => navigation.navigate('Polls')}
            activeOpacity={0.85}
          >
            <Ionicons name="bar-chart" size={22} color="#6d28d9" />
            <Text style={styles.statNumber}>{votedPollsCount}</Text>
            <Text style={styles.statLabel}>Enquetes votadas</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Atalhos Rápidos</Text>

        <View style={styles.menuCard}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Ionicons name="notifications-outline" size={20} color="#1d4ed8" />
            <Text style={styles.menuLabel}>Central de Avisos e Alertas</Text>
            <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('RadarUrbano')}
          >
            <MaterialCommunityIcons name="radar" size={20} color="#c2410c" />
            <Text style={styles.menuLabel}>Minhas Ocorrências no Radar Urbano</Text>
            <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Appointment')}
          >
            <Ionicons name="calendar-outline" size={20} color="#1d4ed8" />
            <Text style={styles.menuLabel}>Gerenciar Meus Agendamentos</Text>
            <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Polls')}
          >
            <Ionicons name="bar-chart-outline" size={20} color="#6d28d9" />
            <Text style={styles.menuLabel}>Consultas Populares em Aberto</Text>
            <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.techCard}>
          <Text style={styles.techTitle}>Integração e Dados</Text>
          <Text style={styles.techText}>
            Modo atual: Dados Mockados Locais (pronto para integração REST).
          </Text>
          <Text style={styles.techText}>Endpoint base: {API_CONFIG.baseUrl}</Text>
          <Text style={styles.techText}>
            Tenant ativo: {tenant?.slug || API_CONFIG.tenantSlug} (IBGE:{' '}
            {tenant?.codigo_ibge || '3205200'})
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  content: {
    paddingBottom: 24,
  },
  header: {
    backgroundColor: '#1d4ed8',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: 'center',
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  role: {
    fontSize: 12,
    color: '#dbeafe',
    marginTop: 2,
    textAlign: 'center',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: 'rgba(255,255,255,0.14)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  verifiedText: {
    fontSize: 11,
    color: '#ecfdf5',
    marginLeft: 5,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 6,
  },
  statLabel: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 2,
  },
  statSub: {
    fontSize: 10,
    color: '#15803d',
    fontWeight: '700',
    marginTop: 2,
  },
  menuCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  menuLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
  },
  techCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  techTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 6,
  },
  techText: {
    fontSize: 12,
    color: '#4b5563',
    lineHeight: 18,
  },
});
