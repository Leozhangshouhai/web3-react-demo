
import { useState, useEffect } from "react";
// import {AxiosResponse  } from 'axios'
import Dialog from "../dialog/Index";
import { message, Input, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import "./index.less"
import axiosInstance from "@/service";
import { getTaskList, submitTask } from '@/service/api'
// import card from "@/assets/card.png"
import chat from "@/assets/chat.png"

const { TextArea } = Input;


const Voucher: React.FC = (props) => {
  const [list, setList] = useState([])
  const [showDialog, setDialog] = useState(false)
  const [files, setFiles] = useState([])
  const [content, setContent] = useState('12')
  const [taskId, setTaskId] = useState('')
  const [disable, setDisable] = useState(false)

  const getTaskListAction = async () => {
    // let res: AxiosResponse<any, any> | null = null; 
    const { code, data = [], message: msg }  = await axiosInstance.get(getTaskList)
    if (code == "0") {
      setList(data)
    } else {
      message.error(msg)
    }
  }

  useEffect(() => {
    getTaskListAction()
  }, [])

  const onClose = () => {
    setDialog(false)
  }

  const showSubmit = (id: string) => {
    setDialog(true)
    setDisable(false)
    setContent('')
    setFiles([])
    setTaskId(id)
  }

  const inputTxt = (e: any) => {
    setContent(e.currentTarget.value)
  }

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined className="add-icon"/>
    </button>
  );

  const handleChange = (data: any) => {
    console.log(data)
    setFiles(data.fileList)
  }

  const onSubmit = async () => {
    if(disable) return
    if(!content) return message.error('请输入内容')
    if(!files.length) return message.error('请上传凭证')
    setDisable(true)
    let formData = new FormData()
    formData.append('content', content);  
    formData.append('taskId', taskId)
    files.forEach(item => {
      formData.append('files', item)
    })
    const { code, message: msg } = await axiosInstance.post(submitTask,formData)
    setDisable(false)
    setContent('')
    if (code === "0") {
      message.success('提交成功')
      setDialog(false)
    }else {
      message.error(msg)
    }
  }

  return <div className="voucher-content">
   { list.length ? <div className="sub-title">提交凭证</div> : null }  
    <div className="voucher-wrap">
      {
        list.map((item: any) => {
          return (
            <div className="card-item" key={item.id}>
              <div className="card-top">
                <div className="card-title">{item.title}</div>
                <div className="show-dialog-btn" onClick={() => showSubmit(item.id)}>提交凭证</div>
              </div>
              <div className="award">
                <div className="award-warp">
                  <span>奖励：</span>
                  <img className="chat-icon" src={chat} alt="" />
                  <span>{item.reward}</span>
                </div>
              </div>
              <div className="card-list">
                {
                  item.imgUrl.map((img:string) => <img key={img} className="card-item" src={img} alt="" />)
                }
              </div>
              <div className="desc">{item.desc}</div>
            </div>
          )
        })
      }
    </div>
    {
      showDialog && <Dialog onClose={onClose} title="提交任务">
        <div className="form-content">

          <TextArea className="form-txt"
            placeholder='请输入您要输入的内容'
            value={content}
            onChange={inputTxt}>
          </TextArea>
          <div className="card-box">
            <div className="card-title">请上传凭证</div>
            <div className="card-list">
              <Upload
                listType="picture-card"
                fileList={files}
                onChange={handleChange}
                accept="image/*"
              >
                {files.length >= 8 ? null : uploadButton}
              </Upload>
            </div>
          </div>

          <div className='submit-btn' onClick={onSubmit}>提交</div>
        </div>
      </Dialog>
    }
  </div>
}

export default Voucher