import React from 'react';
import { Tabs } from 'antd'
import ClassesEditorChild from './components/classEditorChild';
import ClassEditorStudent from './components/classEditorStudent';
import ClassesEditorCourse from './components/classEditorCourse';
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
        <Tabs defaultActiveKey="2">
          <TabPane tab="学生管理" key="1">
            <ClassEditorStudent params={this.state.params} history={this.props.history}/>
          </TabPane>
          <TabPane tab="课程管理" key="2">
            <ClassesEditorCourse params={this.state.params} history={this.props.history}/>
          </TabPane>
          <TabPane tab="班级信息" key="3">
            <ClassesEditorChild params={this.state.params} />
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export default ClassesEditor