import React, { useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import SearchBar from '../components/SearchBar';
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

export default function NewsListScreen({ navigation }) {
  const { noticias, searchQuery, setSearchQuery } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  const query = normalizeSearchText(searchQuery);
  const categoryNorm = normalizeSearchText(selectedCategory);

  const filteredNews = noticias.filter((item) => {
    if (categoryNorm !== 'todas' && normalizeSearchText(item.categoria) !== categoryNorm) {
      return false;
    }
    if (!query) return true;
    const searchable = normalizeSearchText(
      `${item.titulo} ${item.resumo} ${item.categoria} ${stripHtml(item.conteudo)}`
    );
    return searchable.includes(query);
  });

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <View style={styles.topRow}>
          <View style={styles.headerTextCol}>
            <Text style={styles.headerTitle}>Notícias Municipais</Text>
            <Text style={styles.headerSubtitle}>
              Fique por dentro das ações e comunicados oficiais
            </Text>
          </View>
          <TouchableOpacity
            style={styles.bellBtn}
            onPress={() => navigation.navigate('Notifications')}
            accessibilityLabel="Abrir avisos e notificações"
          >
            <Ionicons name="notifications-outline" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Filtrar notícias por assunto..."
        />
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

      <Text style={styles.countLabel}>
        {filteredNews.length}{' '}
        {filteredNews.length === 1 ? 'publicação encontrada' : 'publicações encontradas'}
      </Text>

      <FlatList
        data={filteredNews}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <NewsCard
            item={item}
            showSummary
            onPress={() => navigation.navigate('NewsDetail', { slug: item.slug })}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <EmptyState
            title="Nenhuma notícia encontrada"
            description="Altere a categoria selecionada ou limpe o termo de busca."
            actionLabel="Mostrar todas"
            onAction={() => {
              setSelectedCategory('Todas');
              setSearchQuery('');
            }}
          />
        }
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
  headerTextCol: {
    flex: 1,
    marginRight: 10,
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
  countLabel: {
    fontSize: 11,
    color: '#6b7280',
    paddingHorizontal: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  separator: {
    height: 10,
  },
});
