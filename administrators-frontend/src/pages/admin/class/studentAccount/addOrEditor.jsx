import React from 'react';
import { Form, Input, Button, Radio, Select } from 'antd'

const FormItem = Form.Item
const { Option } = Select;

class addOrEditorTeacher extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            editorData: {},
            allClassList: []
        }
    }
    UNSAFE_componentWillMount() {
        const { editorData, allClassList } = this.props
        const newData = Object.assign({}, editorData)
        if (newData.sex === '男') {
            newData.sex = 1
        }else if (newData.sex === '女') {
            newData.sex = 0
        }
        this.setState({
            editorData: newData,
            allClassList
        }) 
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 8 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 16 },
            },
        };
        return (
            <Form {...formItemLayout} >
                <FormItem label='账号'>
                    {
                        getFieldDecorator('account',{
                            initialValue: this.state.editorData.account || '',
                            rules: [
                                {
                                    required: true,
                                    message: '请输入账号!',
                                }
                            ]
                        })(
                            <Input style={{ width: 200 }}/>
                        )
                    }
                </FormItem>
                <FormItem label='密码'>
                    {
                        getFieldDecorator('password',{
                            initialValue: this.state.editorData.password || '123456',
                            rules: [
                                {
                                    required: true,
                                    message: '请输入密码!',
                                }
                            ]
                        })(
                            <Input.Password style={{ width: 200 }}/>
                        )
                    }
                </FormItem>
                <FormItem label='姓名'>
                    {
                        getFieldDecorator('username',{
                            initialValue:this.state.editorData.username || '',
                            rules: [
                                {
                                    required: true,
                                    message: '请输入姓名'
                                }
                            ]
                        })(
                            <Input style={{ width: 200 }}/>
                        )
                    }
                </FormItem>
                <FormItem label='班级'>
                    {
                        getFieldDecorator('classId',{
                            initialValue:this.state.editorData.classId || null,
                            rules: []
                        })(
                            <Select
                            showSearch
                            allowClear
                            filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            style={{ width: 200 }}>
                                {
                                    this.state.allClassList.map(item => {
                                        return <Option key={item.id} value={item.id}>{item.className}</Option>
                                    })
                                }
                            </Select>
                        )
                    }
                </FormItem>
                <FormItem label='性别'>
                    {
                        getFieldDecorator('sex',{
                            initialValue:this.state.editorData.sex >= 0 ? this.state.editorData.sex : '',
                            rules: [
                                {
                                    required: true,
                                    message: '请选择性别'
                                }
                            ]
                        })(
                            <Radio.Group>
                                <Radio value={1}>男</Radio>
                                <Radio value={0}>女</Radio>
                            </Radio.Group>
                        )
                    }
                </FormItem>
                <FormItem label=' ' colon={false}>
                    <Button type="primary" onClick={this.handleSubmit} >
                        确认
                    </Button>
                    <Button style={{marginLeft:'10px'}} onClick={this.handleClose} >
                        取消
                    </Button>
                </FormItem>
            </Form>
        )
    }
    /**
     * 提交信息
     */
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                // console.log('Received values of form: ', values);
                this.props.addOrEditorAccount(values)
                this.handleClose()
            }
        });
    }
    /**
     * 关闭弹窗
     */
    handleClose = () => {
        this.props.handleCloseAccount()
    }
}

export default Form.create()(addOrEditorTeacher);