import React from 'react'
import { Row } from 'antd'
import ScrollView from 'react-custom-scrollbars'
import NavLeft from '../navLeft/navLeft'
import Footer from '../footer/footer'
import Header from '../header/header'
import './main.less'

export default class Main extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            identity: window.userInfo.identity
        }
    }
    render() {
        return(
            <div>
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
                </div> 
            </div>
        )
    }
}