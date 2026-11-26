import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import ScreenHeader from '../components/ScreenHeader';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import { formatDatePtBr, formatRelativeTime, stripHtml } from '../utils/formatters.js';

export default function NewsDetailScreen({ routeParams }) {
  const { noticias, tenant, goBack } = useApp();
  const [imageFailed, setImageFailed] = useState(false);

  const slug = routeParams?.slug;
  const noticia = noticias.find((item) => item.slug === slug);

  if (!noticia) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Detalhes da Notícia" onBack={goBack} />
        <View style={styles.bodyPadding}>
          <EmptyState
            icon="alert-circle-outline"
            title="Notícia não encontrada"
            description="O conteúdo selecionado não está mais disponível."
            actionLabel="Voltar"
            onAction={goBack}
          />
        </View>
      </View>
    );
  }

  const hasImage = Boolean(noticia.imagem_capa_url) && !imageFailed;
  const plainBody = stripHtml(noticia.conteudo);

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Detalhes da Notícia"
        subtitle={noticia.categoria || 'Comunicado Oficial'}
        onBack={goBack}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {hasImage ? (
          <Image
            source={{ uri: noticia.imagem_capa_url }}
            style={styles.coverImage}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <View style={styles.coverFallback}>
            <Ionicons name="newspaper-outline" size={44} color="#1d4ed8" />
            <Text style={styles.coverFallbackText}>Comunicado Oficial da Prefeitura</Text>
          </View>
        )}

        <View style={styles.articleCard}>
          <View style={styles.metaRow}>
            <StatusBadge label={noticia.categoria || 'Geral'} />
            <View style={styles.dateBox}>
              <Ionicons name="calendar-outline" size={13} color="#6b7280" />
              <Text style={styles.dateText}>
                {formatDatePtBr(noticia.publicado_em)} • {formatRelativeTime(noticia.publicado_em)}
              </Text>
            </View>
          </View>

          <Text style={styles.title}>{noticia.titulo}</Text>

          <View style={styles.summaryBox}>
            <Text style={styles.summaryText}>{noticia.resumo}</Text>
          </View>

          <Text style={styles.bodyText}>{plainBody}</Text>

          <View style={styles.footerInfo}>
            <Ionicons name="checkmark-circle" size={16} color="#15803d" />
            <Text style={styles.footerText}>
              Fonte oficial: {tenant?.nome || 'Prefeitura Municipal'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  bodyPadding: {
    padding: 16,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 28,
  },
  coverImage: {
    width: '100%',
    height: 210,
    backgroundColor: '#e5e7eb',
  },
  coverFallback: {
    width: '100%',
    height: 170,
    backgroundColor: '#eff6ff',
    borderBottomWidth: 1,
    borderBottomColor: '#bfdbfe',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  coverFallbackText: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '600',
    color: '#1d4ed8',
  },
  articleCard: {
    margin: 16,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  dateBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 11,
    color: '#6b7280',
    marginLeft: 4,
  },
  title: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#111827',
    lineHeight: 26,
    marginBottom: 12,
  },
  summaryBox: {
    backgroundColor: '#eff6ff',
    borderLeftWidth: 4,
    borderLeftColor: '#1d4ed8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 14,
  },
  summaryText: {
    fontSize: 13,
    color: '#1e3a8a',
    lineHeight: 19,
    fontWeight: '500',
  },
  bodyText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
  },
  footerInfo: {
    marginTop: 18,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#4b5563',
    marginLeft: 6,
    fontWeight: '500',
  },
});
