import React from 'react'
import { HashRouter, Switch, Route } from 'react-router-dom'
import App from './App'
import Login from './pages/login/login.jsx'
import Main from './pages/student/components/main/main.jsx'
import CourseMain from './pages/student/course/index.jsx'
import Practice from './pages/student/course/practice'

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
                        <Route path='/student' render={() =>
                            <Main>
                                <Route path='/student/course/main' component={CourseMain}/>
                                <Route path='/student/course/practice' component={Practice}/>
                            </Main>
                        }/>
                        <Route path='/' component={Login}/>
                    </Switch>
                </App>
            </HashRouter>
        )
    }
}