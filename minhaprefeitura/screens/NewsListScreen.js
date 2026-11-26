import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import NewsCard from '../components/NewsCard';
import EmptyState from '../components/EmptyState';
import { normalizeSearchText, stripHtml } from '../utils/formatters.js';

const CATEGORIES = [
  'Todas',
  'Saúde',
  'Obras',
  'Educação',
  'Transporte',
  'Meio Ambiente',
  'Cultura',
];

export default function NewsListScreen() {
  const { noticias, searchQuery, setSearchQuery, navigate } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  const filteredNews = useMemo(() => {
    const query = normalizeSearchText(searchQuery);
    const categoryNorm = normalizeSearchText(selectedCategory);

    return noticias.filter((item) => {
      if (categoryNorm !== 'todas' && normalizeSearchText(item.categoria) !== categoryNorm) {
        return false;
      }
      if (!query) return true;
      const searchable = normalizeSearchText(
        `${item.titulo} ${item.resumo} ${item.categoria} ${stripHtml(item.conteudo)}`
      );
      return searchable.includes(query);
    });
  }, [noticias, searchQuery, selectedCategory]);

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <View style={styles.topRow}>
          <View>
            <Text style={styles.headerTitle}>Notícias Municipais</Text>
            <Text style={styles.headerSubtitle}>
              Fique por dentro das ações e comunicados oficiais
            </Text>
          </View>
          <TouchableOpacity
            style={styles.bellBtn}
            onPress={() => navigate('notificacoes')}
          >
            <Ionicons name="notifications-outline" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#9ca3af" style={styles.searchIcon} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Filtrar notícias por assunto..."
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

      <View style={styles.chipsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContent}
        >
          {CATEGORIES.map((category) => {
            const active = selectedCategory === category;
            return (
              <TouchableOpacity
                key={category}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setSelectedCategory(category)}
                activeOpacity={0.8}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.listScroll}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.countLabel}>
          {filteredNews.length}{' '}
          {filteredNews.length === 1 ? 'publicação encontrada' : 'publicações encontradas'}
        </Text>

        {filteredNews.length === 0 ? (
          <EmptyState
            title="Nenhuma notícia encontrada"
            description="Altere a categoria selecionada ou limpe o termo de busca."
            actionLabel="Mostrar todas"
            onAction={() => {
              setSelectedCategory('Todas');
              setSearchQuery('');
            }}
          />
        ) : (
          <View style={styles.newsList}>
            {filteredNews.map((item) => (
              <NewsCard
                key={item.id}
                item={item}
                showSummary
                onPress={() => navigate('newsDetail', { slug: item.slug })}
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
  topHeader: {
    backgroundColor: '#1d4ed8',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 18,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
  },
  bellBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.16)',
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: '#1d4ed8',
    borderColor: '#1d4ed8',
  },
  chipText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#ffffff',
  },
  listScroll: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  countLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 10,
    fontWeight: '600',
  },
  newsList: {
    gap: 10,
  },
});
