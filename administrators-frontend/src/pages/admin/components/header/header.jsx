import React from 'react'
import { Row,Col } from "antd"
import './header.less'
export default class Header extends React.Component{
    state={
        userInfo: JSON.parse(localStorage.getItem('userInfo'))
    }
    componentWillMount(){
        this.setState({
            userName:this.state.userInfo.name
        })
    }
    loginOut = () => {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
    }
    render(){
        return (
            <div className="header">
                <Row className="header-top">
                        <Col span={6}>
                            <span>欢迎，{this.state.userName}</span>
                        </Col>
                        <Col span={14} style={{
                            textAlign:"right"
                        }}>
                            <span className="date">{this.state.sysTime}</span>
                        </Col>
                        <Col span={4}>
                            <a href="/" onClick={this.loginOut}>退出</a>
                        </Col>
                </Row>
            </div>
        );
    }
}