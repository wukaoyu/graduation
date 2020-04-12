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
import TeacherMain from './pages/teacher/components/main/main'
import TeacherClass from './pages/teacher/class/index'
import TeacherEditorStudent from './pages/teacher/class/editorStudent'
import TeacherCourse from './pages/teacher/course/index'
import TeacherCourseInformation from './pages/teacher/course/courseInformation'
import TestPaper from './pages/teacher/course/testPaper'
import EditorTestPaper from './pages/teacher/course/editorTestPaper'

import jwt_decode from 'jwt-decode'

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
                                <Route path='/admin/course' component={Course}/>
                            </AdminMain>
                        }/>
                        <Route path='/teacher' render={() => 
                            <TeacherMain>
                                <Route path='/teacher/class/main' component={TeacherClass}/>
                                <Route path='/teacher/class/editorStudent' component={TeacherEditorStudent}/>
                                <Route path='/teacher/course/main' component={TeacherCourse}/>
                                <Route path='/teacher/course/courseInformation' component={TeacherCourseInformation}/>
                                <Route path='/teacher/course/testPaper' component={TestPaper}/>
                                <Route path='/teacher/course/editorTestPaper' component={EditorTestPaper}/>
                            </TeacherMain>
                        }/>
                        <Route path='/' component={Login}/>
                    </Switch>
                </App>
            </HashRouter>
        )
    }
}