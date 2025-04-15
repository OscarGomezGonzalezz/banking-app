import React from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Make sure to install this library or use any other icon library
import { format } from 'date-fns'; // Optional: For better date formatting

/**
 * Componente para mostrar ingresos y gastos juntos
 * @param {{ data: Array<{ id: number, description: string, amount: number, methodOfPayment: string, date: string }> }} props
 */
const IncomeExpenseList = ({ data }) => {
  const formatAmount = amount =>
    new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);

  const formatDate = (date) => {
    return format(new Date(date), 'dd/MM/yyyy'); // Format date to "DD/MM/YYYY"
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemBox}>
      <View style={styles.iconContainer}>
        <FontAwesome
          name={item.amount > 0 ? 'arrow-up' : 'arrow-down'}
          size={24}
          color={item.amount > 0 ? 'green' : 'red'}
        />
      </View>
      <View style={styles.itemDetails}>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.methodOfPayment}>{item.methodOfPayment}</Text>
        <Text style={item.amount > 0 ? styles.incomeAmount : styles.expenseAmount}>
          {formatAmount(item.amount)}
        </Text>
        <Text style={styles.date}>{formatDate(item.date)}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Recent transactions</Text>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Take up full screen height
    padding: 16,
    backgroundColor: '#f5f5f5', // Optional: Add a background color for better contrast
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center', // Center the title
  },
  itemBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  iconContainer: {
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
  },
  methodOfPayment: {
    fontSize: 14,
    color: '#555', // Slightly lighter color for the method of payment
    marginBottom: 4,
  },
  incomeAmount: {
    color: 'green',
    fontSize: 16,
    fontWeight: 'bold',
  },
  expenseAmount: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: '#888', // Lighter color for the date
    marginTop: 4,
  },
});

export default IncomeExpenseList;
