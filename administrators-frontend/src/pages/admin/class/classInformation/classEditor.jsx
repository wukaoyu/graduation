import React from 'react';
import { Tabs } from 'antd'
import ClassesEditorChild from './components/classEditorChild';
import ClassEditorStudent from './components/classEditorStudent';
const { TabPane } = Tabs;

class ClassesEditor extends React.Component {
  constructor(props) {
    super(props)
    let paramData = {}, searchArray = this.props.location.search.substr(1).split('&')
    searchArray.forEach(item => {
      let newArray = item.split('=')
      paramData[newArray[0]] = parseInt(newArray[1])
    })
    this.state = {
      params: paramData
    }
  }
  render () {
    return (
      <div>
        <Tabs defaultActiveKey="1">
          <TabPane tab="学生管理" key="1">
            <ClassEditorStudent params={this.state.params}/>
          </TabPane>
          <TabPane tab="课程管理" key="2">
            课程管理的组件
          </TabPane>
          <TabPane tab="班级信息" key="3">
            <ClassesEditorChild params={this.state.params}/>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export default ClassesEditor