import React from 'react'
import { HashRouter, Switch, Route } from 'react-router-dom'
import App from './App'
import Login from './pages/login/login.jsx'
import Main from './pages/student/components/main/main.jsx'
import CourseMain from './pages/student/course/index.jsx'
import Practice from './pages/student/course/practice'
import CourseExamation from './pages/student/course/courseExamation'
import TestPapergetMarks from './pages/student/course/testPapergetMarks'
import ExaminationMain from './pages/examination/index'
import StudentPersonal from './components/personal/index'

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
                        <Route path='/student' render={() =>
                            <Main>
                                <Route path='/student/course/main' component={CourseMain}/>
                                <Route path='/student/course/practice' component={Practice}/>
                                <Route path='/student/course/courseExamation' component={CourseExamation}/>
                                <Route path='/student/course/testPapergetMarks' component={TestPapergetMarks}/>
                                <Route path='/student/personal/main' component={StudentPersonal}/>
                            </Main>
                        }/>
                        <Route path='/examination/main' component={ExaminationMain}/>
                        <Route path='/' component={Login}/>
                    </Switch>
                </App>
            </HashRouter>
        )
    }
}