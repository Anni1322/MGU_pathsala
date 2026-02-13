import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

// Import all screen components
import SplashScreen from "../SplashScreen/SplashScreen";
import LoginScreen from "../Auth/LoginScreen";
import SignUpScreen from "../Auth/SignUpScreen";
import AuthLoadingScreen from "../Services/AuthLoadingScreen";
import Main from "../Main";
import Team from "../Team";
import PrivacyPolicy from "../PrivacyPolicy";
import TeamMembers from "../TeamMembers";
import WebsiteScreen from "../WebsiteScreen";


// Student Screens
// import StudentDashboard from "../screen/student/StudentDashboard";
import HomeLayout from "../../student/screen/Home/HomeLayout";
import ComplaintScreen from '../../student/screen/Support/ComplaintScreen';
 
import MenuScreen from "../../student/layout/Sidebar/MenuScreen";
import FilePickerScreen from '../../student/screen/Support/FilePickerScreen';

import AdmitCard from "../../student/screen/Student Services/AdmitCard";
import FeeReceipt from "../../student/screen/Student Services/FeeReceipt";
import PDC from "../../student/screen/Student Services/PDC";
import SRC from "../../student/screen/Student Services/SRC";
import Examination from "../../student/screen/Student Services/Examination";
import Transcript from "../../student/screen/Student Services/Transcript";
import RegistraionCardList from "../../student/screen/Student Services/RegistraionCardList";
import StudyScreen from "../../student/screen/StudyMaterial/StudyScreen";
import StudyMaterialDetails from "../../student/screen/StudyMaterial/StudyMaterialDetails";
import SyllabusScreen from "../../student/screen/StudyMaterial/SyllabusScreen";
import Chapter from "../../student/screen/StudyMaterial/Chapter";
import Assignment from "../../student/screen/StudyMaterial/Assignment";
import DoubtSession from "../../student/screen/StudyMaterial/DoubtSession";
import VideoLecture from "../../student/screen/StudyMaterial/VideoLecture";
import NotificationScreen from "../../student/screen/Notification/NotificationScreen";
import ProfileScreen from "../../student/screen/Profile/ProfileScreen";
import SettingsScreen from "../../student/screen/Settings/SettingsScreen";
import Maintenance from "../../common/Services/Maintenance";




// Admin Screens
import AdminHomeLayout from '../../admin/screen/Home/AdminHomeLayout';
import QRScannerScreen from '../../admin/Other/scanner/QRScannerScreen';
import AdminProfile from '../../admin/screen/AdminProfile';
import MyCourses from '../../admin/screen/MyCourses';
import MyStudents from '../../admin/screen/MyStudents';
import AdminExamination from '../../admin/screen/AdminExamination';
import StudyMaterials from '../../admin/screen/StudyMaterials';
import StudyDash from '../../admin/screen/StudyDash';
import MyAssignment from '../../admin/screen/MyAssignment';
import MyAssignmentDesh from '../../admin/screen/MyAssignmentDesh';
import MyVideoLecture from '../../admin/screen/MyVideoLecture';
import FinanceDashboard from '../../admin/screen/FinanceDashboard';
import EGrievances from '../../admin/screen/EGrievances';
import AdminDoubtSession from '../../admin/screen/AdminDoubtSession';
import ExaminationScreen from '../../admin/screen/Examination/ExaminationScreen';
import AdminStudentHome from '../../admin/screen/student/AdminStudentHome';
import QRScanner from "../../admin/screen/Examination/QRScanner";




// Common Screens


// Create Stack Navigators
const AuthStack = createNativeStackNavigator();
const StudentStack = createNativeStackNavigator();
const AdminStack = createNativeStackNavigator();
const RootStack = createNativeStackNavigator();

// Auth Navigator
const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Main">
    <AuthStack.Screen name="Main" component={Main} />
    <AuthStack.Screen name="AuthLoading" component={AuthLoadingScreen} />
    <AuthStack.Screen name="Splash" component={SplashScreen} />
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="SignUp" component={SignUpScreen} />
   
  </AuthStack.Navigator>
);

// Student Navigator
const StudentNavigator = () => (
  <StudentStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="HomeLayout">
    <StudentStack.Screen name="HomeLayout" component={HomeLayout} />
    <StudentStack.Screen name="AdmitCard" component={AdmitCard} />
    <StudentStack.Screen name="FeeReceipt" component={FeeReceipt} />
    <StudentStack.Screen name="PDC" component={PDC} />
    <StudentStack.Screen name="SRC" component={SRC} />
    <StudentStack.Screen name="Examination" component={Examination} />
    <StudentStack.Screen name="Transcript" component={Transcript} />
    <StudentStack.Screen name="RegistraionCardList" component={RegistraionCardList} />
    <StudentStack.Screen name="Study" component={StudyScreen} />
    <StudentStack.Screen name="StudyMaterialDetails" component={StudyMaterialDetails} />
    <StudentStack.Screen name="Syllabus" component={SyllabusScreen} />
    <StudentStack.Screen name="Chapter" component={Chapter} />
    <StudentStack.Screen name="Assignment" component={Assignment} />
    <StudentStack.Screen name="DoubtSession" component={DoubtSession} />
    <StudentStack.Screen name="VideoLecture" component={VideoLecture} />
    {/* <StudentStack.Screen name="Notification" component={NotificationScreen} /> */}
    <StudentStack.Screen name="Profile" component={ProfileScreen} />
    <StudentStack.Screen name="Settings" component={SettingsScreen} />
    <StudentStack.Screen name="ComplaintScreen" component={ComplaintScreen} />
 

  </StudentStack.Navigator>
);

// Admin Navigator
const AdminNavigator = () => (
  <AdminStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="AdminHomeLayout">
    <AdminStack.Screen name="AdminHomeLayout" component={AdminHomeLayout} />
    {/* <AdminStack.Screen name="QRScanner" component={QRScannerScreen} /> */}
    <AdminStack.Screen name="AdminProfile" component={AdminProfile} />
    <AdminStack.Screen name="MyCourses" component={MyCourses} />
    <AdminStack.Screen name="MyStudents" component={MyStudents} />
    <AdminStack.Screen name="AdminExamination" component={AdminExamination} />
    <AdminStack.Screen name="StudyMaterials" component={StudyMaterials} />
    <AdminStack.Screen name="StudyDash" component={StudyDash} />
    <AdminStack.Screen name="MyAssignment" component={MyAssignment} />
    <AdminStack.Screen name="MyAssignmentDesh" component={MyAssignmentDesh} />
    <AdminStack.Screen name="MyVideoLecture" component={MyVideoLecture} />
    <AdminStack.Screen name="FinanceDashboard" component={FinanceDashboard} />
    <AdminStack.Screen name="EGrievances" component={EGrievances} />
    <AdminStack.Screen name="AdminDoubtSession" component={AdminDoubtSession} />
    <AdminStack.Screen name="ExaminationScreen" component={ExaminationScreen} />
    {/* <AdminStack.Screen name="QRScannerr" component={QRScanner} /> */}
    <AdminStack.Screen name="adminStudentHome" component={AdminStudentHome} />


  </AdminStack.Navigator>
);

// Root Navigator (Handles routing based on user role)
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Auth" component={AuthNavigator} />
        <RootStack.Screen name="Student" component={StudentNavigator} />
        <RootStack.Screen name="Splash" component={SplashScreen} />
        <RootStack.Screen name="Admin" component={AdminNavigator} />
        <RootStack.Screen name="Main" component={Main} />
        <RootStack.Screen name="Team" component={Team} />
        <RootStack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
        <RootStack.Screen name="TeamMembers" component={TeamMembers} />
        <RootStack.Screen name="WebsiteScreen" component={WebsiteScreen} />
        <RootStack.Screen name="Maintenance" component={Maintenance} />
        <RootStack.Screen name="Notification" component={NotificationScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

