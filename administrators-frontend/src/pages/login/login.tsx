import React from 'react'
import { Button, Form, Input, Icon } from 'antd'
import {FormComponentProps} from 'antd/lib/form/Form';
import { login } from '../../api/login'
import './login.less'
const FormItem = Form.Item
interface CreateNoticeModalProps extends FormComponentProps {
    isShow: boolean
    onCancel: any
    onOk: any
}
class Login extends React.Component<CreateNoticeModalProps, {}>  {
    constructor(props) {
        super(props)
    }
    userLogin = () => {
        let userInfo = this.props.form.getFieldsValue()
        userInfo.identity = 1
        login(userInfo).then(res => {
            console.log(res)
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

export default Form.create<CreateNoticeModalProps>()(Login)