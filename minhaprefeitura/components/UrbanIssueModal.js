import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RADAR_CATEGORIES } from '../data/mockData.js';

const SEVERITIES = ['Baixa', 'Média', 'Alta'];

const INITIAL_FORM = {
  categoria: '',
  titulo: '',
  endereco: '',
  bairro: '',
  pontoReferencia: '',
  gravidade: 'Média',
  recorrente: false,
  descricao: '',
};

export default function UrbanIssueModal({ visible, onClose, onSubmit, onSuccess }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function handleClose() {
    setErrors({});
    onClose();
  }

  function handleSave() {
    const result = onSubmit(form);
    if (!result.ok) {
      setErrors(result.errors || {});
      return;
    }
    setForm(INITIAL_FORM);
    setErrors({});
    onSuccess(result.item);
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Nova Ocorrência — Radar Urbano</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#4b5563" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.formBody}>
            <Text style={styles.label}>Categoria da ocorrência *</Text>
            <View
              style={[
                styles.categoriesWrap,
                errors.categoria && styles.categoriesWrapError,
              ]}
            >
              {RADAR_CATEGORIES.map((cat) => {
                const active = form.categoria === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.categoryChip, active && styles.categoryChipActive]}
                    onPress={() => updateField('categoria', cat)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        active && styles.categoryChipTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {errors.categoria ? <Text style={styles.errorText}>{errors.categoria}</Text> : null}

            <Text style={styles.label}>Título resumido *</Text>
            <TextInput
              value={form.titulo}
              onChangeText={(text) => updateField('titulo', text)}
              placeholder="Ex: Poste apagado próximo à faixa de pedestres"
              placeholderTextColor="#9ca3af"
              style={[styles.input, errors.titulo && styles.inputError]}
            />
            {errors.titulo ? <Text style={styles.errorText}>{errors.titulo}</Text> : null}

            <Text style={styles.label}>Endereço / Rua e número *</Text>
            <TextInput
              value={form.endereco}
              onChangeText={(text) => updateField('endereco', text)}
              placeholder="Ex: Av. Champagnat, 450"
              placeholderTextColor="#9ca3af"
              style={[styles.input, errors.endereco && styles.inputError]}
            />
            {errors.endereco ? <Text style={styles.errorText}>{errors.endereco}</Text> : null}

            <Text style={styles.label}>Bairro *</Text>
            <TextInput
              value={form.bairro}
              onChangeText={(text) => updateField('bairro', text)}
              placeholder="Ex: Praia da Costa"
              placeholderTextColor="#9ca3af"
              style={[styles.input, errors.bairro && styles.inputError]}
            />
            {errors.bairro ? <Text style={styles.errorText}>{errors.bairro}</Text> : null}

            <Text style={styles.label}>Ponto de referência (opcional)</Text>
            <TextInput
              value={form.pontoReferencia}
              onChangeText={(text) => updateField('pontoReferencia', text)}
              placeholder="Ex: Em frente à praça principal"
              placeholderTextColor="#9ca3af"
              style={styles.input}
            />

            <Text style={styles.label}>Gravidade *</Text>
            <View style={styles.severityRow}>
              {SEVERITIES.map((sev) => {
                const active = form.gravidade === sev;
                return (
                  <TouchableOpacity
                    key={sev}
                    style={[styles.severityChip, active && styles.severityChipActive]}
                    onPress={() => updateField('gravidade', sev)}
                  >
                    <Text style={[styles.severityText, active && styles.severityTextActive]}>
                      {sev}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {errors.gravidade ? <Text style={styles.errorText}>{errors.gravidade}</Text> : null}

            <View style={styles.switchRow}>
              <View style={styles.switchInfo}>
                <Text style={styles.switchTitle}>Problema recorrente</Text>
                <Text style={styles.switchSubtitle}>
                  Já ocorreu ou foi consertado antes e voltou a aparecer
                </Text>
              </View>
              <Switch
                value={form.recorrente}
                onValueChange={(val) => updateField('recorrente', val)}
                trackColor={{ false: '#d1d5db', true: '#fdba74' }}
                thumbColor={form.recorrente ? '#c2410c' : '#f3f4f6'}
              />
            </View>

            <Text style={styles.label}>Descrição da ocorrência *</Text>
            <TextInput
              value={form.descricao}
              onChangeText={(text) => updateField('descricao', text)}
              placeholder="Descreva os detalhes da ocorrência, impactos no local e possíveis riscos..."
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={4}
              style={[styles.input, styles.textArea, errors.descricao && styles.inputError]}
            />
            {errors.descricao ? <Text style={styles.errorText}>{errors.descricao}</Text> : null}

            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={handleClose}>
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={handleSave}>
                <Text style={styles.submitBtnText}>Registrar Ocorrência</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingTop: 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  closeBtn: {
    padding: 4,
  },
  formBody: {
    padding: 18,
    paddingBottom: 28,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    marginTop: 12,
    marginBottom: 6,
  },
  categoriesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 4,
    borderRadius: 10,
  },
  categoriesWrapError: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    padding: 8,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
  },
  categoryChipActive: {
    backgroundColor: '#1d4ed8',
    borderColor: '#1d4ed8',
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  categoryChipTextActive: {
    color: '#ffffff',
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
  textArea: {
    minHeight: 88,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 11,
    color: '#dc2626',
    marginTop: 4,
    fontWeight: '600',
  },
  severityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  severityChip: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  severityChipActive: {
    backgroundColor: '#c2410c',
    borderColor: '#c2410c',
  },
  severityText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
  severityTextActive: {
    color: '#ffffff',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff7ed',
    borderWidth: 1,
    borderColor: '#fed7aa',
    borderRadius: 10,
    padding: 12,
    marginTop: 14,
  },
  switchInfo: {
    flex: 1,
    marginRight: 10,
  },
  switchTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#9a3412',
  },
  switchSubtitle: {
    fontSize: 11,
    color: '#7c2d12',
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4b5563',
  },
  submitBtn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#1d4ed8',
    alignItems: 'center',
  },
  submitBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
