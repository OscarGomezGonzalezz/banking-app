import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { SIZE } from './Config';
import Colors from '../../constants/Colors';


const Tile = ({ id }) => {

  if (id === 'spent') {
    return (
      <View style={styles.container} pointerEvents="none">
        <Text style={{ color: Colors.gray, fontWeight: '500', fontSize: 16 }}>
          Spent this month
        </Text>
        <Text style={{ color: Colors.dark, fontWeight: 'bold', fontSize: 26, paddingTop: 10 }}>
          1024€
        </Text>
      </View>
    );
  }

  if (id === 'cashback') {
    return (
      <View
        style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}
        pointerEvents="none"
      >
        <View style={{ alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <View
            style={{
              height: 60,
              width: 60,
              borderRadius: 30,
              backgroundColor: Colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>2%</Text>
          </View>
          <Text style={{ color: Colors.gray, fontWeight: 'bold', fontSize: 18 }}>Cashback</Text>
        </View>
      </View>
    );
  }

  if (id === 'accounts') {
    // Ejemplo de datos hardcodeados; en tu caso vendrán de la API
    const topAccounts = [
      { name: 'Bank1', total: 240.00, color: Colors.secondary },
      { name: 'Bank2', total: 180.50, color: Colors.secondary },
      { name: 'Bank3', total: 150.75, color: Colors.secondary },
    ];
  
    return (
      <View style={styles.container} pointerEvents="none">
        <View>
        <Text style={styles.header}>Accounts</Text>
        </View>
  
        {topAccounts.map((cat, idx) => {
          // Calculamos el ancho relativo de la barra (porcentaje del máximo)
          return (
            <View key={idx} style={styles.row}>
              <Text style={[styles.catName, { color: cat.color }]}>{cat.name}</Text>
              <Text style={styles.amount}>€{cat.total.toFixed(2)}</Text>
            </View>
          );
        })}
      </View>
    );
  }
  
  if (id === 'categories') {
    const topCategories = [
      { name: 'Aliments', total: 240.00, color: '#FF6384', icon: 'restaurant',},
      { name: 'Transport', total: 180.50, color: '#36A2EB', icon: 'car', },
      { name: 'Leisure', total: 150.75, color: '#FFCE56', icon: 'game-controller'},
    ];
    const maxValue = Math.max(...topCategories.map(cat => cat.total));
    const chartHeight = 75; // height in pixels for the tallest bar
    const numTicks = 4; // number of intervals on the y-axis
    const tickValues = [];
    for (let i = 0; i <= numTicks; i++) {
      tickValues.push(Math.round((maxValue / numTicks) * i));
    }
    return (
      <View style={styles.container} pointerEvents="none">
        <Text style={{ color: Colors.gray, fontWeight: '500', fontSize: 16 }}>Categories</Text>
        <View style={styles.chartWrapper}>
          {/* Y-Axis labels */}
          <View style={styles.axisContainer}>
            {tickValues
              .slice()
              .reverse()
              .map((val, idx) => (
                <Text key={idx} style={styles.axisLabel}>
                  {val}
                </Text>
              ))}
          </View>
          {topCategories.map(cat => (
              <View key={cat.name} style={styles.barWrapper}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: (cat.total / maxValue) * chartHeight,
                      backgroundColor: cat.color,
                    },
                  ]}
                />
                <Ionicons
                  name={cat.icon}
                  size={20}
                  color={Colors.gray}
                  style={styles.icon}
                />
              </View>
            ))}
        </View>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    width: SIZE - 20,
    height: 165,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 5,
    padding: 14,
    alignSelf: 'center',
  },header: {
    color: Colors.gray,
    fontWeight: '500',
    fontSize: 16,
    marginBottom: 12,
    marginTop: 10
  },
  row: {
    flexDirection: 'row',
    justifyContent: "space-between",
    marginBottom: 10,
    gap: 0
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  catName: {
    flexShrink: 0,
    fontSize: 14,
    color: Colors.dark,
    width: 60,
    fontWeight: '500',
  },
  barBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#ececec',
    borderRadius: 4,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  barFill: {
    height: 8,
    borderRadius: 4,
  },
  amount: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.dark,
  },
  chartWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 14,
  },
  barWrapper: {
    alignItems: 'center',
    marginHorizontal: 2,
  },
  bar: {
    width: 23,
    marginHorizontal: 4,
    borderRadius: 2,
  },
  axisContainer: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 4,
    marginBottom: 22
  },
  axisLine: {
    width: 1,
    backgroundColor: Colors.gray,
    marginHorizontal: 4,
  },icon: {
    marginTop: 4,
  },
});

export default Tile;
