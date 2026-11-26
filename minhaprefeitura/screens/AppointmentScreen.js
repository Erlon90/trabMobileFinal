import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useApp } from '../context/AppContext';
import ScreenHeader from '../components/ScreenHeader';
import AppointmentForm from '../components/AppointmentForm';
import AppointmentCard from '../components/AppointmentCard';
import EmptyState from '../components/EmptyState';

export default function AppointmentScreen({ navigation }) {
  const {
    catalogoAgendamento,
    agendamentos,
    bookAppointment,
    cancelUserAppointment,
  } = useApp();

  const [mode, setMode] = useState('novo');
  const activeCount = agendamentos.filter((a) => a.status === 'Confirmado').length;

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Agendamento Municipal"
        subtitle="Atendimento presencial em Saúde e Documentos"
        onBack={() => navigation.goBack()}
      />

      <View style={styles.segmentWrapper}>
        <TouchableOpacity
          style={[styles.segmentBtn, mode === 'novo' && styles.segmentBtnActive]}
          onPress={() => setMode('novo')}
        >
          <Text style={[styles.segmentText, mode === 'novo' && styles.segmentTextActive]}>
            Novo Agendamento
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segmentBtn, mode === 'meus' && styles.segmentBtnActive]}
          onPress={() => setMode('meus')}
        >
          <Text style={[styles.segmentText, mode === 'meus' && styles.segmentTextActive]}>
            Meus Agendamentos ({activeCount})
          </Text>
        </TouchableOpacity>
      </View>

      {mode === 'novo' ? (
        <AppointmentForm
          catalogoAgendamento={catalogoAgendamento}
          agendamentos={agendamentos}
          onBook={bookAppointment}
          onViewMyAppointments={() => setMode('meus')}
        />
      ) : (
        <FlatList
          data={agendamentos}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <AppointmentCard item={item} onCancel={cancelUserAppointment} />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <EmptyState
              icon="calendar-outline"
              title="Nenhum agendamento registrado"
              description="Faça seu primeiro agendamento na aba ao lado."
              actionLabel="Agendar agora"
              onAction={() => setMode('novo')}
            />
          }
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  segmentWrapper: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: '#e5e7eb',
    borderRadius: 10,
    padding: 4,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
  },
  segmentBtnActive: {
    backgroundColor: '#ffffff',
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4b5563',
  },
  segmentTextActive: {
    color: '#1d4ed8',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 28,
  },
  separator: {
    height: 12,
  },
});
