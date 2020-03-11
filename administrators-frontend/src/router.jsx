import React from 'react'
import { HashRouter, Switch, Route } from 'react-router-dom'
import App from './App'
import Login from './pages/login/login.jsx'
import AdminMain from './pages/admin/components/main/main.jsx'
import TeacherAccount from './pages/admin/account/teacherAccount/index'
import AdminAccount from './pages/admin/account/adminAccount/index'
import ClassInformation from './pages/admin/class/classInformation/index'
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
            if (userInfo.identity === 1) {
                // window.location.href = '/#/admin/account/teacher'
            }
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
                            </AdminMain>
                        }/>
                        <Route path='/' component={Login}/>
                    </Switch>
                </App>
            </HashRouter>
        )
    }
}