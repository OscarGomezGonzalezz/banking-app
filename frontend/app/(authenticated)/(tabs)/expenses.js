import {View, Text, ScrollView, StyleSheet} from 'react-native';
import Colors from '../../../constants/Colors';
import WidgetList from '../../../components/SortableList/WidgetList'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
const Page = ()=>{

    console.log("expenses");

    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <ScrollView style={{ backgroundColor: Colors.background }} contentContainerStyle={{ paddingTop: 60, flexGrow: 1 }}>
                <Text style={styles.title}>My expenses</Text>
                {/* This implementation is inspired by William Candillon video (passing everything to jsx)*/}

                <View style={{ flex: 1 }}>
                    <WidgetList />
                </View>
            </ScrollView>
        </GestureHandlerRootView>
    )
}
const styles = StyleSheet.create({
    
      title: {
        fontSize: 60,
        marginBottom: 10,
        fontWeight: 'bold',
        color: Colors.dark,
      },
});
export default Page