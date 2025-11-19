

let apiList = {};
apiList = {
    "login": "/Mobile_App_Services/EKrishiPathshala/Sangwari_Services_New.asmx/GetLoginEncr",
    "register": "/Mobile_Appdsf_Servsdfices/EKrishisdfPaathshala/Register",
    "GetNotificationList": "/Mobile_App_Services/EKrishiPathshala/Sangwari_Services_New.asmx/GetNotificationList",
    

    "profile": "/Mobile_App_Services/EKrishiPathshala/Sangwari_Services_New.asmx/GetStudentProfile",
    "FeeReceiptList": "/Mobile_App_Services/EKrishiPathshala/Sangwari_Services_New.asmx/GetFeeReceiptList",
    "DownloadFeeReceipt": "/Mobile_App_Services/EKrishiPathshala/Sangwari_Services_New.asmx/DownloadFeeReceipt",

    "GetAdmitCardList": "/Mobile_App_Services/EKrishiPathshala/Sangwari_Services_New.asmx/GetAdmitCardList",
    "DownloadAdmitCard": "/Mobile_App_Services/EKrishiPathshala/Sangwari_Services_New.asmx/DownloadAdmitCard",
    
    // "GetStudentNamePhoto": "Mobile_App_Services/EKrishiPathshala/Sangwari_Services_New.asmx/GetStudentNamePhoto",
    "GetRegistrationCardList": "/Mobile_App_Services/EKrishiPathshala/Sangwari_Services_New.asmx/GetRegistrationCardList",
    "DownloadRegistrationCard": "/Mobile_App_Services/EKrishiPathshala/Sangwari_Services_New.asmx/DownloadRegistrationCard",
    "GetSRCList": "/Sangwari_Services/Sangwari_Services.asmx/GetSRCList",
    "GetCoursesSyllabus": "Mobile_App_Services/EKrishiPathshala/Sangwari_Services_New.asmx/GetCoursesSyllabus",
    "getAllCourseYearForStudentToApp": "/Mobile_App_Services/EKrishiPathshala/Sangwari_Services_New.asmx/getAllCourseYearForStudentToApp",
    "getCourseChapterListToApp": "/Mobile_App_Services/EKrishiPathshala/Sangwari_Services_New.asmx/getCourseChapterListToApp",
    "getTranscriptPath": "/Mobile_App_Services/EKrishiPathshala/Sangwari_Services_New.asmx/getTranscriptPath",
    "GetComplainProblemList": "/Mobile_App_Services/EKrishiPathshala/Sangwari_Services_New.asmx/GetComplainProblemList",
    "GetComplainSubProblemList": "/Mobile_App_Services/EKrishiPathshala/Sangwari_Services_New.asmx/GetComplainSubProblemList",
    "SaveComplainForAdmission": "/Mobile_App_Services/EKrishiPathshala/Sangwari_Services_New.asmx/SaveComplainForAdmission",
    "SaveComplain": "/Mobile_App_Services/EKrishiPathshala/Sangwari_Services_New.asmx/SaveComplain",
    "GetMyComplainList": "/Mobile_App_Services/EKrishiPathshala/Sangwari_Services_New.asmx/GetMyComplainList",
    "TrackComplain": "/Mobile_App_Services/EKrishiPathshala/Sangwari_Services_New.asmx/TrackComplain",


    "GetCourseListForStudyMaterial": "/Mobile_App_Services/EKrishiPathshala/Sangwari_Services_New.asmx/GetCourseListForStudyMaterial",
    "getMaterialLectureChapterListToApp": "/Mobile_App_Services/EKrishiPathshala/Sangwari_Services_New.asmx/getMaterialLectureChapterListToApp",
    "getMaterialCountEmpListWiseToApp": "/Mobile_App_Services/EKrishiPathshala/Sangwari_Services_New.asmx/getMaterialCountEmpListWiseToApp",
    "GetStudyMaterialList": "/Mobile_App_Services/EKrishiPathshala/Sangwari_Services_New.asmx/GetStudyMaterialList",
}


export const setApiList = (list) => {
  apiList = list;
};

const getApiList = () => {
  return apiList;
};

export default getApiList;