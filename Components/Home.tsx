import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';

const Home = ({navigation}: any) => {
  const [lots, setLots] = useState<number>(0);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter number of Parking Lots"
        placeholderTextColor={'grey'}
        keyboardType="numeric"
        onChangeText={text => setLots(Number(text))}
        style={styles.textInput}
      />
      <Button
        mode="contained"
        disabled={!lots}
        uppercase={false}
        style={{margin: 100}}
        color="#800000"
        onPress={() => navigation.navigate('Parking', {lots})}>
        <Text style={{color: 'white'}}> Submit </Text>
      </Button>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191970',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    borderWidth: 2,
    borderColor: '#777',
    borderRadius: 16,
    padding: 8,
    margin: 25,
    width: 350,
    height: 50,
    marginTop: 100,
    color: 'white',
  },
});

export default Home;
