import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
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
      getCount(); //89
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
    const end = new Date().getSeconds();
    const totalTime = (time - end) / (60 * 60);
    if (totalTime / 60 <= 2) {
      setAmount(10);
      setHours(totalTime);
    } else {
      setAmount(10 + (totalTime - 2) * 10);
    }
  }

  //   const timeDiffms = Math.abs(
  //     lots[currentLot].start.getTime() - new Date().getTime(),
  //   );
  //   const timeDiffHrs = Math.floor(timeDiffms / (1000 * 60 * 60));
  //   setHours(timeDiffHrs);

  //   if (timeDiffHrs <= 2) {
  //     setAmount(10);
  //     setHours(timeDiffHrs); //rr
  //   } else {
  //     setAmount(10 + (timeDiffHrs - 2) * 10);
  //   }
  // }

  return (
    <View style={styles.container}>
      <View style={{marginHorizontal: 110}}>
        <Button
          title="Random Slot"
          onPress={() => {
            handleAdd(true);
          }}
          color="#800000"
        />
      </View>
      {/* Parking Add registration Modal  */}

      <Modal visible={showAddModal} animationType="slide">
        <View style={styles.modal}>
          <Text style={styles.modalHeading}>Parking Slot {currentLot}</Text>
          <TextInput
            placeholder="Enter registration number"
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
              color="#800000"
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
              color="#800000"
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
          <Text style={styles.modalText}>Total Time : {hours}</Text>
          <Text style={styles.modalText}>Total Amount : {amount}</Text>

          <View style={styles.buttonRow}>
            <Button
              title="Remove"
              color="#800000"
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
              color="#800000"
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
      <TouchableOpacity
        onPress={() => handleAdd(true)}
        style={styles.parkingArea}>
        <FlatList
          data={lots}
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
    padding: '20%',
  },

  item: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 10,
    marginHorizontal: 55,
    marginVertical: 10,

    padding: 5,
    //
    height: 100,
    width: 110,
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
    backgroundColor: '#b0c4de',
    padding: 10,
    fontSize: 40,
  },
  snackBarText: {
    color: 'black',
    fontSize: 20,
  },
});

export default Parking;
