import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

type Pair = {
  id: number;
  tr: string;
  ar: string;
};

const initialPairs: Pair[] = [
  { id: 1, tr: 'Ben', ar: 'أنا' },
  { id: 2, tr: 'Sen (erkek)', ar: 'أنتَ' },
  { id: 3, tr: 'O (erkek)', ar: 'هو' },
  { id: 4, tr: 'O (kadın)', ar: 'هي' },
];

const shuffle = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

export default function MatchingGameScreen() {
  const [turkish, setTurkish] = useState<Pair[]>(shuffle(initialPairs));
  const [arabic, setArabic] = useState<Pair[]>(shuffle(initialPairs));
  const [selectedTr, setSelectedTr] = useState<Pair | null>(null);
  const [matches, setMatches] = useState<{ [key: number]: boolean }>({});
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [gameOver, setGameOver] = useState<boolean>(false);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
      Alert.alert('Süre doldu', `Skorun: ${score}`);
    }
  }, [timeLeft, gameOver]);

  const handleSelect = (type: 'tr' | 'ar', item: Pair) => {
    if (gameOver || matches[item.id]) return;

    if (type === 'tr') {
      setSelectedTr(item);
    } else if (selectedTr) {
      if (selectedTr.id === item.id) {
        setMatches((prev) => ({ ...prev, [item.id]: true }));
        setScore((prev) => prev + 10);
      } else {
        Alert.alert('Hatalı eşleşme', 'Tekrar dene!');
      }
      setSelectedTr(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Zamirleri Eşleştir</Text>
      <Text style={styles.info}>Süre: {timeLeft}s | Skor: {score}</Text>

      <View style={styles.row}>
        <View style={styles.column}>
          {turkish.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.card, matches[item.id] && styles.matched]}
              onPress={() => handleSelect('tr', item)}
            >
              <Text style={styles.text}>{item.tr}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.column}>
          {arabic.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.card, matches[item.id] && styles.matched]}
              onPress={() => handleSelect('ar', item)}
            >
              <Text style={styles.text}>{item.ar}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#111' },
  title: { fontSize: 24, color: '#fff', marginBottom: 10, textAlign: 'center' },
  info: { fontSize: 18, color: '#fff', textAlign: 'center', marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  column: { flex: 1 },
  card: {
    backgroundColor: '#222',
    padding: 15,
    margin: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  matched: { backgroundColor: 'green' },
  text: { color: '#fff', fontSize: 18 },
});
