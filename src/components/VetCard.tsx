import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Radius, Shadow, Spacing } from '../lib/constants';
import type { Vet } from '../types';

interface VetCardProps {
  vet: Vet;
  onPress: () => void;
}

export default function VetCard({ vet, onPress }: VetCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: vet.image_url || 'https://via.placeholder.com/150' }}
          style={styles.image}
        />
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{vet.name}</Text>
        <Text style={styles.specialty} numberOfLines={1}>{vet.specialty}</Text>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="star" size={13} color={Colors.primaryBorder} />
            <Text style={styles.metaText}>{vet.rating}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    width: '48%',
    paddingBottom: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadow.md,
  },
  imageContainer: {
    alignItems: 'center',
    paddingTop: Spacing.sm,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: Radius.full,
    borderWidth: 3,
    borderColor: Colors.primaryBorder,
  },
  info: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
  },
  name: {
    ...Typography.smallSemiBold,
    color: '#F5F5F5',
  },
  specialty: {
    ...Typography.caption,
    color: Colors.textDark,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
    gap: Spacing.lg,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    ...Typography.caption,
    color: Colors.textDark,
  },
});
