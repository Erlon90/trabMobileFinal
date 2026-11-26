import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useApp } from '../context/AppContext';
import ScreenHeader from '../components/ScreenHeader';
import PollCard from '../components/PollCard';
import EmptyState from '../components/EmptyState';

const FILTERS = [
  'Todas',
  'Prioridades de Bairros',
  'Projetos da Cidade',
  'Encerradas',
];

export default function PollsScreen() {
  const { enquetes, votedPollIds, voteInPoll, commentOnPoll, goBack } = useApp();
  const [filter, setFilter] = useState('Todas');

  const activeCount = enquetes.filter((p) => p.status === 'ativa').length;
  const userVotesCount = Object.keys(votedPollIds).length;

  const filteredPolls = useMemo(() => {
    return enquetes.filter((poll) => {
      if (filter === 'Prioridades de Bairros') {
        return poll.categoria === 'Prioridade de Bairro';
      }
      if (filter === 'Projetos da Cidade') {
        return poll.categoria === 'Projeto da Cidade';
      }
      if (filter === 'Encerradas') {
        return poll.status === 'encerrada';
      }
      return true;
    });
  }, [enquetes, filter]);

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Enquetes e Consulta Popular"
        subtitle="Participe das decisões da sua cidade"
        onBack={goBack}
      />

      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{activeCount}</Text>
          <Text style={styles.summaryLabel}>Consultas abertas</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={[styles.summaryValue, { color: '#6d28d9' }]}>
            {userVotesCount}
          </Text>
          <Text style={styles.summaryLabel}>Seus votos na sessão</Text>
        </View>
      </View>

      <View style={styles.chipsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContent}
        >
          {FILTERS.map((item) => {
            const active = filter === item;
            return (
              <TouchableOpacity
                key={item}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setFilter(item)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {item}
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
        {filteredPolls.length === 0 ? (
          <EmptyState
            icon="bar-chart-outline"
            title="Nenhuma enquete nesta categoria"
            description="Selecione outro filtro para visualizar consultas disponíveis."
            actionLabel="Ver todas"
            onAction={() => setFilter('Todas')}
          />
        ) : (
          <View style={styles.list}>
            {filteredPolls.map((poll) => (
              <PollCard
                key={poll.id}
                poll={poll}
                selectedOptionId={votedPollIds[poll.id]}
                onVote={voteInPoll}
                onAddComment={commentOnPoll}
              />
            ))}
          </View>
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
  summaryRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 12,
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  summaryValue: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#1d4ed8',
  },
  summaryLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
    fontWeight: '600',
  },
  chipsWrapper: {
    paddingVertical: 10,
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
    backgroundColor: '#6d28d9',
    borderColor: '#6d28d9',
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
    paddingHorizontal: 16,
    paddingBottom: 28,
  },
  list: {
    gap: 12,
  },
});
