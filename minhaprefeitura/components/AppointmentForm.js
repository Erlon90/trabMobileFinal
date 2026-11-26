import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAvailableSlots } from '../utils/domainLogic.js';
import { formatDatePtBr } from '../utils/formatters.js';
import { formatCpf } from '../utils/validators.js';

export default function AppointmentForm({
  catalogoAgendamento,
  agendamentos,
  onBook,
  onViewMyAppointments,
}) {
  const [categoria, setCategoria] = useState('saude');
  const [servicoId, setServicoId] = useState('');
  const [unidadeId, setUnidadeId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedHorario, setSelectedHorario] = useState('');
  const [cidadaoNome, setCidadaoNome] = useState('Mariana Oliveira');
  const [cidadaoCpf, setCidadaoCpf] = useState('');
  const [errors, setErrors] = useState({});
  const [receipt, setReceipt] = useState(null);

  const areaData = catalogoAgendamento?.[categoria];
  const datasDisponiveis = catalogoAgendamento?.datasDisponiveis || [];
  const horariosPadrao = catalogoAgendamento?.horariosPadrao || [];

  useEffect(() => {
    if (!catalogoAgendamento) return;
    const currentArea = catalogoAgendamento[categoria];
    if (currentArea?.servicos?.length && !currentArea.servicos.some((s) => s.id === servicoId)) {
      setServicoId(currentArea.servicos[0].id);
    }
    if (currentArea?.unidades?.length && !currentArea.unidades.some((u) => u.id === unidadeId)) {
      setUnidadeId(currentArea.unidades[0].id);
    }
    if (!selectedDate && datasDisponiveis.length > 0) {
      setSelectedDate(datasDisponiveis[0]);
    }
  }, [catalogoAgendamento, categoria, servicoId, unidadeId, selectedDate, datasDisponiveis]);

  const slots = getAvailableSlots(horariosPadrao, agendamentos, unidadeId, selectedDate);

  useEffect(() => {
    const currentSlot = slots.find((s) => s.horario === selectedHorario);
    if (selectedHorario && (!currentSlot || !currentSlot.disponivel)) {
      setSelectedHorario('');
    }
  }, [agendamentos, unidadeId, selectedDate, selectedHorario]);

  function handleSelectArea(nextCategoria) {
    setCategoria(nextCategoria);
    const nextArea = catalogoAgendamento?.[nextCategoria];
    setServicoId(nextArea?.servicos?.[0]?.id || '');
    setUnidadeId(nextArea?.unidades?.[0]?.id || '');
    setSelectedHorario('');
    setErrors({});
  }

  function handleBook() {
    const selectedService = areaData?.servicos?.find((s) => s.id === servicoId);
    const selectedUnit = areaData?.unidades?.find((u) => u.id === unidadeId);

    const result = onBook(
      {
        categoria,
        servicoId,
        unidadeId,
        data: selectedDate,
        horario: selectedHorario,
        cidadaoNome,
        cidadaoCpf,
      },
      {
        servicoNome: selectedService?.nome || servicoId,
        unidadeNome: selectedUnit?.nome || unidadeId,
      }
    );

    if (!result.ok) {
      setErrors(result.errors || {});
      return;
    }

    setErrors({});
    setSelectedHorario('');
    setReceipt(result.item);
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.formContainer}>
        {receipt ? (
          <View style={styles.receiptBanner}>
            <View style={styles.receiptHeader}>
              <Ionicons name="checkmark-circle" size={22} color="#15803d" />
              <Text style={styles.receiptTitle}>
                Agendamento Confirmado! • {receipt.protocolo}
              </Text>
            </View>
            <Text style={styles.receiptLine}>
              {receipt.servicoNome} em {receipt.unidadeNome}
            </Text>
            <Text style={styles.receiptLine}>
              Data: {formatDatePtBr(receipt.data)} às {receipt.horario}
            </Text>
            <View style={styles.receiptActions}>
              <TouchableOpacity
                style={styles.receiptBtn}
                onPress={onViewMyAppointments}
              >
                <Text style={styles.receiptBtnText}>Ver em Meus Agendamentos</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setReceipt(null)}>
                <Text style={styles.receiptCloseText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        <Text style={styles.stepTitle}>1. Escolha a área de atendimento</Text>
        <View style={styles.areaRow}>
          <TouchableOpacity
            style={[styles.areaCard, categoria === 'saude' && styles.areaCardActive]}
            onPress={() => handleSelectArea('saude')}
          >
            <Ionicons
              name="medkit-outline"
              size={20}
              color={categoria === 'saude' ? '#ffffff' : '#1d4ed8'}
            />
            <Text style={[styles.areaText, categoria === 'saude' && styles.areaTextActive]}>
              Postos de Saúde
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.areaCard,
              categoria === 'documentos' && styles.areaCardActive,
            ]}
            onPress={() => handleSelectArea('documentos')}
          >
            <Ionicons
              name="document-text-outline"
              size={20}
              color={categoria === 'documentos' ? '#ffffff' : '#1d4ed8'}
            />
            <Text
              style={[
                styles.areaText,
                categoria === 'documentos' && styles.areaTextActive,
              ]}
            >
              Documentos
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.stepTitle}>2. Selecione o serviço</Text>
        <View style={styles.optionsList}>
          {(areaData?.servicos || []).map((srv) => {
            const selected = srv.id === servicoId;
            return (
              <TouchableOpacity
                key={srv.id}
                style={[styles.selectCard, selected && styles.selectCardActive]}
                onPress={() => {
                  setServicoId(srv.id);
                  setErrors((prev) => ({ ...prev, servicoId: undefined }));
                }}
              >
                <View style={styles.selectCardTop}>
                  <Text style={styles.selectCardTitle}>{srv.nome}</Text>
                  <Text style={styles.durationTag}>{srv.duracaoMin} min</Text>
                </View>
                <Text style={styles.selectCardSub}>
                  Documentos: {srv.documentosNecessarios}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {errors.servicoId ? <Text style={styles.errorText}>{errors.servicoId}</Text> : null}

        <Text style={styles.stepTitle}>3. Selecione a unidade</Text>
        <View style={styles.optionsList}>
          {(areaData?.unidades || []).map((unit) => {
            const selected = unit.id === unidadeId;
            return (
              <TouchableOpacity
                key={unit.id}
                style={[styles.selectCard, selected && styles.selectCardActive]}
                onPress={() => {
                  setUnidadeId(unit.id);
                  setSelectedHorario('');
                  setErrors((prev) => ({ ...prev, unidadeId: undefined }));
                }}
              >
                <Text style={styles.selectCardTitle}>{unit.nome}</Text>
                <Text style={styles.selectCardSub}>{unit.endereco}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {errors.unidadeId ? <Text style={styles.errorText}>{errors.unidadeId}</Text> : null}

        <Text style={styles.stepTitle}>4. Escolha a data e o horário</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.datesRow}
        >
          {datasDisponiveis.map((dateIso) => {
            const active = selectedDate === dateIso;
            return (
              <TouchableOpacity
                key={dateIso}
                style={[styles.dateChip, active && styles.dateChipActive]}
                onPress={() => {
                  setSelectedDate(dateIso);
                  setSelectedHorario('');
                  setErrors((prev) => ({ ...prev, data: undefined }));
                }}
              >
                <Text style={[styles.dateChipText, active && styles.dateChipTextActive]}>
                  {formatDatePtBr(dateIso)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.slotsGrid}>
          {slots.map((slot) => {
            const isSelected = selectedHorario === slot.horario;
            return (
              <TouchableOpacity
                key={slot.horario}
                disabled={!slot.disponivel}
                style={[
                  styles.slotBtn,
                  !slot.disponivel && styles.slotBtnOccupied,
                  isSelected && styles.slotBtnSelected,
                ]}
                onPress={() => {
                  setSelectedHorario(slot.horario);
                  setErrors((prev) => ({ ...prev, horario: undefined }));
                }}
              >
                <Text
                  style={[
                    styles.slotTime,
                    !slot.disponivel && styles.slotTimeOccupied,
                    isSelected && styles.slotTimeSelected,
                  ]}
                >
                  {slot.horario}
                </Text>
                {!slot.disponivel ? (
                  <Text style={styles.occupiedLabel}>Ocupado</Text>
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>
        {errors.horario ? <Text style={styles.errorText}>{errors.horario}</Text> : null}

        <Text style={styles.stepTitle}>5. Dados do cidadão</Text>
        <View style={styles.citizenCard}>
          <Text style={styles.inputLabel}>Nome completo *</Text>
          <TextInput
            value={cidadaoNome}
            onChangeText={(text) => {
              setCidadaoNome(text);
              if (errors.cidadaoNome) {
                setErrors((prev) => ({ ...prev, cidadaoNome: undefined }));
              }
            }}
            placeholder="Informe seu nome completo"
            placeholderTextColor="#9ca3af"
            style={[styles.input, errors.cidadaoNome && styles.inputError]}
          />
          {errors.cidadaoNome ? (
            <Text style={styles.errorText}>{errors.cidadaoNome}</Text>
          ) : null}

          <Text style={styles.inputLabel}>CPF *</Text>
          <TextInput
            value={cidadaoCpf}
            onChangeText={(text) => {
              setCidadaoCpf(formatCpf(text));
              if (errors.cidadaoCpf) {
                setErrors((prev) => ({ ...prev, cidadaoCpf: undefined }));
              }
            }}
            placeholder="000.000.000-00"
            placeholderTextColor="#9ca3af"
            keyboardType="numeric"
            maxLength={14}
            style={[styles.input, errors.cidadaoCpf && styles.inputError]}
          />
          {errors.cidadaoCpf ? (
            <Text style={styles.errorText}>{errors.cidadaoCpf}</Text>
          ) : null}
        </View>

        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleBook}
          activeOpacity={0.85}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color="#ffffff" />
          <Text style={styles.submitBtnText}>Confirmar Agendamento</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 28,
  },
  formContainer: {
    gap: 8,
  },
  receiptBanner: {
    backgroundColor: '#dcfce7',
    borderWidth: 1,
    borderColor: '#86efac',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  receiptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  receiptTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#166534',
    flex: 1,
  },
  receiptLine: {
    fontSize: 12,
    color: '#15803d',
    marginTop: 2,
  },
  receiptActions: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptBtn: {
    backgroundColor: '#15803d',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  receiptBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  receiptCloseText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#166534',
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 10,
    marginBottom: 4,
  },
  areaRow: {
    flexDirection: 'row',
    gap: 10,
  },
  areaCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  areaCardActive: {
    backgroundColor: '#1d4ed8',
    borderColor: '#1d4ed8',
  },
  areaText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1d4ed8',
  },
  areaTextActive: {
    color: '#ffffff',
  },
  optionsList: {
    gap: 8,
  },
  selectCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
  },
  selectCardActive: {
    borderColor: '#1d4ed8',
    backgroundColor: '#eff6ff',
  },
  selectCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  selectCardTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
  },
  durationTag: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1d4ed8',
    backgroundColor: '#dbeafe',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
  },
  selectCardSub: {
    fontSize: 11,
    color: '#4b5563',
    marginTop: 4,
    lineHeight: 16,
  },
  datesRow: {
    gap: 8,
    paddingVertical: 4,
  },
  dateChip: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  dateChipActive: {
    backgroundColor: '#1d4ed8',
    borderColor: '#1d4ed8',
  },
  dateChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
  dateChipTextActive: {
    color: '#ffffff',
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  slotBtn: {
    width: '23%',
    minWidth: 72,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotBtnSelected: {
    backgroundColor: '#1d4ed8',
    borderColor: '#1d4ed8',
  },
  slotBtnOccupied: {
    backgroundColor: '#f3f4f6',
    borderColor: '#e5e7eb',
  },
  slotTime: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#111827',
  },
  slotTimeSelected: {
    color: '#ffffff',
  },
  slotTimeOccupied: {
    color: '#9ca3af',
    textDecorationLine: 'line-through',
  },
  occupiedLabel: {
    fontSize: 9,
    color: '#ef4444',
    fontWeight: '700',
    marginTop: 2,
  },
  citizenCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    marginTop: 6,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#111827',
  },
  inputError: {
    borderColor: '#dc2626',
    backgroundColor: '#fef2f2',
  },
  errorText: {
    fontSize: 11,
    color: '#dc2626',
    marginTop: 4,
    fontWeight: '600',
  },
  submitBtn: {
    marginTop: 14,
    backgroundColor: '#1d4ed8',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
