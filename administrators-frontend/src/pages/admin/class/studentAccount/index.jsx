import React  from 'react';
import { Table, Button, Form, Input, Select, Modal, message, Popover, Upload, Icon } from 'antd'
import { queryStudentPage, upDataStudent, deleteStudent, insertStudent, fileStudentAccount, queryAllClass } from 'api/admin/classes'
import AddOrEditor from './addOrEditor'
import './index.less'
const { Column } = Table;
const { Option } = Select;
const { Dragger } = Upload;
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
            studentData: [],
            visible: false, // 是否显示编辑账号的弹窗
            addOrEditorTitle: '',
            editorData: {},
            userInfo: window.userInfo,
            isShowTeacherForm: true,
            fileVisible: false,
            fileList: [],
            allClassList: [],
            fileAddClass: undefined
        }
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
                                initialValue:this.state.editorData.classId || '',
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
                    <FormItem colon={false} label=' ' >
                        <Button type="primary" onClick={ () => this.handAddAccount()}>新增</Button>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" onClick={ () => this.handAddFile()}>批量导入</Button>
                    </FormItem>
                </Form>
                <Table style={{marginTop: '20px'}} dataSource={this.state.studentData} scroll={{ y: `calc(100vh - ${350}px)` }} rowKey={record => record.id} pagination={paginationProps}>
                    <Column title="序号" dataIndex="index" key="index" align='center' width='150' render={(text,record,index) => (
                        index+1
                    )} />
                    <Column title='姓名' dataIndex='username' key='username' align='center' width='150'/>
                    <Column title='账号' dataIndex='account' key='account' align='center' width='150'/>
                    <Column title='班级' dataIndex='className' key='className' align='center' width='150'/>
                    <Column title='创建时间' dataIndex='createTime' key='createTime' align='center'/>
                    <Column title='性别' dataIndex='sex' key='sex' align='center'/>
                    <Column title='操作' dataIndex='handle' key='handle' align='center' render={(text,record,index) => (
                        <div>
                            <Button style={{marginRight:'10px'}} onClick={ () => this.handAddAccount(record)}>编辑</Button>
                            <Popover placement="topRight" trigger='click' content = {
                                <div>
                                    <p>删除后将无法复原数据，<br/>确认删除吗？</p>
                                    <div className='teacher-delete-btn'>
                                        <Button type="danger" size={'small'} onClick={ () => this.handDeleteAccount(record.id)}>确认</Button>
                                    </div>
                                </div>
                            }>
                                <Button type="danger">删除</Button>
                            </Popover>
                        </div>
                    )}/>
                </Table>
                <Modal
                title={this.state.addOrEditorTitle}
                visible={this.state.visible}
                onCancel={this.handCloseAccount}
                footer={
                    [] // 设置footer为空，去掉 取消 确定默认按钮
                }>
                    {
                        this.state.isShowTeacherForm ? 
                        <AddOrEditor editorData={this.state.editorData} handleCloseAccount={this.handCloseAccount} addOrEditorAccount={this.addOrEditorAccount} allClassList={this.state.allClassList}/>
                        : null
                    }
                </Modal>
                <Modal
                title={'批量导入'}
                visible={this.state.fileVisible}
                onCancel={this.handCloseFile}
                footer={
                    <div>
                        <Button onClick={this.handCloseFile}>取消</Button>
                        <a href="https://wkydegraduation.oss-cn-beijing.aliyuncs.com/teacherAccount.xls" style={{margin: '0 8px'}}>
                            <Button>下载模板</Button>
                        </a>
                        <Button type="primary" onClick={this.fileUpload}>上传文件</Button>
                    </div>
                }>
                    <div style={{display:'flex', alignItems:'center', marginBottom: '10px'}}>
                        <div style={{marginLeft: '10px'}}>添加班级：</div>
                        <Select
                        showSearch
                        allowClear
                        onChange={(val) => this.changeFileClass(val)}
                        filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        style={{ width: 150 }}>
                            {
                                this.state.allClassList.map(item => {
                                    return <Option key={item.id} value={item.id}>{item.className}</Option>
                                })
                            }
                        </Select>
                    </div>
                    <Dragger
                    accept='.xls,.xlsx'
                    fileList={this.state.fileList}
                    onChange={this.changeFile}
                    beforeUpload={this.getFile}>
                        <p className="ant-upload-drag-icon">
                            <Icon type="inbox" />
                        </p>
                        <p className="ant-upload-text">单击或拖动Excel文件到此区域上传文件</p>
                    </Dragger>
                </Modal>
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
    /**
     * 跳出编辑账号的弹窗
     */
    handAddAccount = (data = {}) => {
        let title
        if (data.id) {
            title = '修改账号'
        }else {
            title = '增加账号'
        }
        this.setState({
            visible: true,
            addOrEditorTitle: title,
            editorData: data,
            isShowTeacherForm: true
        });
    }
    /**
     * 关闭编辑账号的弹窗
     */
    handCloseAccount = () => {
        this.setState({
            visible: false
        });
        let timeout = setTimeout(() => {
            this.setState({
                isShowTeacherForm: false
            });
            clearTimeout(timeout)
        },200)
    }
    /**
     * 添加教师账号
     * @param {*} value 账号信息
     */
    addOrEditorAccount = (value) => {
        if (this.state.editorData.id) {
            value.id = this.state.editorData.id
            upDataStudent(value).then(res => {
                if (res.errno === 0) {
                    message.success('修改成功');
                }else {
                    message.error('修改失败');
                }
                this.funStudentPage()
            })
        }else {
            value.createBy = this.state.userInfo.id
            value.createIdentity = 1
            insertStudent(value).then(res => {
                if (res.errno === 0) {
                    message.success('添加成功');
                }else {
                    message.error(res.data);
                }
                this.funStudentPage()
            })
        }
    }
    /**
     * 删除教师账号
     * @param {Number} id 删除的ID
     */
    handDeleteAccount = (id) => {
        deleteStudent({id: id}).then(res => {
            if (res.errno === 0) {
                message.success('删除成功');
            }else {
                message.success('删除失败');
            }
            this.funStudentPage()
        })
    }
    /**
     * 文件赋值
     */
    getFile = (file) => {
        this.setState({
            fileList: [file]
        })
        return false
    }
    changeFile = (info) => {
        if (info.fileList.length === 0) {
            this.setState({
              fileList: info.fileList
            })
          }
    }
    /**
     * 关闭上传文件的弹窗
     */
    closeFile = () => {
        this.setState({
            fileVisible: false
        })
    }
    changeFileClass = (val) => {
        this.setState({
            fileAddClass: val
        })
    }
    /**
     * 跳出批量导入文件的弹窗
     */
    handAddFile = () => {
        this.setState({
            fileVisible: true
        })
    }
    /**
     * 上传文件
     */
    fileUpload = () => {
        let formData = new FormData()
        formData.append('file', this.state.fileList[0])
        formData.append('createBy', this.state.userInfo.id)
        formData.append('createIdentity', 1)
        formData.append('classId',  this.state.fileAddClass)
        fileStudentAccount(formData).then(res => {
            if (res.errno === 0) {
                this.funStudentPage()
                this.setState({
                    fileVisible: false,
                    fileList: []
                })
                message.success(res.data)
            }else {
                message.warning(res.data)
            }
        })
    }
    /**
     * 关闭批量导入的窗口
     */
    handCloseFile = () => {
        this.setState({
            fileVisible: false
        })
    }
}

export default Form.create()(TeacherAccount);