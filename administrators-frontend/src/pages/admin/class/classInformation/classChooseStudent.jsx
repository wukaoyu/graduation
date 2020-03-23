import React  from 'react';
import { Table, Button, Form, Input, Select, message } from 'antd'
import { queryStudentPage, queryAllClass, upDataStudent } from 'api/admin/classes'
import './index.less'

const createHistory = require("history").createHashHistory

const { Column } = Table;
const { Option } = Select;
const FormItem = Form.Item
const history = createHistory()

class TeacherAccount extends React.Component {
    constructor(props) {
        super(props)
        let paramData = {}, searchArray = this.props.location.search.substr(1).split('&')
        searchArray.forEach(item => {
        let newArray = item.split('=')
            paramData[newArray[0]] = parseInt(newArray[1])
        })
        this.state={
            pageData:{
                pageSize:10,// 每页条数
                current: 1,// 当前页数
                total: 0,// 数据总数
            },
            studentData: [],
            allClassList: [],
            chooseStudentList: [],
            params: paramData
        }
    }
    componentDidMount() {
        this.funStudentPage()
        this.funQueryAllClass()
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
              sm: { span: 7 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 17 },
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
                                <Input style={{ width: 150 }} onChange={() => this.changeSelect()}/>
                            )
                        }
                    </FormItem>
                    <FormItem label='姓名'>
                        {
                            getFieldDecorator('username',{
                                initialValue: '',
                                rules: []
                            })(
                                <Input style={{ width: 150 }} onChange={() => this.changeSelect()}/>
                            )
                        }
                    </FormItem>
                    <FormItem label='班级'>
                        {
                            getFieldDecorator('classId',{
                                initialValue: '',
                                rules: []
                            })(
                                <Select
                                showSearch
                                allowClear
                                onChange={() => this.changeSelect()}
                                filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                style={{ width: 150 }}>
                                    <Option key={0} value={0}>无班级</Option>
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
                                initialValue: '',
                                rules: []
                            })(
                                <Select
                                allowClear
                                style={{ width: 150 }}
                                onChange={() => this.changeSelect()}>
                                  <Option key={1} value={1}>男</Option>
                                  <Option key={0} value={0}>女</Option>
                                </Select>
                            )
                        }
                    </FormItem>
                    <FormItem style={{marginLeft: '16px'}}>
                      <Button type='primary' onClick={() => this.getClassStudent()}>确认</Button>
                    </FormItem>
                    <FormItem>
                      <Button onClick={() => this.goBack()}>返回</Button>
                    </FormItem>
                </Form>
                <Table 
                style={{marginTop: '20px'}} 
                dataSource={this.state.studentData} 
                scroll={{ y: `calc(100vh - ${350}px)` }} 
                rowKey={record => record.id} 
                pagination={paginationProps}
                rowSelection={{
                  type: 'checkbox',
                  onChange: (selectedRowKeys, selectedRows) => {
                    this.setState({
                      chooseStudentList: selectedRows
                    })
                  },
                }}>
                    <Column title="序号" dataIndex="index" key="index" align='center' width='100px' render={(text,record,index) => (
                        index+1
                    )} />
                    <Column title='姓名' dataIndex='username' key='username' align='center' width='150'/>
                    <Column title='账号' dataIndex='account' key='account' align='center' width='150'/>
                    <Column title='性别' dataIndex='sex' width='100px' key='sex' align='center'/>
                    <Column title='班级' dataIndex='className' key='className' align='center' width='150'/>
                    <Column title='创建时间' dataIndex='createTime' key='createTime' align='center'/>
                </Table>
            </div>
        )
    }
    /**
     * 查询所有班级
     */
    funQueryAllClass = () => {
        queryAllClass().then(res => {
            if (res.errno === 0) {
                this.setState({
                    allClassList: res.data
                })
            }
        })
    }
    /**
     * 查询教师账号分页信息
     */
    funStudentPage = () => {
        const formData = this.props.form.getFieldsValue()
        if (formData.time && formData.time.length !== 0) {
            formData.startTime = formData.time[0].format('YYYY-MM-DD') + ' 00:00:00'
            formData.endTime = formData.time[1].format('YYYY-MM-DD')+ ' 23:59:59'
            delete formData.time
        }
        let selectData = Object.assign({}, this.state.pageData, formData) 
        queryStudentPage(selectData).then(res => {
            if (res.errno === 0) {
                let dataList = res.data.row
                dataList.forEach(item => {
                    if (item.sex === 1) {
                        item.sex = '男'
                    }else if (item.sex === 0) {
                        item.sex = '女'
                    }
                })
                let newPageData = Object.assign(this.state.pageData, {total: res.data.count})
                this.setState({
                    studentData: dataList,
                    pageData: newPageData
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
            this.funStudentPage()
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
            this.funStudentPage()
        })
    }
    /**
     * 改变查询条件并查询
     */
    changeSelect = () => {
        let timeout = setTimeout(() => {
            this.funStudentPage()
            clearTimeout(timeout)
        })
    }
    // 选择学生加入班级
    getClassStudent = () => {
        let newData = []
        let newClassId = this.state.params.id
        this.state.chooseStudentList.forEach(item => {
            item.classId = newClassId
            if (item.sex === '男') {
                item.sex = 1
            }else if (item.sex === '女') {
                item.sex = 0
            }
            newData.push(item)
        })
        upDataStudent({studentArray:newData}).then(res => {
            if (res.errno === 0) {
                message.success(`成功添加${newData.length}位学生到该班级`)
            }else {
                message.warning(res.data)
            }
            history.goBack(); 
        })
    }
    // 返回上一页
    goBack = () => {
        history.goBack(); 
    }
}

export default Form.create()(TeacherAccount);