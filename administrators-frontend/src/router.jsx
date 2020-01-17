import React from 'react'
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom'
import App from './App'
import Login from './pages/login/login.tsx'

export default class Router extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <HashRouter>
                <App>
                    <Switch>
                        <Route>
                            <Route path='/' component={Login}/>
                        </Route>
                    </Switch>
                </App>
            </HashRouter>
        )
    }
}