import React from 'react'
import { Button, Form, Input, Icon, message } from 'antd'
import { login } from '../../api/login'
// 引入解析token方法
import jwt_decode from 'jwt-decode'
import './login.less'
const FormItem = Form.Item
class Login extends React.Component  {
    constructor(props) {
        super(props)
        if (localStorage.getItem('token')) { 
            const userInfo = jwt_decode(localStorage.getItem('token')).data
            if (userInfo.id) {
                this.props.history.push('/student/course/main')
            }
        }
        this.state = {
            formItemLayout:  {
                labelCol: {
                    xs: { span: 24 },
                    sm: { span: 4 },
                },
                wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 20 },
                },
            }
        }
    }
    userLogin = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let userInfo = this.props.form.getFieldsValue()
                userInfo.identity = 3
                login(userInfo).then(res => {
                    if (res.errno === 0) {
                        localStorage.setItem('token',res.data.token)
                        const userInfo = jwt_decode(localStorage.getItem('token')).data
                        window.userInfo = userInfo
                        this.props.history.push('/student/course/main')
                        message.success(`登录成功，欢迎${userInfo.username}`)
                    }else if (res.errno === -1) {
                        message.error('用户名或密码错误')
                    }
                })
            }
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="login-center">
                <div className='login-center-head'>
                    <div className='login-center-head-text'>
                        <img src="/assets/logo-ant.svg" className='login-center-head-img' alt='logo'/>
                        欢迎登录考试系统
                    </div>
                </div>
                <Form  className="login-box" {...this.state.formItemLayout}>
                    <FormItem
                    className="login-item">
                        {
                            getFieldDecorator('account', {
                                initialValue: '',
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入账号!',
                                    }
                                ]
                            })(
                                <Input prefix={<Icon type="user"/>}  placeholder='请输入用户名'/>
                            )
                        }
                    </FormItem>
                    <FormItem
                    className="login-item">
                        {
                            getFieldDecorator('password', {
                                initialValue: '',
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入密码!',
                                    }
                                ]
                            })(
                                <Input type='password' prefix={<Icon type="lock"/>} placeholder='请输入密码'/>
                            )
                        }
                    </FormItem>
                    <FormItem colon={false}>
                        <Button type="primary" onClick={this.userLogin} style={{width: '100%'}}>登录</Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
}

export default Form.create()(Login)