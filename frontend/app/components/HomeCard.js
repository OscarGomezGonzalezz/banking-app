import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { scale } from 'react-native-size-matters';

const HomeCard = () => {
    return (
        <ImageBackground
            source={require("../../assets/card.png")}
            resizeMode="stretch"
            style={styles.bgImage}
        >
            <View style={styles.container}>
                {/* Total Balance */}
                <View style={styles.totalBalanceRow}>
                    <Text style={styles.balance}>Total Balance</Text>
                </View>
                <Text style={styles.balanceNumber}>$2343.23</Text>

                {/* Income & Expenses */}
                <View style={styles.stats}>
                    {/* Income */}
                    <View style={styles.statItem}>
                        <View style={styles.incomeExpense}>
                            <View style={[styles.statsIcon, { backgroundColor: '#d4fcd4' }]}>
                                <Ionicons name="arrow-up" size={20} color="green" />
                            </View>
                            <Text style={styles.statLabel}>Income</Text>
                        </View>
                        <Text style={[styles.statAmount, { color: "green" }]}>$2342</Text>
                    </View>

                    {/* Expenses */}
                    <View style={styles.statItem}>
                        <View style={styles.incomeExpense}>
                            <View style={[styles.statsIcon, { backgroundColor: '#fcd4d4' }]}>
                                <Ionicons name="arrow-down" size={20} color="red" />
                            </View>
                            <Text style={styles.statLabel}>Expenses</Text>
                        </View>
                        <Text style={[styles.statAmount, { color: "red" }]}>$1234</Text>
                    </View>
                </View>
            </View>
        </ImageBackground>
    );
};


export default HomeCard;


const styles = StyleSheet.create({
    bgImage: {
        height: scale(210),
        width: "100%",
        borderRadius: scale(10),
        overflow: "hidden",
    },
    container: {
        flex: 1,
        paddingHorizontal: scale(20),
        paddingVertical: scale(15),
        justifyContent: "space-between",
    },
    totalBalanceRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    balance: {
        fontSize: scale(18),
        fontWeight: '500',
        color: "black",
    },
    balanceNumber: {
        fontSize: scale(32),
        fontWeight: 'bold',
        color: "black",
        marginTop: scale(5),
    },
    stats: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: scale(20),
    },
    statItem: {
        width: "48%",
    },
    incomeExpense: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: scale(5),
    },
    statsIcon: {
        width: scale(28),
        height: scale(28),
        borderRadius: scale(14),
        justifyContent: "center",
        alignItems: "center",
        marginRight: scale(8),
    },
    statLabel: {
        fontSize: scale(14),
        fontWeight: "500",
        color: "#fff",
    },
    statAmount: {
        fontSize: scale(16),
        fontWeight: "bold",
    },
});
