import React from 'react'
import { Card, Input  } from "antd";
import QueueAnim from 'rc-queue-anim';
import { queryMainClassPage } from 'api/teacher/classes';

const { Search } = Input;

class TeacherClass extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      mainClassList: [],
      hasMore: false,
      searchData: {}
    }
  }

  componentDidMount() {
    this.funQueryMainClassPage()
  }
  render() {
    return (
      <div>
        <Search
          placeholder="搜索班级名"
          onChange={value => this.changeValSearch(value)}
          onSearch={value => this.searchClass(value)}
          style={{ width: 200 }}
        />
        <QueueAnim
          style={{ display: 'flex', flexWrap: 'wrap' }}
          duration={600}
          animConfig={[
            { opacity: [1, 0], translateX: [0, 100] }
          ]}>
            {
              this.state.mainClassList.map((item) => {
                return (
                  <div key={item.id}>
                    <Card style={{ width: 280, marginTop: 16, marginRight: 16 }} hoverable 
                      title={item.className}
                      extra={<div style={{color: '#1DA57A'}} onClick={() => this.toEditorStudent(item.id)}>详细信息</div>}>
                        <div className="classMain">
                          <div className='classMain-head'>
                            <img className='classMain-head-img' src={item.headPortraitUrl || "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"} alt="head"/>
                          </div>
                          <div>
                            <div className='classMain-describe'>
                              <div className='classMain-describe-key'>班主任：</div>
                              <div className='classMain-describe-val'>{item.teacherName || '暂无'}</div>
                            </div>
                            <div className='classMain-describe'>
                              <div className='classMain-describe-key'>班级人数：</div>
                              <div className='classMain-describe-val'>{item.studentCount || 0}</div>
                            </div>
                            <div className='classMain-describe'>
                              <div className='classMain-describe-key'>班级时间：</div> 
                              <div className='classMain-describe-val'>{item.timeText}</div> 
                            </div>
                          </div>
                        </div>
                      </Card>
                  </div>
                )
              })
            }
        </QueueAnim>
      </div>
    )
  }
  // 查看我的班级分页信息
  funQueryMainClassPage = () => {
    queryMainClassPage(this.state.searchData).then(res => {
      if (res.errno === 0) {
        let data = res.data.row
        for (let i = 0; i< data.length; i++) {
          data[i].timeText = data[i].startTime.split('-')[0] + '年~' + data[i].graduationTime.split('-')[0] + '年'
        }
        this.setState({
          mainClassList: data,
        })
      }
    })
  }
  // 根据名称搜索班级
  searchClass = (val) => {
    let data = {
      ...this.state.searchData,
      className: val
    }
    this.setState({
      searchData: data
    },() => {
      this.funQueryMainClassPage()
    })
  }
  // 情况搜索条件时显示全部
  changeValSearch = e => {
    let val = e.target.value
    if (val === '') {
      this.setState({
        searchData: {
          ...this.state.searchData,
          className: ''
        }
      },() => {
        this.funQueryMainClassPage()
      })
    }
  }
  // 跳转到编辑学生页面
  toEditorStudent = id => {
    this.props.history.push('/teacher/class/editorStudent?id=' + id)
  }
}

export default TeacherClass