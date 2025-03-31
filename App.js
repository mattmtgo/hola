// App.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button, FlatList } from 'react-native';
import { db } from './firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const colors = ['red', 'blue', 'green', 'yellow'];

export default function App() {
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [message, setMessage] = useState("Presiona 'Iniciar' para jugar");
  const [scores, setScores] = useState([]);

  useEffect(() => {
    fetchScores();
  }, []);

  const generateNextStep = () => {
    const nextColor = colors[Math.floor(Math.random() * colors.length)];
    setSequence((prev) => [...prev, nextColor]);
    setUserSequence([]);
    setIsPlaying(true);
    setMessage('Observa la secuencia...');
    playSequence([...sequence, nextColor]);
  };

  const playSequence = (seq) => {
    seq.forEach((color, index) => {
      setTimeout(() => {
        setMessage(`Paso ${index + 1}: ${color}`);
      }, (index + 1) * 1000);
    });
    setTimeout(() => {
      setMessage('Repite la secuencia');
    }, seq.length * 1000);
  };

  const handleUserClick = (color) => {
    if (!isPlaying) return;
    const newUserSequence = [...userSequence, color];
    setUserSequence(newUserSequence);
    const index = newUserSequence.length - 1;
    if (newUserSequence[index] !== sequence[index]) {
      setMessage('¡Perdiste! Inténtalo de nuevo.');
      setIsPlaying(false);
      saveScore(sequence.length - 1);
      setSequence([]);
    } else if (newUserSequence.length === sequence.length) {
      setMessage('¡Bien hecho! Ahora un paso más...');
      setTimeout(() => generateNextStep(), 1000);
    }
  };

  const saveScore = async (score) => {
    try {
      await addDoc(collection(db, 'scores'), { score, timestamp: new Date() });
      fetchScores();
    } catch (error) {
      console.error('Error al guardar la puntuación:', error);
    }
  };

  const fetchScores = async () => {
    try {
      const scoresCollection = await getDocs(collection(db, 'scores'));
      const scoresList = scoresCollection.docs.map((doc) => doc.data());
      setScores(scoresList);
    } catch (error) {
      console.error('Error al obtener las puntuaciones:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Memoria Rápida</Text>
      <Text style={styles.message}>{message}</Text>
      <View style={styles.gameBoard}>
        {colors.map((color) => (
          <TouchableOpacity
            key={color}
            style={[styles.colorButton, { backgroundColor: color }]}
            onPress={() => handleUserClick(color)}
          />
        ))}
      </View>
      <Button title="Iniciar" onPress={generateNextStep} disabled={isPlaying} />
      <Text style={styles.scoresTitle}>Puntuaciones</Text>
      <FlatList
        data={scores}
        renderItem={({ item, index }) => (
          <Text key={index} style={styles.scoreItem}>
            Puntaje: {item.score}
          </Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 18,
    marginVertical: 20,
  },
  gameBoard: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  colorButton: {
    width: 50,
    height: 50,
    margin: 10,
  },
  scoresTitle: {
    fontSize: 20,
    marginTop: 20,
  },
  scoreItem: {
    fontSize: 16,
  },
});