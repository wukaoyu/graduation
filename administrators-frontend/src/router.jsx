import React from 'react'
import { HashRouter, Switch, Route } from 'react-router-dom'
import App from './App'
import Login from './pages/login/login.jsx'
import AdminMain from './pages/admin/components/main/main.jsx'
import TeacherAccount from './pages/admin/account/teacherAccount/index'

export default class Router extends React.Component {
    constructor(props) {
        super(props)
        if (!localStorage.getItem('token') || !localStorage.getItem('userInfo')) {
            window.location.href = '/#/';
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
                            </AdminMain>
                        }/>
                        <Route path='/' component={Login}/>
                    </Switch>
                </App>
            </HashRouter>
        )
    }
}