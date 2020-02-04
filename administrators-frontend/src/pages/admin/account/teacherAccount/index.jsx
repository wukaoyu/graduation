import React  from 'react';
import { Table, Button, Form, Input } from 'antd'
import { queryTeacherPage, queryAllAdmin } from '../../../../api/admin'
const { Column } = Table;
const FormItem = Form.Item
class TeacherAccount extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            pageData:{
                pageSize:10,// 每页条数
                current: 1,// 当前页数
                total: 0,// 数据总数
            },
            teacherData: [],
            adminList: []
        }
        this.funTeacherPage()
        this.funQueryAllAdmin()
    }
    render() {
        const paginationProps = {
            showSizeChanger: true,
            showQuickJumper: false,
            showTotal: () => `共${this.state.pageData.total}条`,
            onShowSizeChange: (current,pageSize) => this.changePageSize(pageSize,current),
            onChange: (current) => this.changePage(current),
            ...this.state.pageData
        };
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
            <div>
                <Form {...formItemLayout} layout="inline">
                    <FormItem label='账号'>
                        {
                            getFieldDecorator('account',{
                                initialValue: '',
                                rules: []
                            })(
                                <Input onChange={(e) => this.changeSelect()}/>
                            )
                        }
                    </FormItem>
                    <FormItem label='姓名'>
                        {
                            getFieldDecorator('username',{
                                initialValue: '',
                                rules: []
                            })(
                                <Input onChange={(e) => this.changeSelect()}/>
                            )
                        }
                    </FormItem>
                    <FormItem label='创建者'>
                        <Input/>
                    </FormItem>
                    <FormItem label='性别'>
                        <Input/>
                    </FormItem>
                    <FormItem label='创建时间'>
                        <Input/>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" onClick={ () => this.handAddOrEditor()}>新增</Button>
                    </FormItem>
                </Form>
                <Table dataSource={this.state.teacherData} rowKey={record => record.id} pagination={paginationProps}>
                    <Column title="序号" dataIndex="index" key="index" align='center' width='150' render={(text,record,index) => (
                        index+1
                    )} />
                    <Column title='姓名' dataIndex='username' key='username' align='center' width='150'/>
                    <Column title='账号' dataIndex='account' key='account' align='center' width='150'/>
                    <Column title='创建者' dataIndex='createName' key='createName' align='center'/>
                    <Column title='创建时间' dataIndex='createTime' key='createTime' align='center'/>
                    <Column title='性别' dataIndex='sex' key='sex' align='center'/>
                    <Column title='操作' dataIndex='handle' key='handle' align='center' render={(text,record,index) => (
                        <div>
                            <Button style={{marginRight:'10px'}}>编辑</Button>
                            <Button type="danger">删除</Button>
                        </div>
                    )}/>
                </Table>
            </div>
        )
    }
    /**
     * 查询教师账号分页信息
     */
    funTeacherPage = () => {
        const formData = this.props.form.getFieldsValue()
        let selectData = Object.assign({}, this.state.pageData, formData) 
        queryTeacherPage(selectData).then(res => {
            if (res.errno === 0) {
                res.data.newData.forEach(item => {
                    if (item.sex === 1) {
                        item.sex = '男'
                    }else {
                        item.sex = '女'
                    }
                })
                let newPageData = Object.assign(this.state.pageData, {total: res.data.total})
                this.setState({
                    teacherData: res.data.newData,
                    pageData: newPageData
                })
            }
        })
    } 
    /**
     * 查询所有管理员
     */
    funQueryAllAdmin = () => {
        queryAllAdmin().then(res => {
            if (res.errno === 0) {
                this.setState({
                    adminList: res.data
                })
            }
        })
    }
    /**
     * 改变每页显示条数
     * @param {*} pageSize 选择的每页显示条数
     * @param {*} current 当前第几页
     */
    changePageSize = (pageSize,current) => {
        let newPageData = Object.assign(this.state.pageData, {pageSize, current})
        this.setState({
            pageData: newPageData
        },() => {
            this.funTeacherPage()
        })
    }
    /**
     * 改变当前第几页
     * @param {*} current 当前页数
     */
    changePage = (current) => {
        let newPageData = Object.assign(this.state.pageData, {current})
        this.setState({
            pageData: newPageData
        },() => {
            this.funTeacherPage()
        })
    }
    /**
     * 改变查询条件并查询
     */
    changeSelect = () => {
        let timeout = setTimeout(() => {
            this.funTeacherPage()
            clearTimeout(timeout)
        })
    }
}

export default Form.create()(TeacherAccount);