import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing, Shadow } from '../../constants/theme';
import { Site } from '../../types';

interface SiteCardProps {
  site: Site;
  onPress: () => void;
}

const SiteCard: React.FC<SiteCardProps> = ({ site, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.88}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: site.image }} style={styles.image} />
        {site.mustVisit && (
          <View style={styles.mustVisitBadge}>
            <Ionicons name="checkmark-circle" size={10} color={Colors.white} />
            <Text style={styles.mustVisitText}>Must visit</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{site.name}</Text>
        <Text style={styles.type} numberOfLines={1}>
          {site.type || 'Site'} · {site.location}
        </Text>
        <View style={styles.meta}>
          <Ionicons name="location-outline" size={10} color={Colors.textMuted} />
          <Text style={styles.metaText}>{site.distance}</Text>
        </View>
        <View style={styles.meta}>
          <Ionicons name="ticket-outline" size={10} color={Colors.textMuted} />
          <Text style={styles.metaText}>{site.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 148,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    ...Shadow.sm,
    marginRight: Spacing.md,
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 100,
    backgroundColor: Colors.border,
  },
  mustVisitBadge: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.mustVisit,
    borderRadius: Radius.full,
    paddingHorizontal: 7,
    paddingVertical: 2,
    gap: 3,
  },
  mustVisitText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: '600',
  },
  info: {
    padding: Spacing.sm,
    gap: 2,
  },
  name: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
  },
  type: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaText: {
    fontSize: 10,
    color: Colors.textMuted,
  },
});

export default SiteCard;