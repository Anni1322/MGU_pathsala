// package igkvmis.igkv.api;

// import java.util.List;

// import igkvmis.igkv.attendance.Attendance_GetCourseWiseStudentCountRes;
// import igkvmis.igkv.attendance.Attendance_GetCourseWiseStudentListRes;
// import igkvmis.igkv.attendance.Attendance_res;
// import igkvmis.igkv.model.UploadOldQuestionPaperRes;
// import igkvmis.igkv.model.complain_res.ComplainDetailListRes;
// import igkvmis.igkv.model.department_wise_student_count.DepartmentWiseStudentRes;
// import igkvmis.igkv.model.getComplainCountDashRes.GetComplainCountDashRes;
// import igkvmis.igkv.model.getEGrievanceCountRes.GetEGrievancesRes;
// import igkvmis.igkv.model.getEmployeeDetailRes.EmployeeDetailRes;
// import igkvmis.igkv.model.get_attachment_image_res.GetAttachmentImageRes;
// import igkvmis.igkv.model.get_course_res.GetCourseRes;
// import igkvmis.igkv.model.get_course_wise_student_count_res.GetCourseWiseStudentCountRes;
// import igkvmis.igkv.model.get_course_wise_student_list.GetCourseWiseStudentListRes;
// import igkvmis.igkv.model.get_degree_type_wise_student_count_res.GetDegreeTypeWiseStudentCountRes;
// import igkvmis.igkv.model.get_employee_res.EmployeeListRes;
// import igkvmis.igkv.model.get_finance_action_res.FinanceActionRes;
// import igkvmis.igkv.model.get_finance_bill_detail_res.FinanceBillChannelDetailRes;
// import igkvmis.igkv.model.get_finance_dash_coun_res.FinanceDashCountRes;
// import igkvmis.igkv.model.get_login_by_otp_res.GetLoginByOTPRes;
// import igkvmis.igkv.model.get_login_otp_res.GetLoginOtpRes;
// import igkvmis.igkv.model.get_post_res.PostListRes;
// import igkvmis.igkv.model.get_problem_res.ProblemListRes;
// import igkvmis.igkv.model.get_study_assignment_res.StudyAssignmentDashRes;
// import igkvmis.igkv.model.get_study_file_type_master_res.GetStudyMaterialMasterRes;
// import igkvmis.igkv.model.get_study_material_res.StudyMaterialDashRes;
// import igkvmis.igkv.model.get_study_query_count_res.GetStudyQueryRes;

// import igkvmis.igkv.model.get_sub_problem_res.SubProblemListRes;
// import igkvmis.igkv.model.login_res.LoginRes;
// import igkvmis.igkv.model.office_list_res.OfficeListRes;
// import igkvmis.igkv.model.save_assignment_approval_res.SaveAssignmentApprovalRes;
// import igkvmis.igkv.model.save_assignment_marks_res.SaveAssignmentMarksRes;
// import igkvmis.igkv.model.save_exam_qestion_res.SaveExamQuestionPaperRes;
// import igkvmis.igkv.model.save_forward_with_res.ForwardWithRemarkRes;
// import igkvmis.igkv.model.save_materail_like_comment.AddStudyMaterialLikeCommentRes;
// import igkvmis.igkv.model.save_study_material_res.UploadMaterialRes;
// import igkvmis.igkv.model.save_video_from_youtube_res.SaveYouTubeVideoRes;
// import igkvmis.igkv.model.upload_assignment_res.UploadAssignmentRes;
// import misigkv.scorner.Model.get_study_query_list_res.GetStudyQueryListRes;
// import misigkv.scorner.Model.save_view_count_res.SaveViewCountRes;
// import okhttp3.MultipartBody;
// import okhttp3.RequestBody;
// import retrofit2.Call;
// import retrofit2.http.Field;
// import retrofit2.http.FormUrlEncoded;
// import retrofit2.http.Multipart;
// import retrofit2.http.POST;
// import retrofit2.http.Part;

// public interface Api {

//     @FormUrlEncoded
//     @POST("GetAdmimLogin")
//     Call<LoginRes> getLogin(@Field("user_id") String user_id,
//                             @Field("password") String pass,
//                             @Field("ip_address") String ip_address
//     );


//     @FormUrlEncoded
//     @POST("getComplainDetail")
//     Call<ComplainDetailListRes> getComplain(@Field("complain_Id") String complain_Id,
//                                             @Field("emp_Id") String emp_Id,
//                                             @Field("isEncryptedCID") String isEncryptedCID
//     );

//     @FormUrlEncoded
//     @POST("getOffice")
//     Call<OfficeListRes> getOffice(@Field("office_id") String office_id,
//                                   @Field("post_id") String post_id,
//                                   @Field("problem_id") String problem_id
//     );

//     @FormUrlEncoded
//     @POST("getPost")
//     Call<PostListRes> getPostList(@Field("office_id") String office_id,
//                                   @Field("post_id") String post_id,
//                                   @Field("problem_id") String problem_id
//     );

//     @FormUrlEncoded
//     @POST("getEmployee")
//     Call<EmployeeListRes> getEmployeeList(@Field("office_id") String office_id,
//                                           @Field("post_id") String post_id,
//                                           @Field("problem_id") String problem_id
//     );

//     @FormUrlEncoded
//     @POST("getProblemList")
//     Call<ProblemListRes> getProblemList(@Field("problem_id") String problem_id);

//     @FormUrlEncoded
//     @POST("getSubProblemList")
//     Call<SubProblemListRes> getSubProblemList(@Field("problem_id") String problem_id);

//     @FormUrlEncoded
//     @POST("addForwardWithRemark")
//     Call<ForwardWithRemarkRes> addForwardWithRemark(
//             @Field("complain_id") String complain_id,
//             @Field("office_id") String office_id,
//             @Field("post_id") String post_id,
//             @Field("emp_id") String emp_id,
//             @Field("to_problem_id") String to_problem_id,
//             @Field("to_sub_problem_id") String to_sub_problem_id,
//             @Field("to_office_id") String to_office_id,
//             @Field("to_post_id") String to_post_id,
//             @Field("to_emp_id") String to_emp_id, @Field("action_id") String action_id,
//             @Field("remark") String remark, @Field("last_update_public_ip") String last_update_public_ip,
//             @Field("last_update_private_ip") String last_update_private_ip,
//             @Field("sms") String sms, @Field("is_sms_yn") String is_sms_yn,
//             @Field("attachmentDetail") String attachmentDetail);

//     @FormUrlEncoded
//     @POST("getAttachmentImagesById")
//     Call<GetAttachmentImageRes> getAttachmentImage(
//             @Field("Complain_Attachment_Id") String Complain_Attachment_Id
//     );

//     @FormUrlEncoded
//     @POST("getEGrievances")
//     Call<GetEGrievancesRes> getEGrievances(
//             @Field("selectedEgrievanceId") String selectedEgrievanceId,
//             @Field("LoginOfficeId") String LoginOfficeId,
//             @Field("LoginPostId") String LoginPostId,
//             @Field("LoginEmpId") String LoginEmpId);

//     @FormUrlEncoded
//     @POST("getComplainCountDashboard")
//     Call<GetComplainCountDashRes> getComplainCountDashboard(
//             @Field("__Dashboard_summary") String __Dashboard_summary,
//             @Field("selectedIdWise") String selectedIdWise,
//             @Field("LoginOfficeId") String LoginOfficeId,
//             @Field("LoginPostId") String LoginPostId,
//             @Field("LoginEmpId") String LoginEmpId);


//     @FormUrlEncoded
//     @POST("getStudyMaterialDashCount")
//     Call<StudyMaterialDashRes> getStudyMaterialCountDashboard(
//             @Field("Created_By") String Created_By);

//     @FormUrlEncoded
//     @POST("getEmployeeDetailById")
//     Call<EmployeeDetailRes> getEmployeeDetailById(
//             @Field("emp_id") String emp_id);


// //    @FormUrlEncoded
// //    @POST("getStudentsDashCount")
// //    Call<StudentDashCountRes> getStudentCountDashboard(
// //            @Field("emp_id") String emp_id,
// //            @Field("Academic_Session_Id") String Academic_Session_Id,
// //            @Field("Semester_Id") String Semester_Id);


//     @FormUrlEncoded
//     @POST("getAllDetailAfterClickAction")
//     Call<FinanceBillChannelDetailRes> getFinanceBillDetail(@Field("channel_flow_main_id") String channel_flow_main_id,
//                                                            @Field("emp_id") String emp_id);


//     @FormUrlEncoded
//     @POST("sendFinanceBillAction")
//     Call<FinanceActionRes> sendFinanceBillAction(
//             @Field("channel_purpose_id") String channel_purpose_id,
//             @Field("create_by") String create_by,
//             @Field("Send_by_office") String Send_by_office,
//             @Field("Send_by_role") String Send_by_role,
//             @Field("send_to") String send_to,
//             @Field("send_to_office") String send_to_office,
//             @Field("send_to_role") String send_to_role,
//             @Field("action_type") String action_type,
//             @Field("remark") String remark,
//             @Field("moudule_id") String moudule_id,
//             @Field("priority_Id") String priority_Id,
//             @Field("channelId") String channelId,
//             @Field("billnumber") String billnumber,
//             @Field("filepath") String filepath
//     );

//     @FormUrlEncoded
//     @POST("getFinancialDashCount")
//     Call<FinanceDashCountRes> getFinanceDashCountRes(
//             @Field("emp_id") String emp_id,
//             @Field("Fin_Year") String Fin_Year);


//     @FormUrlEncoded
//     @POST("addStudyMaterialLikeComment")
//     Call<AddStudyMaterialLikeCommentRes> addStudyMaterialLikeComment(
//             @Field("study_material_id") String study_material_id,
//             @Field("comment") String comment,
//             @Field("is_comment") String is_comment,
//             @Field("post_by") String post_by,
//             @Field("post_date") String post_date);


//     @FormUrlEncoded
//     @POST("getStudyAssignmentDashCount")
//     Call<StudyAssignmentDashRes> getStudyAssignmentCountDashboard(
//             @Field("Academic_session") String Academic_session,
//             @Field("Created_By") String Created_By,
//             @Field("Semester_Id") String Semester_Id
//     );

//     @FormUrlEncoded
//     @POST("getCourseWiseDashCount")
//     Call<GetCourseWiseStudentCountRes> getCourseWiseStudentCount(
//             @Field("Academic_session") String Academic_session,
//             @Field("Emp_Id") String Emp_Id,
//             @Field("Semester_Id") String Semester_Id
//     );

//     @FormUrlEncoded
//     @POST("getCourseWiseStudentList")
//     Call<GetCourseWiseStudentListRes> getCourseWiseStudentList(
//             @Field("Academic_session") String Academic_session,
//             @Field("Emp_Id") String Emp_Id,
//             @Field("Semester_Id") String Semester_Id,
//             @Field("Course_Id") String Course_Id,
//             @Field("Degree_Programme_Id") String Degree_Programme_Id,
//             @Field("Degree_Programme_Type_Id") String Degree_Programme_Type_Id,
//             @Field("Subject_Id") String Subject_Id
//     );

//     @FormUrlEncoded
//     @POST("getDegreeTypeWiseDashCount")
//     Call<GetDegreeTypeWiseStudentCountRes> getDegreeTypeWiseDashCount(
//             @Field("Academic_session") String Academic_session,
//             @Field("Emp_Id") String Emp_Id,
//             @Field("Semester_Id") String Semester_Id
//     );

//     @FormUrlEncoded
//     @POST("saveAssignmentMarks")
//     Call<SaveAssignmentMarksRes> saveAssignmentMarks(
//             @Field("assignment_submit_id") String assignment_submit_id,
//             @Field("assignment_id") String assignment_id,
//             @Field("student_id") String student_id,
//             @Field("emp_id") String emp_id,
//             @Field("marks") String marks
//     );

//     @FormUrlEncoded
//     @POST("getCourseCodeFacultyWise")
//     Call<GetCourseRes> getCourseCodeFacultyWise(
//             @Field("Academic_session") String Academic_session,
//             @Field("emp_id") String emp_id,
//             @Field("Semester_Id") String Semester_Id
//     );

//     @FormUrlEncoded
//     @POST("Get_File_Type_Masters")
//     Call<GetStudyMaterialMasterRes> get_File_Type_Masters(@Field("emp_id") String emp_id);


//     @FormUrlEncoded
//     @POST("Get_Study_Query_Dash_Count")
//     Call<GetStudyQueryRes> get_Study_Query_Dash_Count(@Field("Academic_session") String Academic_session,
//                                                       @Field("Emp_Id") String Emp_Id);


//     // get class form library
//     @FormUrlEncoded
//     @POST("GetChatQueryMessageList")
//     Call<GetStudyQueryListRes> getStudyQueryList(@Field("student_id") String student_id,
//                                                  @Field("Emp_Id") String Emp_Id,
//                                                  @Field("query_id") String query_id,
//                                                  @Field("isReply") String isReply
//     );
//     // get class form library
//     @FormUrlEncoded
//     @POST("GetLoginOTP")
//     Call<GetLoginOtpRes> GetLoginOTP(@Field("mobilenumber") String mobilenumber,
//                                      @Field("otp") String otp,
//                                      @Field("hash_key") String hash_key,
//                                      @Field("is_student") String is_student,
//                                      @Field("Device_ID") String Device_ID,
//                                      @Field("Mobile_Brand") String Mobile_Brand,
//                                      @Field("Mobile_Model") String Mobile_Model,
//                                      @Field("Mobile_Release_Date") String Mobile_Release_Date,
//                                      @Field("Mobile_SDK") String Mobile_SDK,
//                                      @Field("Data_Speed_Rate") String Data_Speed_Rate,
//                                      @Field("Service_Provider") String Service_Provider,
//                                      @Field("Connection_Type") String Connection_Type
//     );
//     // get class form library
//     @FormUrlEncoded
//     @POST("GetLoginByOTP")
//     Call<GetLoginByOTPRes> GetLoginByOTP(@Field("stored_otp") String stored_otp,
//                                          @Field("input_otp") String input_otp,
//                                          @Field("login_id") String login_id,
//                                          @Field("user_public_ip") String user_public_ip,
//                                          @Field("user_private_ip") String user_private_ip);


//     // get class form library
//     @FormUrlEncoded
//     @POST("saveVideoLectureFromYouTube")
//     Call<SaveYouTubeVideoRes> saveVideoLectureFromYouTube(@Field("course_id") String course_id,
//                                                           @Field("language_id") String language_id,
//                                                           @Field("file_type_id") String file_type_id,
//                                                           @Field("title") String title,
//                                                           @Field("emp_id") String emp_id,
//                                                           @Field("video_id") String video_id,
//                                                           @Field("Chapter_Id") String Chapter_Id
//     );
//     // this is for assignment file approval
//     @FormUrlEncoded
//     @POST("SaveUploadAssignmentApproval")
//     Call<SaveAssignmentApprovalRes> saveUploadAssignmentApproval(@Field("to_update_id") String to_update_id,
//                                                                  @Field("is_approved") String is_approved,
//                                                                  @Field("remark") String remark,
//                                                                  @Field("Emp_ID") String Emp_ID);

//     // this is for material file approval
//     @FormUrlEncoded
//     @POST("SaveUploadMaterialFileApproval")
//     Call<SaveAssignmentApprovalRes> saveUploadMaterialFileApproval(@Field("to_update_id") String to_update_id,
//                                                                    @Field("is_approved") String is_approved,
//                                                                    @Field("remark") String remark,
//                                                                    @Field("Emp_ID") String Emp_ID);

//     @Multipart
//     @POST("SaveExamQuestionFileByApp")
//     Call<SaveExamQuestionPaperRes> SaveExamQuestionFileByApp(
//             @Part("Created_By") RequestBody Created_By,
//             @Part("Question_Paper_Name_E") RequestBody Question_Paper_Name_E,
//             @Part("exam_type_id") RequestBody exam_type_id,
//             @Part("Exam_Paper_Type_Id") RequestBody Exam_Paper_Type_Id,
//             @Part("exam_nature_type") RequestBody exam_nature_type,
//             @Part("academic_session") RequestBody academic_session,
//             @Part("semester") RequestBody semester,
//             @Part("degree_program") RequestBody degree_program,
//             @Part("course_id") RequestBody course_id,
//             @Part("exam_date") RequestBody exam_date,
//             @Part("exam_time") RequestBody exam_time,
//             @Part("exam_duration") RequestBody exam_duration,
//             @Part("upload_answer_duration") RequestBody upload_answer_duration,
//             @Part("Question_File_Password") RequestBody Question_File_Password,
//             @Part("Emp_Id") RequestBody Emp_Id,
//             @Part("size") RequestBody size,
//             @Part List<MultipartBody.Part> files);

//     @FormUrlEncoded
//     @POST("getDepartmentWiseStudentDashCount")
//     Call<DepartmentWiseStudentRes> getDepartmentWiseStudentDashCount(
//             @Field("Academic_session") String Academic_session,
//             @Field("Emp_Id") String Emp_Id,
//             @Field("Semester_Id") String Semester_Id,
//             @Field("Degree_Programme_Type_Id") String Degree_Programme_Type_Id
//     );
//     @FormUrlEncoded
//     @POST("deleteUploadMaterialAssignmentFile")
//     Call<SaveAssignmentApprovalRes> deleteUploadMaterialAssignmentFile(@Field("to_update_id") String to_update_id,
//                                                                        @Field("remark") String remark,
//                                                                        @Field("Emp_ID") String Emp_ID,
//                                                                        @Field("is_assignment") String is_assignment);

//     @Multipart
//     @POST("DeleteExamQuestionPaperByApp")
//     Call<SaveViewCountRes> DeleteExamQuestionPaperByApp(@Part("Emp_Id") RequestBody Emp_Id,
//                                                         @Part("Question_Paper_ID") RequestBody Question_Paper_ID

//     );

//     @Multipart
//     @POST("EditExamQuestionPaperByApp")
//     Call<SaveViewCountRes> EditExamQuestionPaperByApp(@Part("Emp_Id") RequestBody Emp_Id,
//                                                       @Part("Question_Paper_ID") RequestBody Question_Paper_ID,
//                                                       @Part("Exam_Date") RequestBody Exam_Date,
//                                                       @Part("Exam_Time") RequestBody Exam_Time

//     );
//     @Multipart
//     @POST("saveStudyMaterailFile")
//     Call<UploadMaterialRes> saveStudyMaterialFile(
//             @Part("course_id") RequestBody course_id,
//             @Part("language_id") RequestBody language_id,
//             @Part("file_type_id") RequestBody file_type_id,
//             @Part("title") RequestBody title,
//             @Part("emp_id") RequestBody emp_id,
//             @Part("File_Size") RequestBody File_Size,
//             @Part("file_name") RequestBody file_name,
//             @Part("size") RequestBody size,
//             @Part("Chapter_Id") RequestBody Chapter_Id,
//             @Part List<MultipartBody.Part> files);


//     @Multipart
//     @POST("saveStudyAssignemtnFile")
//     Call<UploadAssignmentRes> saveStudyAssignmentFile(
//             @Part("course_id") RequestBody course_id,
//             @Part("language_id") RequestBody language_id,
//             @Part("file_type_id") RequestBody file_type_id,
//             @Part("title") RequestBody title,
//             @Part("marks") RequestBody marks,
//             @Part("emp_id") RequestBody emp_id,
//             @Part("File_Size") RequestBody File_Size,
//             @Part("file_name") RequestBody file_name,
//             @Part("size") RequestBody size,
//             @Part List<MultipartBody.Part> files);


//     @Multipart
//     @POST("saveOldQuestionPaperFile")
//     Call<UploadOldQuestionPaperRes> saveOldQuestionPaperFile(
//             @Part("course_id") RequestBody course_id,
//             @Part("language_id") RequestBody language_id,
//             @Part("file_type_id") RequestBody file_type_id,
//             @Part("title") RequestBody title,
//             @Part("emp_id") RequestBody emp_id,
//             @Part("File_Size") RequestBody File_Size,
//             @Part("file_name") RequestBody file_name,
//             @Part("size") RequestBody size,
//             @Part("academic_session") RequestBody academic_session,
//             @Part("semester") RequestBody semester,
//             @Part List<MultipartBody.Part> files);


//     /*-----------------------Attendance-------------------------*/
//     @FormUrlEncoded
//     @POST("AttendanceGetCourseWiseDashCount")
//     Call<Attendance_GetCourseWiseStudentCountRes> Attendance_getCourseWiseStudentCount(
//             @Field("Academic_session") String Academic_session,
//             @Field("Emp_Id") String Emp_Id,
//             @Field("Semester_Id") String Semester_Id
//     );
//     @FormUrlEncoded
//     @POST("AttendanceGetCourseWiseStudentList")
//     Call<Attendance_GetCourseWiseStudentListRes> Attendance_getCourseWiseStudentList(
//             @Field("Academic_session") String Academic_session,
//             @Field("Emp_Id") String Emp_Id,
//             @Field("Semester_Id") String Semester_Id,
//             @Field("Course_Id") String Course_Id,
//             @Field("Degree_Programme_Id") String Degree_Programme_Id,
//             @Field("Degree_Programme_Type_Id") String Degree_Programme_Type_Id,
//             @Field("Subject_Id") String Subject_Id
//     );
//     @FormUrlEncoded
//     @POST("Attendance_StudentAttendanceSave")
//     Call<Attendance_res> setAttendance(@Field("Academic_session") String Academic_session,
//                                        @Field("Emp_Id") String Emp_Id,
//                                        @Field("Semester_Id") String Semester_Id,
//                                        @Field("Course_Id") String Course_Id,
//                                        @Field("Degree_Programme_Id") String Degree_Programme_Id,
//                                        @Field("Degree_Programme_Type_Id") String Degree_Programme_Type_Id,
//                                        @Field("Subject_Id") String Subject_Id,
//                                        @Field("student_ids") String student_ids
//                                        );
// }

