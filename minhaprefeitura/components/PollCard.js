import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StatusBadge from './StatusBadge';
import { calculatePollResults } from '../utils/domainLogic.js';
import { formatDatePtBr, formatRelativeTime } from '../utils/formatters.js';

export default function PollCard({ poll, selectedOptionId, onVote, onAddComment }) {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [autor, setAutor] = useState('');
  const [bairro, setBairro] = useState('');
  const [texto, setTexto] = useState('');
  const [commentError, setCommentError] = useState('');

  const results = calculatePollResults(poll);
  const isClosed = poll.status !== 'ativa';
  const hasVoted = Boolean(selectedOptionId);
  const showResults = isClosed || hasVoted;
  const comments = Array.isArray(poll.comentarios) ? poll.comentarios : [];

  function handleSendComment() {
    const res = onAddComment(poll.id, { autor, bairro, texto });
    if (!res.ok) {
      setCommentError(res.errors?.texto || 'Escreva sua opinião antes de enviar.');
      return;
    }
    setTexto('');
    setCommentError('');
  }

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

      <TouchableOpacity
        style={styles.commentsToggle}
        onPress={() => setCommentsOpen((prev) => !prev)}
        activeOpacity={0.75}
      >
        <View style={styles.commentsToggleLeft}>
          <Ionicons name="chatbubbles-outline" size={16} color="#6d28d9" />
          <Text style={styles.commentsToggleText}>
            Opiniões da População ({comments.length})
          </Text>
        </View>
        <Ionicons
          name={commentsOpen ? 'chevron-up' : 'chevron-down'}
          size={18}
          color="#6d28d9"
        />
      </TouchableOpacity>

      {commentsOpen ? (
        <View style={styles.commentsDrawer}>
          <View style={styles.commentForm}>
            <View style={styles.inlineInputs}>
              <TextInput
                value={autor}
                onChangeText={setAutor}
                placeholder="Seu nome (opcional)"
                placeholderTextColor="#9ca3af"
                style={[styles.smallInput, { flex: 1 }]}
              />
              <TextInput
                value={bairro}
                onChangeText={setBairro}
                placeholder="Bairro (opcional)"
                placeholderTextColor="#9ca3af"
                style={[styles.smallInput, { flex: 1 }]}
              />
            </View>

            <TextInput
              value={texto}
              onChangeText={(val) => {
                setTexto(val);
                if (commentError) setCommentError('');
              }}
              placeholder="Deixe sua sugestão ou opinião sobre este tema..."
              placeholderTextColor="#9ca3af"
              multiline
              style={[styles.commentInput, commentError && styles.commentInputError]}
            />
            {commentError ? <Text style={styles.errorText}>{commentError}</Text> : null}

            <TouchableOpacity style={styles.sendCommentBtn} onPress={handleSendComment}>
              <Ionicons name="send" size={14} color="#ffffff" />
              <Text style={styles.sendCommentText}>Enviar Opinião</Text>
            </TouchableOpacity>
          </View>

          {comments.length === 0 ? (
            <Text style={styles.noCommentsText}>
              Ainda não há comentários. Seja o primeiro cidadão a opinar!
            </Text>
          ) : (
            <View style={styles.commentsList}>
              {comments.map((c) => (
                <View key={c.id} style={styles.commentItem}>
                  <View style={styles.commentHeader}>
                    <Text style={styles.commentAuthor}>
                      {c.autor} • {c.bairro}
                    </Text>
                    <Text style={styles.commentDate}>
                      {formatRelativeTime(c.criadoEm)}
                    </Text>
                  </View>
                  <Text style={styles.commentBody}>{c.texto}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      ) : null}
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
  commentsToggle: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commentsToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  commentsToggleText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6d28d9',
  },
  commentsDrawer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    gap: 10,
  },
  commentForm: {
    gap: 8,
  },
  inlineInputs: {
    flexDirection: 'row',
    gap: 8,
  },
  smallInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    fontSize: 12,
    color: '#111827',
  },
  commentInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12,
    color: '#111827',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  commentInputError: {
    borderColor: '#dc2626',
    backgroundColor: '#fef2f2',
  },
  errorText: {
    fontSize: 11,
    color: '#dc2626',
    fontWeight: '600',
  },
  sendCommentBtn: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6d28d9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  sendCommentText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  noCommentsText: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  commentsList: {
    gap: 8,
  },
  commentItem: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    gap: 8,
  },
  commentAuthor: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#374151',
    flex: 1,
  },
  commentDate: {
    fontSize: 10,
    color: '#9ca3af',
  },
  commentBody: {
    fontSize: 12,
    color: '#374151',
    lineHeight: 17,
  },
});
