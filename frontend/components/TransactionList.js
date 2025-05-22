import { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { format } from 'date-fns';
import Colors from '../constants/Colors';

const IncomeExpenseList = ({ data }) => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

 const filteredData = useMemo(() => {
  const term = searchTerm.trim().toLowerCase();
  const filtered = !term
    ? data
    : data.filter(item => {
        const rawDate = item.date?.toDate?.() || new Date(item.date); // Compatibilidad
        const dateStr = format(rawDate, 'dd/MM/yyyy');

        return (
          item.description.toLowerCase().includes(term) ||
          item.category.toLowerCase().includes(term) ||
          String(item.amount).includes(term) ||
          dateStr.includes(term)
        );
      });

  // Ordena por fecha descendente (más recientes primero)
  return [...filtered].sort((a, b) => {
    const dateA = a.date?.toDate?.() || new Date(a.date);
    const dateB = b.date?.toDate?.() || new Date(b.date);
    return dateB - dateA;
  });
}, [data, searchTerm]);


  const formatAmount = amount =>
    new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);

  const formatDate = date => {
    const safeDate = date?.toDate?.() || new Date(date);
    return format(safeDate, 'dd/MM/yyyy');
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
        <Text style={styles.methodOfPayment}>{item.category}</Text>
        <Text style={item.amount > 0 ? styles.incomeAmount : styles.expenseAmount}>
          {formatAmount(item.amount)}
        </Text>
        <Text style={styles.date}>{formatDate(item.date)}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerTransac}>
        <Text style={styles.title}>Recent transactions</Text>
        <TouchableOpacity onPress={() => setSearchVisible(v => !v)}>
          <Ionicons name="search" size={24} color={Colors.dark} />
        </TouchableOpacity>
      </View>

      {searchVisible && (
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search transactions..."
            placeholderTextColor={Colors.gray}
            value={searchTerm}
            onChangeText={setSearchTerm}
            autoFocus
          />
        </View>
      )}

      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={item => item.id?.toString() || Math.random().toString()}
        contentContainerStyle={{ paddingBottom: 40 }}

      scrollEnabled={false}//This is needed for removing tht warning: virtualized lists inside scrollview
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
  },
  headerTransac: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark,
  },
  searchBarContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  searchInput: {
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: Colors.gray,
  },
  itemBox: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  iconContainer: {
    marginRight: 12,
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
    color: Colors.gray,
    marginVertical: 4,
  },
  incomeAmount: {
    fontSize: 16,
    color: 'green',
  },
  expenseAmount: {
    fontSize: 16,
    color: 'red',
  },
  date: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 4,
  },
});

export default IncomeExpenseList;
