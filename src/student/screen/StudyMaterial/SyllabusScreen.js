import React, { useState, useEffect } from 'react';
import { View, Text, Alert, TextInput, StyleSheet, ScrollView, Switch, TouchableOpacity, ActivityIndicator, } from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import alertService from '../../../common/Services/alert/AlertService';
import Apiservice from "../../../common/Services/ApiService";
// import requestAndroidPermission from "../../../common/Services/requestStoragePermission"
import getApiList from "../../config/Api/ApiList";
import Header from "../../layout/Header/Header2";
import Footer from "../../layout/Footer/Footer";
import { HttpService } from "../../../common/Services/HttpService";
import SessionService from '../../../common/Services/SessionService';
import { SafeAreaView } from 'react-native-safe-area-context';

const SyllabusScreen = () => {
  const [years, setYears] = useState([]);
  const [semesters, setsemesters] = useState([]);
  const [courses, setCourses] = useState([]);

  const [isEnabled, setIsEnabled] = useState(true);
  const [selectedYear, setSelectedYear] = useState('1');
  const [selectedSemester, setSelectedSemester] = useState('1');

  const [loading, setLoading] = useState(true);

  const insets = useSafeAreaInsets();
  const toggleSwitch = () => setIsEnabled((prev) => !prev);
  const navigation = useNavigation();

  const fetchSession = async (year, semester) => {
    if (!year || !semester) {
      // console.log("Year or Semester not selected. Skipping API call.");
      return;
    }
    setLoading(true);  
    const apiList = getApiList();
    const sessionData = await SessionService.getSession();
    // console.log(sessionData,"sessionData")

    const payload = {
      LOGIN_TYPE: sessionData?.[0]?.LOGIN_TYPE,
      STUDENT_ID: sessionData?.STUDENT_ID,
      Courser_Year_Id: year,
      Semester_Id: semester,
    };
    const courseApi = apiList?.GetCoursesSyllabus;
    try {
      const courseResponse = await HttpService.post(courseApi, payload);
      // const courseResponse = await Apiservice.request({ endpoint: courseApi, payload, method: 'POST',});
      setCourses(courseResponse?.data?.CourseList || []);
      setLoading(false);  
    } catch (error) {
      console.error('Failed to load profile:', error);
      setCourses([]);  
      setLoading(false); 
    }
  };

  useEffect(() => {
    const apiList = getApiList();
    const sessionData = SessionService.getSession();
    const courseList = async () => {
      const sessionData = await SessionService.getSession();
      const CourseYearApi = apiList?.getAllCourseYearForStudentToApp;
      try {
        const payload = {
          LOGIN_TYPE: sessionData?.[0]?.LOGIN_TYPE,
          STUDENT_ID: sessionData?.[0]?.STUDENT_ID
        };
        const Response = await HttpService.post(CourseYearApi, payload);
        const rawList = Response?.data?.CourseYearResponse?.CourseYearList || [];
        const transformed = rawList?.map(item => ({
          label: item.Name,
          value: item.Id,
        }));
        setYears(transformed);
        if (transformed.length > 0) {
          setSelectedYear(transformed[0].value);
          fetchSession(transformed[0].value, selectedSemester);
        }
        setLoading(false);  
      } catch (error) {
        console.error('Failed to load profile:', error);
        setLoading(false);
      }
    };
    const semesterlist = async () => {
      try {
        const semesters = [
          { "Id": "1", "Name": "I Semester" },
          { "Id": "2", "Name": "II Semester" }
        ];
        const transformed = semesters?.map(item => ({
          label: item.Name,
          value: item.Id,
        }));
        setsemesters(transformed);
        setLoading(false);  
      } catch (error) {
        console.error('Failed to load profile:', error);
        setLoading(false);
      }
    };
    courseList();
    semesterlist();
  }, []);

  const renderDropdownItem = (item) => (
    <View style={styles.item}>
      <FontAwesome6
        name={item.icon}
        size={16}
        color="#006d33ff"
        style={{ marginRight: 10 }}
      />
      <Text style={styles.itemText}>{item.label}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Header />
        <View style={[styles.container, { flex: 1 }]}>
          <View style={styles.dropdownRow}>
            <View style={styles.dropdown}>
              <Text style={styles.dropdownLabel}>Course Year</Text>
              <Dropdown
                style={[
                  styles.dropdownBox,
                  selectedYear && { borderColor: '#006d33ff', backgroundColor: '#f9f5ff' },
                ]}
                containerStyle={styles.dropdownContainer}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                itemTextStyle={styles.itemText}
                iconStyle={styles.iconStyle}
                data={years}
                labelField="label"
                valueField="value"
                placeholder="Select Year"
                value={selectedYear}
                onChange={item => {
                  setSelectedYear(item.value);
                  setSelectedSemester('1'); // Reset semester to default when year changes
                  setCourses([]);
                  // Fetch courses for the new year and default semester
                  fetchSession(item.value, '1');
                }}
                maxHeight={200}
                renderItem={renderDropdownItem}
                activeColor="#ede7f6"
                dropdownPosition="bottom"
              />
            </View>

            <View style={styles.dropdown}>
              <Text style={styles.dropdownLabel}>Semester</Text>
              <Dropdown
                style={[
                  styles.dropdownBox,
                  selectedSemester && { borderColor: '#006d33ff', backgroundColor: '#f9f5ff' },
                ]}
                containerStyle={styles.dropdownContainer}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                itemTextStyle={styles.itemText}
                iconStyle={styles.iconStyle}
                data={semesters}
                labelField="label"
                valueField="value"
                placeholder="Select Sem"
                value={selectedSemester}
                onChange={item => {
                  setSelectedSemester(item.value);
                  if (selectedYear) { fetchSession(selectedYear, item.value); }
                }}
                maxHeight={200}
                renderItem={renderDropdownItem}
                activeColor="#ede7f6"
                dropdownPosition="bottom"
              />
            </View>
          </View>

          {loading || courses.length === 0 ? (
            <ActivityIndicator size="large" color="#1e90ff" />
          ) : (
            <ScrollView
              contentContainerStyle={{ paddingBottom: 20 }}
              showsVerticalScrollIndicator={true}
              scrollEventThrottle={16}
              style={{ flexGrow: 1 }}
            >
              <View style={styles.list}>
                {courses?.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => navigation.navigate('Chapter', { courseId: item.Course_Id })}
                  >
                    <View style={styles.card}>
                      <View style={styles.iconBox}>
                        <FontAwesome6 name="book" size={22} color="#00991fff" />
                      </View>
                      <View style={styles.textContainer}>
                        <Text style={styles.title}>{item.Course_Title_E}</Text>
                        <Text style={styles.subtitle}>{item.Course_Code}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          )}
        </View>
      </View>
      <Footer />
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: '#ffffffff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  list: {
    marginTop: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef9ff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ff1654',
    padding: 10,
    margin: 15,
    marginBottom: 5,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#c6cd79',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
    marginBottom: 20,
    paddingLeft: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
  },
  dropdownRow: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    height: 80,
    padding: 10
  },
  dropdown: {
    flex: 1,
    marginHorizontal: 5,
    marginBottom: 10,
    borderRadius: 12,
    padding: 2,
  },
  dropdownLabel: {
    fontSize: 14,
    marginBottom: 5,
    color: '#006d33ff',
  },
  dropdownBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 14,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  placeholderStyle: {
    fontSize: 15,
  },
  selectedTextStyle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#006d33ff',
  },
  iconStyle: {
    width: 22,
    height: 22,
    tintColor: '#006d33ff',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  itemText: {
    fontSize: 15,
    color: '#333',
  },
});

export default SyllabusScreen;
