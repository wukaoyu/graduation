import React from 'react'
import {Row, Col} from 'antd'
import ScrollView from 'react-custom-scrollbars'
import NavLeft from '../navLeft/navLeft'
import Footer from '../footer/footer'
import Header from '../header/header'
import './main.less'
export default class Main extends React.Component {
    render() {
        return(
            <Row>
                <Col span={5} className="nav-left">
                    <NavLeft></NavLeft>
                </Col>
                <Col span={19}>
                    <Header></Header>
                    <Row className="cont-content">
                        <div className="content-scroll"> 
                            <ScrollView>
                                {this.props.children}
                            </ScrollView>
                        </div>
                    </Row>
                    <Footer></Footer>
                </Col>
            </Row>
        )
    }
}