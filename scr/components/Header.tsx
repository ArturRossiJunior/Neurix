import React from 'react';
import { styles } from './styles/header.styles';
import { View, Text, Image } from 'react-native';

const image = require('../../assets/hero-illustration.jpg');

export const Header = () => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image 
          source={image} 
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.imageOverlay} />
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.title}>
          Neurix
        </Text>
        <Text style={styles.subtitle}>
          Ferramenta Interativa para Auxílio na Identificação de TDAH em Crianças
        </Text>
        <Text style={styles.description}>
          Uma experiência de aprendizado personalizada através de jogos sérios e análise de dados
        </Text>
      </View>
    </View>
  );
};