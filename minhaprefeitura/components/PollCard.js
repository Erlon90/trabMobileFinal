import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import StatusBadge from './StatusBadge';
import PollCommentsSection from './PollCommentsSection';
import { calculatePollResults } from '../utils/domainLogic.js';
import { formatDatePtBr } from '../utils/formatters.js';

export default function PollCard({ poll, selectedOptionId, onVote, onAddComment }) {
  const results = calculatePollResults(poll);
  const isClosed = poll.status !== 'ativa';
  const hasVoted = Boolean(selectedOptionId);
  const showResults = isClosed || hasVoted;
  const comments = Array.isArray(poll.comentarios) ? poll.comentarios : [];

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.badgesRow}>
          <StatusBadge label={poll.categoria} />
          <StatusBadge label={poll.status === 'ativa' ? 'Ativa' : 'Encerrada'} />
        </View>
        <Text style={styles.deadline}>
          {isClosed ? 'Encerrada em ' : 'Até '}
          {formatDatePtBr(poll.encerraEm)}
        </Text>
      </View>

      <Text style={styles.scope}>Abrangência: {poll.bairro}</Text>
      <Text style={styles.title}>{poll.titulo}</Text>
      <Text style={styles.description}>{poll.descricao}</Text>

      <View style={styles.optionsList}>
        {results.options.map((option) => {
          const isUserChoice = selectedOptionId === option.id;

          if (!showResults) {
            return (
              <TouchableOpacity
                key={option.id}
                style={styles.voteOptionBtn}
                onPress={() => onVote(poll.id, option.id)}
                activeOpacity={0.8}
              >
                <View style={styles.radioOuter} />
                <Text style={styles.voteOptionText}>{option.texto}</Text>
              </TouchableOpacity>
            );
          }

          return (
            <View
              key={option.id}
              style={[styles.resultBox, isUserChoice && styles.resultBoxChosen]}
            >
              <View style={styles.resultHeader}>
                <Text style={[styles.resultText, isUserChoice && styles.resultTextChosen]}>
                  {option.texto}
                </Text>
                <Text style={styles.percentText}>{option.percentual}%</Text>
              </View>

              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    isUserChoice && styles.barFillChosen,
                    { width: `${option.percentual}%` },
                  ]}
                />
              </View>

              <View style={styles.resultMeta}>
                <Text style={styles.votesCount}>{option.votos} votos</Text>
                {isUserChoice ? (
                  <Text style={styles.yourVoteTag}>✓ Seu voto</Text>
                ) : null}
              </View>
            </View>
          );
        })}
      </View>

      <Text style={styles.totalVotesText}>
        Total acumulado: {results.totalVotes}{' '}
        {results.totalVotes === 1 ? 'voto registrado' : 'votos registrados'}
        {!showResults ? ' • Toque em uma opção para votar' : ''}
      </Text>

      <PollCommentsSection
        pollId={poll.id}
        comments={comments}
        onAddComment={onAddComment}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  deadline: {
    fontSize: 11,
    color: '#6b7280',
  },
  scope: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6d28d9',
    marginBottom: 3,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111827',
    lineHeight: 21,
  },
  description: {
    fontSize: 12,
    color: '#4b5563',
    lineHeight: 18,
    marginTop: 5,
    marginBottom: 12,
  },
  optionsList: {
    gap: 8,
  },
  voteOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    padding: 11,
    gap: 10,
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#6d28d9',
  },
  voteOptionText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
  },
  resultBox: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 10,
  },
  resultBoxChosen: {
    backgroundColor: '#f5f3ff',
    borderColor: '#8b5cf6',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  resultText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
  },
  resultTextChosen: {
    color: '#5b21b6',
    fontWeight: 'bold',
  },
  percentText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#111827',
  },
  barTrack: {
    height: 7,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginTop: 7,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#9ca3af',
    borderRadius: 4,
  },
  barFillChosen: {
    backgroundColor: '#6d28d9',
  },
  resultMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  votesCount: {
    fontSize: 10,
    color: '#6b7280',
  },
  yourVoteTag: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#6d28d9',
  },
  totalVotesText: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 10,
  },
});
