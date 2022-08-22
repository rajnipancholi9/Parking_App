import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Button,
} from 'react-native';

import {Snackbar} from 'react-native-paper';
import axios from 'axios';

interface lotDetailsType {
  id: number;
  reg: string;
  free: boolean;
  start: Date;
}

const Parking = ({route}: any) => {
  const lot = route.params.lots;

  const [lots, setLots] = useState<lotDetailsType[]>([]);
  const [currentLot, setCurrentLot] = useState<number>(0);
  const [freeLots, setFreeLots] = useState<lotDetailsType[]>(lots);

  const [registration, setRegistration] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showRemoveModal, setShowRemoveModal] = useState<boolean>(false);
  const [showSnackBar, setShowSnackBar] = useState<boolean>(false);

  const [registrationId, setRegisterationId] = useState<any>();

  const [time, setTime] = useState<number>(0);
  const [hours, setHours] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);

  useEffect(() => {
    getLots();
  }, []);

  useEffect(() => {
    setFreeLots(lots.filter(lot => lot.free));
  }, [lots]);

  function getLots() {
    let lotsArray = [];
    for (let i = 1; i <= lot; i++) {
      lotsArray.push({
        id: i,
        reg: '',
        free: true,
        start: new Date(0, 0, 0),
      });
    }
    setLots(lotsArray);
  }

  function getRandomLot() {
    const randomNum = Math.floor(Math.random() * freeLots.length);
    setCurrentLot(freeLots[randomNum].id);
  }

  function handleAdd(random: boolean) {
    setRegistration('');
    if (freeLots.length > 0) {
      getCount();
      if (random) {
        getRandomLot();
      }
      if (currentLot >= 0) {
        setShowAddModal(true);
      }
    } else {
      setShowSnackBar(true);
      setTimeout(() => {
        setShowSnackBar(false);
      }, 5000);
    }
  }

  function handleRemove() {
    !lots[currentLot].free && setShowRemoveModal(true);
    setRegisterationId(registration);
  }

  const getCount = () => {
    const start = new Date().getSeconds();
    setTime(start);
  };

  function calculateCharges() {
    const end = new Date().getMinutes();
    const totalTime = (time - end) / (60 * 60);
    if (totalTime / 60 <= 2) {
      setAmount(10);
      setHours(totalTime);
    } else {
      setAmount(10 + (totalTime - 2) * 10);
    }
  }

  return (
    <View style={styles.container}>
      <View style={{marginHorizontal: 40}}>
        <TouchableOpacity
          style={{
            backgroundColor: '#b0c4de',
            margin: 10,
            padding: 5,
          }}
          onPress={() => {
            handleAdd(true);
          }}>
          <Text
            style={{
              fontSize: 16,
              textAlign: 'center',
              color: 'black',
            }}>
            Enter Vehicle Number
          </Text>
        </TouchableOpacity>
      </View>

      {/* Parking Add registration Modal  */}

      <Modal visible={showAddModal} animationType="slide">
        <View style={styles.modal}>
          <Text style={styles.modalHeading}>Parking Slot {currentLot}</Text>
          <TextInput
            placeholder="Enter Vehicle number"
            placeholderTextColor={'grey'}
            onChangeText={text => {
              setRegistration(text);
            }}
            style={styles.textInput}
          />

          <View style={styles.buttonRow}>
            <Button
              disabled={registration.length == 0}
              title="Add"
              color="#b0c4de"
              onPress={() => {
                if (registration.length) {
                  setLots(
                    lots.map(lot => {
                      return lot.id == currentLot
                        ? {
                            ...lot,
                            free: false,
                            reg: registration,
                            start: new Date(),
                          }
                        : lot;
                    }),
                  );
                  setShowAddModal(false);
                }
              }}
            />
            <Button
              title="Cancel"
              color="#b0c4de"
              onPress={() => {
                setShowAddModal(false);
              }}
            />
          </View>
        </View>
      </Modal>

      {/* Payment Modal */}

      <Modal
        visible={showRemoveModal}
        onShow={() => {
          calculateCharges();
        }}
        animationType="slide">
        <View style={styles.modal}>
          <Text style={styles.modalHeading}>Payment of Slot P{currentLot}</Text>
          <Text style={styles.modalText}>Total Time : {hours} Hrs </Text>
          <Text style={styles.modalText}>Total Amount : {amount}</Text>

          <View style={styles.buttonRow}>
            <Button
              title="Payment Taken"
              color="#b0c4de"
              onPress={() => {
                axios
                  .post('https://httpstat.us/200', {
                    car_registration: registrationId,
                    charge: amount,
                  })
                  .then((res: any) => {});

                setLots(
                  lots.map(lot => {
                    return lot.id == currentLot
                      ? {
                          ...lot,
                          free: true,
                          reg: '',
                          start: new Date(0, 0, 0),
                        }
                      : lot;
                  }),
                );
                setAmount(0);
                setHours(0);
                setShowRemoveModal(false);
              }}
            />
            <Button
              title="Cancel"
              color="#b0c4de"
              onPress={() => {
                setAmount(0);
                setHours(0);
                setShowRemoveModal(false);
              }}
            />
          </View>
        </View>
      </Modal>

      <Snackbar
        visible={showSnackBar}
        onDismiss={() => setShowSnackBar(false)}
        style={styles.snackBar}>
        <Text style={styles.snackBarText}>The parking is full ! </Text>
      </Snackbar>

      <View style={{width: 500, paddingRight: 70}}>
        <TouchableOpacity style={styles.parkingArea}>
          <FlatList
            data={lots}
            horizontal={false}
            numColumns={3}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => {
                  setCurrentLot(item.id);
                  item.free ? handleAdd(false) : handleRemove();
                }}>
                <View
                  style={{
                    ...styles.item,
                    backgroundColor: item.free ? 'green' : 'red',
                  }}>
                  <Text style={styles.itemText}>P{item.id}</Text>
                  <Text style={styles.itemText}>
                    {item.free ? 'Free' : `Occupied by ${item.reg}`}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191970',
    padding: 10,
  },

  textInput: {
    padding: 10,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 3,
    marginBottom: 30,
    width: 280,
    color: 'white',
  },

  parkingArea: {
    padding: '0%',
    margin: 35,
  },

  item: {
    borderRadius: 10,
    padding: 3,
    width: 90,
    height: 150,

    justifyContent: 'space-around',
    alignItems: 'center',

    margin: 5,
    marginRight: 5,
  },

  itemText: {
    color: 'white',
  },

  modal: {
    top: '18%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#191970',
    height: 400,
    margin: 25,
    marginBottom: 250,
    borderRadius: 20,
  },

  modalHeading: {
    fontSize: 25,
    padding: 25,
    margin: 20,
    color: 'white',
  },

  modalText: {
    fontSize: 15,
    color: 'white',
    padding: 10,
    margin: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    alignItems: 'center',
    margin: 20,
    padding: 10,
  },
  snackBar: {
    bottom: 15,
    backgroundColor: 'red',
    padding: 10,
    fontSize: 40,
  },
  snackBarText: {
    color: 'black',
    fontSize: 20,
  },
});

export default Parking;
