import React from 'react'
import { HashRouter, Switch, Route } from 'react-router-dom'
import App from './App'
import Login from './pages/login/login.jsx'
import AdminMain from './pages/admin/components/main/main.jsx'
import TeacherAccount from './pages/admin/account/teacherAccount/index'
import AdminAccount from './pages/admin/account/adminAccount/index'
import ClassInformation from './pages/admin/class/classInformation/index'
import ClassEditor from './pages/admin/class/classInformation/classEditor'
import ClassChooseStudent from './pages/admin/class/classInformation/classChooseStudent'
import StudentAccount from './pages/admin/class/studentAccount/index'
import ClassCourse from "./pages/admin/class/classCourse/index";
import Course from './pages/admin/course/index'
import AdminCourseTestPaper from './pages/admin/course/testPaper'
import AdminEditorTestPaper from './pages/admin/course/editorTestPaper'
import AdminExaminationMain from './pages/admin/examination/index'
import AdminPersonal from './components/personal/index'
import TeacherMain from './pages/teacher/components/main/main'
import TeacherClass from './pages/teacher/class/mainClass/index'
import TeacherEditorStudent from './pages/teacher/class/mainClass/editorStudent'
import TeacherCourseClass from './pages/teacher/class/courseClass/index'
import TeacherCourse from './pages/teacher/course/index'
import TeacherCourseInformation from './pages/teacher/course/courseInformation'
import TestPaper from './pages/teacher/course/testPaper'
import EditorTestPaper from './pages/teacher/course/editorTestPaper'
import ChooseQuestion from './pages/teacher/course/chooseQuestion'
import ExaminationMain from './pages/teacher/examination/index'
import TestPaperCorrection from './pages/teacher/examination/testPaperCorrection'
import TestPapergetMarks from './pages/teacher/examination/testPapergetMarks'
import TestPaperResult from './pages/teacher/examination/testPaperResult'
import TeacherPersonal from './components/personal/index'

import jwt_decode from 'jwt-decode'

const baseEnv = process.env.NODE_ENV
export default class Router extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    UNSAFE_componentWillMount() {
        if (!localStorage.getItem('token')) {
            window.location.href = '/#/';
        }else {
            const userInfo = jwt_decode(localStorage.getItem('token')).data
            window.userInfo = userInfo
        }
        if (baseEnv === 'development') {
            window.baseUrl = 'http://localhost:5000'
        }else if (baseEnv === 'production') {
            window.baseUrl = ''
        }
    }
    render() {
        return (
            <HashRouter>
                <App>
                    <Switch>
                        <Route path='/admin' render={() =>
                            <AdminMain>
                                <Route path='/admin/account/teacher' component={TeacherAccount}/>
                                <Route path='/admin/account/admin' component={AdminAccount}/>
                                <Route path='/admin/class/classTable' component={ClassInformation}/>
                                <Route path='/admin/class/classEditor' component={ClassEditor}/>
                                <Route path='/admin/class/classChooseStudent' component={ClassChooseStudent}/>
                                <Route path='/admin/class/studentAccount' component={StudentAccount}/>
                                <Route path='/admin/class/arrangement' component={ClassCourse}/>
                                <Route path='/admin/course/index' component={Course}/>
                                <Route path='/admin/course/testPaper' component={AdminCourseTestPaper}/>
                                <Route path='/admin/course/editorTestPaper' component={AdminEditorTestPaper}/>
                                <Route path='/admin/examinationRecord/main' component={AdminExaminationMain}/>
                                <Route path='/admin/examinationRecord/testPapergetMarks' component={TestPapergetMarks}/>
                                <Route path='/admin/examinationRecord/testPaperResult' component={TestPaperResult}/>
                                <Route path='/admin/personal/main' component={AdminPersonal}/>
                            </AdminMain>
                        }/>
                        <Route path='/teacher' render={() => 
                            <TeacherMain>
                                <Route path='/teacher/class/mainClass' component={TeacherClass}/>
                                <Route path='/teacher/class/editorStudent' component={TeacherEditorStudent}/>
                                <Route path='/teacher/class/courseClass' component={TeacherCourseClass}/>
                                <Route path='/teacher/course/main' component={TeacherCourse}/>
                                <Route path='/teacher/course/courseInformation' component={TeacherCourseInformation}/>
                                <Route path='/teacher/course/testPaper' component={TestPaper}/>
                                <Route path='/teacher/course/editorTestPaper' component={EditorTestPaper}/>
                                <Route path='/teacher/course/chooseQuestion' component={ChooseQuestion}/>
                                <Route path='/teacher/examinationRecord/main' component={ExaminationMain}/>
                                <Route path='/teacher/examinationRecord/correction' component={TestPaperCorrection}/>
                                <Route path='/teacher/examinationRecord/testPapergetMarks' component={TestPapergetMarks}/>
                                <Route path='/teacher/examinationRecord/testPaperResult' component={TestPaperResult}/>
                                <Route path='/teacher/person/main' component={TeacherPersonal}/>
                            </TeacherMain>
                        }/>
                        <Route path='/' component={Login}/>
                    </Switch>
                </App>
            </HashRouter>
        )
    }
}