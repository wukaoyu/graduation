import  React  from 'react';
import { Input, Select, Checkbox, Button, Upload, message } from 'antd'
import { LoadingOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import ScrollView from 'react-custom-scrollbars'

const { Option } = Select;

class SingleElectionEditor extends React.Component {
  constructor(props) {
    super(props)
    switch (props.questionData.isTest) {
      case 0:
        props.questionData.testCheckArray = [0]
        break;
      case 1:
        props.questionData.testCheckArray = [1]
        break;
      case 2:
        props.questionData.testCheckArray = [0, 1]
        break;
      default:
        break;
    }
    let propsQuestionData = {}
    if (props.questionData.id) {
      props.questionData.answerJson.forEach((item, index) => {
        item.key = index
      })
      propsQuestionData = props.questionData
    }else {
      propsQuestionData = {
        questionJson: {
          questionTitle: ''
        },
        imgUrl: '',
        difficulty: 0,
        testCheckArray: [0],
        answerJson: [
          {answer: '', key: 0},
          {answer: '', key: 1},
          {answer: '', key: 2},
          {answer: '', key: 3}
        ],
        answerTrue: [0]
      }
    }
    this.state = {
      imageUrl: propsQuestionData.imgUrl,
      imgLoading: false,
      fileList: [],
      isUpload: false,
      questionData: propsQuestionData,
      addOrEditorData: {
        type: 2,
        difficulty: propsQuestionData.difficulty,
        imgUrl: '',
        isTest: propsQuestionData.isTest || 0,
        questionTitle: propsQuestionData.questionTitle
      }
    }
  }
  
  render() {
    let questionData = this.state.questionData
    return (
      <div>
        <ScrollView style={{height:'550px'}}>
          <div className='queEditor-list'>
            <div className='queEditor-list-label'>
              题目：
            </div>
            <div className='queEditor-list-content'>
              <Input.TextArea style={{width: '250px'}} 
              autoSize={{ minRows: 2, maxRows: 4 }} 
              defaultValue={questionData.questionJson.questionTitle}
              onBlur={e => this.changeTitle(e)}
              />
            </div>
          </div>
          <div className='queEditor-list'>
            <div className='queEditor-list-label'>
              图片：
            </div>
            <div className='queEditor-list-content queEditor-list-upload'>
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                fileList={this.state.fileList}
                beforeUpload={() => this.getFile()}
                accept='.jpg,.jpeg,.png'
                onChange={(info) => this.handleChange(info)}
              >
                {
                  this.state.imageUrl ? 
                  <img src={this.state.imageUrl} alt="avatar" style={{ width: '100%' }} /> : 
                  <div>
                    {this.state.imgLoading ? <LoadingOutlined /> : <PlusOutlined />}
                    <div className="ant-upload-text">Upload</div>
                  </div>
                }
              </Upload>
              {
                this.state.imageUrl ?  <DeleteOutlined  style={{color: '#f00'}} onClick={() => this.removeImage()}/> : ''
              }
            </div>
          </div>
          <div className='queEditor-list'>
            <div className='queEditor-list-label'>
              选项：
            </div>
            <div className='queEditor-list-content'>
              <Checkbox.Group defaultValue={questionData.answerTrue} onChange={val => this.changeAnswertrue(val)}>
                {
                  questionData.answerJson.map((item, index) => {
                    return (
                      <Checkbox key={item.key} value={index} className='queEditor-list-content-radio' >
                        <div className='queEditor-list-content-answer'>
                          <div className='queEditor-list-content-answer-option'>
                            {String.fromCharCode(index + 65)}、
                          </div>
                          <Input defaultValue={item.answer} style={{width: '200px', marginRight:'10px'}} onBlur={e => this.changeOptionVal(index, e)}/>
                          {
                            questionData.answerJson.length > 1 ? 
                            <Button size='small' type='danger' onClick={() => this.removeAnswerOption(index)}>删除</Button> : ''
                          }
                        </div>
                      </Checkbox>
                    )
                  })
                }
              </Checkbox.Group>
              {
                questionData.answerJson.length < 26 ?
                <Button size='small' type='primary' style={{marginLeft:'48px'}} onClick={() => this.addAnswerOption()}>添加选项</Button>
                : ''
              }
            </div>
          </div>
          <div className='queEditor-list'>
            <div className='queEditor-list-label'>
              难度：
            </div>
            <div className='queEditor-list-content'>
              <Select style={{width: '150px'}} defaultValue={questionData.difficulty} onChange={(val) => this.changeQuestionDiff(val)}>
                <Option key={0} value={0}>简单</Option>
                <Option key={1} value={1}>一般</Option>
                <Option key={2} value={2}>困难</Option>
                <Option key={3} value={3}>非常困难</Option>
              </Select>
            </div>
          </div>
          <div className='queEditor-list'>
            <div className='queEditor-list-label'>
              题目出现在：
            </div>
            <div className='queEditor-list-content'>
              <Checkbox.Group style={{marginTop:'5px'}} defaultValue={questionData.testCheckArray} onChange={val => this.changeIsTest(val)}>
                <Checkbox key={0} value={0}>测试题</Checkbox>
                <Checkbox key={1} value={1}>考试题</Checkbox>
              </Checkbox.Group>
            </div>
          </div>
          <div className='queEditor-list'>
            <div className='queEditor-list-label'></div>
            <div className='queEditor-list-content'>
              <Button type='primary' style={{marginRight:'10px'}} onClick={() => this.addOrEditorQuestion()}>确定</Button>
              <Button onClick={() => this.closeEditorModel()}>取消</Button>
            </div>
          </div>
        </ScrollView>
      </div>
    )
  }
  /**
   * 文件赋值
   */
  getFile = (file) => {
    this.setState({
      imgLoading: true
    })
    return false
  }
  handleChange = info => {
    this.getBase64(info.file, imageUrl => {
        this.setState({
          imageUrl,
          imgLoading: false,
          fileList: [info.file],
          isUpload: true,
          addOrEditorData: {
            ...this.state.addOrEditorData,
            imgUrl: imageUrl
          }
        })
      }
    );
  }
  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  // 添加选项
  addAnswerOption = () => {
    let newArray =  JSON.parse(JSON.stringify(this.state.questionData.answerJson))
    newArray.push({
      answer: '', 
      key: newArray[newArray.length - 1].key + 1
    })
    this.setState({
      questionData: {
        ...this.state.questionData,
        answerJson: newArray
      }
    })
  }
  /**
   * 删除选项
   * @param {Number} index 删除选项的索引
   */
  removeAnswerOption = (index) => {
    let newArray =  JSON.parse(JSON.stringify(this.state.questionData.answerJson))
    let newAnswertrue = this.state.questionData.answerTrue
    newAnswertrue.forEach((item, itemIndex) => {
      if (item === index) {    
        newAnswertrue.splice(itemIndex,1) 
      }
    })
    newArray.splice(index,1) 
    this.setState({
      questionData: {
        ...this.state.questionData,
        answerJson: newArray
      }
    })
  }
  closeEditorModel = () => {
    this.props.closeEditorModel()
  }
  // 选项赋值
  changeOptionVal = (index, e) => {
    let newAnswerJson = this.state.questionData.answerJson
    newAnswerJson[index].answer = e.target.value.replace(/"/g,`&quot;`)
    this.setState({
      questionData: {
        ...this.state.questionData,
        answerJson: newAnswerJson
      }
    })
  }
  // 改变正确选项
  changeAnswertrue = val => {
    this.setState({
      questionData: {
        ...this.state.questionData,
        answerTrue: val
      }
    })
  }
  // 标题赋值
  changeTitle = e => {
    let newQuestionData = JSON.parse(JSON.stringify(this.state.addOrEditorData))
    newQuestionData.questionTitle = e.target.value.replace(/"/g,`&quot;`)
    newQuestionData.questionJson = {
      questionTitle: e.target.value.replace(/"/g,`&quot;`)
    }
    this.setState({
      addOrEditorData: newQuestionData
    })
  }
  // 改变难度
  changeQuestionDiff = val => {
    this.setState({
      addOrEditorData: {
        ...this.state.addOrEditorData,
        difficulty: val
      }
    })
  }
  // 该变题目会出现的地方
  changeIsTest = val => {
    let isTest = ''
    if (val[1] > -1) {
      isTest = 2
    }else if (val[0] > -1){
      isTest = val[0]
    }
    this.setState({
      addOrEditorData: {
        ...this.state.addOrEditorData,
        isTest
      }
    })
  }
  // 删除图片
  removeImage = () => {
    this.setState({
      imageUrl: null,
      fileList: [],
      addOrEditorData: {
        ...this.state.addOrEditorData,
        imgUrl: null
      }
    })
  }
  // 增加或修改题目
  addOrEditorQuestion = () => {
    let newQuestionData = JSON.parse(JSON.stringify(this.state.addOrEditorData))
    if (this.state.questionData.id) {
      newQuestionData.id = this.state.questionData.id
    }
    newQuestionData.answerJson = JSON.parse(JSON.stringify(this.state.questionData.answerJson))
    newQuestionData.answerTrue = JSON.parse(JSON.stringify(this.state.questionData.answerTrue)).sort((a, b) => {
      return a-b
    })
    // console.log(newQuestionData)
    if (!newQuestionData.questionTitle){
      message.error('题目不能为空')
    }else if (newQuestionData.isTest === ''){
      message.error('请选择题目出现处')
    }else if (newQuestionData.answerTrue.length === 0) {
      message.error('请选择题目正确答案')
    }else {
      this.props.addOrEditorQuestion(newQuestionData)
    }
  }
}

export default SingleElectionEditor