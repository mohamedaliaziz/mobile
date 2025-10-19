import React, { memo } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Service } from '../types';
import { componentStyles, colors } from '../styles';

interface ServiceSliderProps {
  services: Service[];
  loading: boolean;
  onServicePress: (service: Service) => void;
  scrollRef: React.RefObject<ScrollView>;
  snapInterval: number;
}

export const ServiceSlider: React.FC<ServiceSliderProps> = memo(({
  services,
  loading,
  onServicePress,
  scrollRef,
  snapInterval,
}) => {
  if (loading) {
    return (
      <View style={componentStyles.services.container}>
        <Text style={componentStyles.services.loadingText}>جاري تحميل الخدمات...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={componentStyles.services.scrollContainer}
      snapToInterval={snapInterval}
      decelerationRate="fast"
      snapToAlignment="start"
    >
      {services.map((service, index) => (
        <ServiceItem
          key={service.key || index}
          service={service}
          onPress={onServicePress}
        />
      ))}
    </ScrollView>
  );
});

const ServiceItem: React.FC<{ service: Service; onPress: (service: Service) => void }> = memo(({ 
  service, 
  onPress 
}) => (
  <View style={componentStyles.services.item}>
    <TouchableOpacity
      onPress={() => onPress(service)}
      activeOpacity={0.85}
      style={componentStyles.services.circle}
    >
      <Ionicons 
        name={service.icon as any} 
        size={30} 
        color={colors.primary[500]} 
      />
    </TouchableOpacity>
    <Text 
      numberOfLines={1} 
      style={componentStyles.services.title}
    >
      {service.name}
    </Text>
    <Text style={componentStyles.services.price}>
      {service.price > 0 ? `${service.price} ر.س` : 'سعر متغير'}
    </Text>
  </View>
));