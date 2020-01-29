import React from 'react'
import { HashRouter, Switch, Route } from 'react-router-dom'
import App from './App'
import Login from './pages/login/login.jsx'
import AdminMain from './pages/admin/components/main/main.jsx'

export default class Router extends React.Component {
    constructor(props) {
        super(props)
        const userInfo = JSON.parse(localStorage.getItem('userInfo'))
        if (!localStorage.getItem('token') || !localStorage.getItem('userInfo')) {
            window.location.href = '/#/';
        } else if (userInfo.identity) {
            window.location.href = '/#/admin'
        }
    }

    render() {
        return (
            <HashRouter>
                <App>
                    <Switch>
                        <Route path='/admin' render={() =>
                            <AdminMain>

                            </AdminMain>
                        }/>
                        <Route path='/' component={Login}/>
                    </Switch>
                </App>
            </HashRouter>
        )
    }
}