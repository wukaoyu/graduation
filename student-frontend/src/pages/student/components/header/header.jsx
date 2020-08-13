import React from 'react'
import { Row, Col } from "antd"
import './header.less'
export default class Header extends React.Component{
    UNSAFE_componentWillMount(){
        this.setState({
            userInfo:window.userInfo,
            baseUrl: window.baseUrl
        })
        console.log(process.env.NODE_ENV)
    }
    loginOut = () => {
        localStorage.removeItem('token');
    }
    render(){
        return (
            <div className="header">
                <Row className="header-top">
                    <Col span={20} style={{display:'flex',alignItems:'center'}}>
                        <div className='header-top-headPortraitUrl'>
                            <img src={this.state.userInfo.headPortraitUrl || `${this.state.baseUrl}/public/image/headPortraitUrl.png`} alt='头像'/>
                        </div>
                        <span>欢迎，{this.state.userInfo.username}</span>
                    </Col>
                    <Col span={4}>
                        <a href="/" onClick={this.loginOut}>退出</a>
                    </Col>
                </Row>
            </div>
        );
    }
}