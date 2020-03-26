import React from 'react'
import { Row } from 'antd'
import ScrollView from 'react-custom-scrollbars'
import NavLeft from '../navLeft/navLeft'
import Footer from '../footer/footer'
import Header from '../header/header'
import './main.less'

const createHistory = require("history").createHashHistory
const history = createHistory()
export default class Main extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            identity: window.userInfo.identity
        }
        if (window.userInfo.identity !== 2) {
            history.goBack();
        }
    }
    render() {
        return(
            <div>
                {
                    this.state.identity === 2 ?
                    <div className="nav-box">
                        <div className="nav-left">
                            <NavLeft></NavLeft>
                        </div>
                        <div className="nav-right">
                            <Header></Header>
                            <Row className="cont-content">
                                <div className="content-scroll"> 
                                    <ScrollView>
                                        {this.props.children}
                                    </ScrollView>
                                </div>
                            </Row>
                            <Footer></Footer>
                        </div>
                    </div> : ''
                }
            </div>
        )
    }
}