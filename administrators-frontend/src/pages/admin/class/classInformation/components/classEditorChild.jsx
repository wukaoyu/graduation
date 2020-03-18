import React  from 'react'; 
import CreateForm from 'components/formComponent/index.jsx'
import { queryClassId, upDataClasses } from 'api/admin/classes'
import { queryAllTeacher } from 'api/admin/account'
import moment from 'moment';
import { DatePicker, Select, message } from 'antd'

const { Option } = Select;

class ClassesEditorChild extends React.Component {
  constructor (props) {
    super(props)
    const { params } = this.props
    this.state = {
      classData: {},
      params,
      teacherList: [],
      CreateForm: ''
    }
    this.funQueryAllTeacher()
    this.funQueryStudentPage()
  }

  render() {
    return (
      <div>
        {
          this.state.classData.id ?  <CreateForm cancelText='重置'
          clickCancel={() => this.state.CreateForm.handleResetFields()}
          clickOk={(val) => this.funEditorClass(val)}
          onRef={this.getCreateForm}
          fromList={[
            {
              formItemProp:{
                label: '班级名称'
              },
              name: 'className',
              initialValue: this.state.classData.className,
              rules:[
                {
                    required: true,
                    message: '请输入班级名称',
                }
              ]
            },
            {
              formItemProp:{
                label: '入学时间'
              },
              name: 'startTime',
              initialValue: moment(this.state.classData.startTime, 'YYYY-MM-DD'),
              rules:[
                {
                    required: true,
                    message: '请选择入学时间',
                }
              ],
              component: <DatePicker style={{ width: 200 }}/>
            },
            {
              formItemProp:{
                label: '毕业时间'
              },
              name: 'graduationTime',
              initialValue:  moment(this.state.classData.graduationTime, 'YYYY-MM-DD'),
              rules:[
                {
                    required: true,
                    message: '请选择毕业时间',
                }
              ],
              component: <DatePicker style={{ width: 200 }}/>
            },
            {
              formItemProp:{
                label: '班主任'
              },
              name: 'mainTeacher',
              initialValue: this.state.classData.mainTeacher,
              component: 
              <Select
              showSearch
              allowClear
              filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              style={{ width: 200 }}>
                  {
                      this.state.teacherList.map(item => {
                          return <Option key={item.id} value={item.id}>{item.username}</Option>
                      })
                  }
              </Select>
            }
          ]} /> : ''
        }
      </div>
    )
  }
  // 查询学生信息
  funQueryStudentPage = () => {
    const data = {
      id: parseInt(this.state.params.id)
    }
    queryClassId(data).then(res => {
      if (res.errno === 0) {
        this.setState({
          classData: res.data
        })
      }
    })
  }

  // 查询所有老师
  funQueryAllTeacher = () => {
    queryAllTeacher().then(res => {
      if (res.errno === 0) {
        this.setState({
          teacherList: res.data
        })
      }
    })
  }
  // 修改学生信息
  funEditorClass = (val) => {
    let data = {
      id: parseInt(this.state.params.id),
      className: val.className,
      mainTeacher: val.mainTeacher,
      startTime: val.startTime.format('YYYY-MM-DD'),
      graduationTime: val.graduationTime.format('YYYY-MM-DD')
    }
    upDataClasses(data).then(res => {
      if (res.errno === 0) {
        message.success('修改成功')
      }
    })
  }

  getCreateForm = (CreateForm) => {
    this.setState({
      CreateForm
    })
  }
}

export default ClassesEditorChild