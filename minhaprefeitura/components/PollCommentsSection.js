import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatRelativeTime } from '../utils/formatters.js';

export default function PollCommentsSection({ pollId, comments = [], onAddComment }) {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [autor, setAutor] = useState('');
  const [bairro, setBairro] = useState('');
  const [texto, setTexto] = useState('');
  const [commentError, setCommentError] = useState('');

  function handleSendComment() {
    const res = onAddComment(pollId, { autor, bairro, texto });
    if (!res.ok) {
      setCommentError(res.errors?.texto || 'Escreva sua opinião antes de enviar.');
      return;
    }
    setTexto('');
    setCommentError('');
  }

  return (
    <View>
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
