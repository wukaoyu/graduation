import React from 'react'
import { queryTestPaperId } from 'api/teacher/course'
class EditorTestPaper extends React.Component {
  constructor(props) {
    super(props)
    let paramData = {}, searchArray = this.props.location.search.substr(1).split('&')
    searchArray.forEach(item => {
    let newArray = item.split('=')
        paramData[newArray[0]] = parseInt(newArray[1])
    })
    this.state = {
      params: paramData,
      testPaperData: {}
    }
  }

  componentDidMount() {
    this.funQueryTestId()
  }

  render() {
    return (
      <div>试卷编辑页面</div>
    )
  }
  // 查询试卷信息
  funQueryTestId = () => {
    queryTestPaperId({id: this.state.params.id, curriculumId: this.state.params.courseId}).then(res => {
      if (res.errno === 0) {
        let testPaperData = res.data
        testPaperData.rules = JSON.parse(testPaperData.rules)
        this.setState({
          testPaperData
        })
      }
    })
  }
}

export default EditorTestPaper