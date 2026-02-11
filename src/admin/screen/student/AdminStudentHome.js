import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, } from "react-native";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../layout/Header/Header";
import Footer from "../../layout/Footer/Footer";
import { studentMenu } from "../../../student/config/Menu/MenuLiist";
import { useRoute } from '@react-navigation/native';
import { HttpService } from "../../../common/Services/HttpService";
import SessionService from '../../../common/Services/SessionService';
import colors from "../../../common/config/colors";


const AdminStudentHome = ({ navigation }) => {
    const route = useRoute();
    const { student } = route.params || {};

    const [studentData, setStudentData] = useState();
    const [menuList, setMenuList] = useState([]);


    useEffect(() => {
        setMenuList(studentMenu);
        if (student) setStudentData(student);
    }, [student]);

    const getIconComponent = (iconLib) => {
        switch (iconLib) {
            case "EvilIcons":
                return EvilIcons;
            default:
                return FontAwesome6;
        }
    };

    const handleMenuPress = (item) => {
        if (item?.screen) {
            navigation.navigate("Student", { screen: item.screen, data: studentData });
        } else {
            alert(`${item.name} screen not available.`);
        }
    };




    useEffect(() => {
        // console.log("Student Data:", student);
        const updateSessionAndRefresh = async () => {
            try {
                const currentSession = await SessionService.getSession();
                if (!currentSession) return;
                const updatedSession = {
                    ...currentSession,
                    student:student,
                    selectedSid:student?.Student_ID
                };
                await SessionService.saveSession(updatedSession);
                const nowsession = await SessionService.getSession();
                // console.log(nowsession, "nowsessionnowsession")
            } catch (error) {
                console.error("Failed to update session:", error);
            }
        };
        if (student) {
            updateSessionAndRefresh();
        }
    }, [student]);



    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#2a2c94" />
            <Header />

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.section}>
                    <TouchableOpacity
                        style={styles.studentReportCard}
                        onPress={() => navigation.navigate("Profile")}>
                        <FontAwesome6 name="user" size={25} color="#fff" />
                        <Text style={styles.reportText}>Student Profile</Text>
                    </TouchableOpacity>

                    <View style={styles.cardContainer}>
                        {menuList.map((item) => {
                            const IconComponent = getIconComponent(item.iconLib);
                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[styles.card, { borderColor: item.color }]}
                                    onPress={() => handleMenuPress(item)}>
                                    <View style={[styles.iconWrapper, { backgroundColor: item.color }]}>
                                        <IconComponent name={item.icon} size={25} color="#fff" />
                                    </View>
                                    <Text style={styles.cardText}>{item.name}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            </ScrollView>
            <Footer />
        </SafeAreaView>
    );
};

export default AdminStudentHome;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    section: { paddingHorizontal: 15, paddingVertical: 10 },
    cardContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        marginTop: 15,
    },
    card: {
        width: "42%",
        margin: 8,
        backgroundColor: "#fff",
        borderRadius: 15,
        elevation: 4,
        alignItems: "center",
        paddingVertical: 18,
        borderWidth: 1.5,
    },
    iconWrapper: {
        padding: 10,
        borderRadius: 50,
    },
    cardText: {
        marginTop: 10,
        fontSize: 13,
        fontWeight: "600",
        textAlign: "center",
        color: "#000",
    },
    studentReportCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.bgcolordark,
        borderRadius: 10 ,
        justifyContent: "center",
        paddingVertical: 14,
        marginTop: 20,
    },
    reportText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "600",
        marginLeft: 10,
    },
});
