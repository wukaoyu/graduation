import  React  from 'react';
import { Input, Select, Checkbox, Button, Upload } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'

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
    this.state = {
      imageUrl: props.questionData.imgUrl,
      imgLoading: false,
      fileList: [],
      isUpload: false,
      questionData: props.questionData
    }
    console.log(props.questionData)
  }
  
  render() {
    let questionData = this.state.questionData
    return (
      <div>
        <div className='queEditor-list'>
          <div className='queEditor-list-label'>
            题目：
          </div>
          <div className='queEditor-list-content'>
            <Input.TextArea style={{width: '250px'}} 
            autoSize={{ minRows: 2, maxRows: 4 }} 
            defaultValue={questionData.questionJson.questionTitle}
            />
          </div>
        </div>
        <div className='queEditor-list'>
          <div className='queEditor-list-label'>
            图片：
          </div>
          <div className='queEditor-list-content'>
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
          </div>
        </div>
        <div className='queEditor-list'>
          <div className='queEditor-list-label'>
            选项：
          </div>
          <div className='queEditor-list-content'>
            
          </div>
        </div>
        <div className='queEditor-list'>
          <div className='queEditor-list-label'>
            难度：
          </div>
          <div className='queEditor-list-content'>
            <Select style={{width: '150px'}} defaultValue={questionData.difficulty}>
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
            <Checkbox.Group style={{marginTop:'5px'}} defaultValue={questionData.testCheckArray}>
              <Checkbox key={0} value={0}>测试题</Checkbox>
              <Checkbox key={1} value={1}>考试题</Checkbox>
            </Checkbox.Group>
          </div>
        </div>
        <div className='queEditor-list'>
          <div className='queEditor-list-label'></div>
          <div className='queEditor-list-content'>
            <Button type='primary' style={{marginRight:'10px'}}>确定</Button>
            <Button>取消</Button>
          </div>
        </div>
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
          isUpload: true
        })
      }
    );
  }
  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
}

export default SingleElectionEditor