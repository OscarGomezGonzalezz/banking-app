import {View, Text, ScrollView, StyleSheet} from 'react-native';
import Colors from '../../../constants/Colors';
import { useHeaderHeight } from '@react-navigation/elements';
import WidgetList from '../../../components/SortableList/WidgetList'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
const Page = ()=>{

    console.log("expenses");

    return (
        <ScrollView style={{ backgroundColor: Colors.background, flex: 1 }} contentContainerStyle={{ paddingTop: 60, flexGrow: 1 }}>
            <View style={styles.container}>
                <Text style={styles.title}>My expenses</Text>
            </View>
            {/* This implementation is inspired by William Candillon video (passing everything to jsx)*/}
            <GestureHandlerRootView style={styles.widgets}>
                <WidgetList />
                </GestureHandlerRootView>
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
      title: {
        fontSize: 60,
        marginBottom: 10,
        fontWeight: 'bold',
        color: Colors.dark,
      },
    widgets:{
        flex: 1
    }
});
export default Page