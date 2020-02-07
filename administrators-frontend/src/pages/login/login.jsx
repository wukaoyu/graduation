import React from 'react'
import { Button, Form, Input, Icon } from 'antd'
import { login } from '../../api/login'
import './login.less'
const FormItem = Form.Item
class Login extends React.Component  {
    constructor(props) {
        super(props)
        const userInfo = JSON.parse(localStorage.getItem('userInfo'))
        if (userInfo) { 
            if (userInfo.identity === 1) {
                window.location.href = '/#/admin/account/teacher'
            }
        }
    }
    userLogin = () => {
        let userInfo = this.props.form.getFieldsValue()
        userInfo.identity = 1
        login(userInfo).then(res => {
            if (res.errno === 0) {
                localStorage.setItem('token',res.data.token)
                const userInfo = {
                    name: res.data.name,
                    createName: res.data.createName,
                    identity: res.data.identity,
                    id: res.data.id
                }
                localStorage.setItem('userInfo', JSON.stringify(userInfo))
                this.props.history.push('/admin/account/teacher')
            }
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="login-center">
                <Form  className="login-box">
                    <FormItem
                        label='用户名:'
                        className="login-item">
                        {
                            getFieldDecorator('username', {
                                initialValue: '',
                                rules: []
                            })(
                                <Input prefix={<Icon type="user"/>} placeholder='请输入用户名'/>
                            )
                        }
                    </FormItem>
                    <FormItem
                        label='密码：'
                        className="login-item">
                        {
                            getFieldDecorator('password', {
                                initialValue: '',
                                rules: []
                            })(
                                <Input type='password' prefix={<Icon type="lock"/>} placeholder='请输入密码'/>
                            )
                        }
                    </FormItem>
                    <FormItem >
                        <Button type="primary" onClick={this.userLogin}>登录</Button>
                        <Button style={{margin:'20px'}}>重置</Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
}

export default Form.create()(Login)