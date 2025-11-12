
let adminApiList = {
 "login": "/Mobile_App_Services/EKrishiPathshala/MISAdmin_New.asmx/GetAdmimLogin",
 "getTodayBirhtList": "/Mobile_App_Services/EKrishiPathshala/MISAdmin_New.asmx/getTodayBirhtList",
 "getCourseWiseDashCount": "/Mobile_App_Services/EKrishiPathshala/MISAdmin_New.asmx/getCourseWiseDashCount",
 "Get_File_Type_Masters": "/Mobile_App_Services/EKrishiPathshala/MISAdmin_New.asmx/Get_File_Type_Masters",
//  "getStudentsDashCount": "/Mobile_App_Services/EKrishiPathshala/MISAdmin_New.asmx/getStudentsDashCount",
 
 "getCourseCodeList": "/Mobile_App_Services/EKrishiPathshala/MISAdmin_New.asmx/getCourseCodeList",
 "GetCourseListForStudyMaterial": "/Mobile_App_Services/EKrishiPathshala/MISAdmin_New.asmx/GetCourseListForStudyMaterial",
 "Get_Course_Wise_Total_Student_Count": "/Mobile_App_Services/EKrishiPathshala/MISAdmin_New.asmx/Get_Course_Wise_Total_Student_Count",
 "getCourseWiseStudentList": "/Mobile_App_Services/EKrishiPathshala/MISAdmin_New.asmx/getCourseWiseStudentList",
 "getDegreeTypeWiseDashCount": "/Mobile_App_Services/EKrishiPathshala/MISAdmin_New.asmx/getDegreeTypeWiseDashCount",
 "getDepartmentWiseStudentDashCount": "/Mobile_App_Services/EKrishiPathshala/MISAdmin_New.asmx/getDepartmentWiseStudentDashCount",
 "saveVideoLectureFromYouTube": "/Mobile_App_Services/EKrishiPathshala/MISAdmin_New.asmx/saveVideoLectureFromYouTube",



 

};

export const setApiList = (list) => {
  adminApiList = list;
};

export const setAdminApiList = (list) => {
  adminApiList = list;
};

const getAdminApiList = () => {
  return adminApiList;
};

export default getAdminApiList;
