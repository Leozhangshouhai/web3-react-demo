
import { useState, useEffect } from "react";
import Dialog from "../dialog/Index";
import { message, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import "./index.less"
import axiosInstance from "@/service";
import { getTaskList, submitTask } from '@/service/api'
import chat from "@/assets/chat.png"
import addIcon from '@/assets/add-icon.png'
import { useTranslation } from 'react-i18next';
import Img_close from '@/assets/Crop16@2x.png'

const { TextArea } = Input;

interface ApiResponse {  
  code: string;  
  data: Array<any>; // 或者具体的类型，如: ItemType[]  
  message: string;  
}  

const Voucher: React.FC = (props) => {
  const { t } = useTranslation()
  const [list, setList] = useState<any[]>([])
  const [showDialog, setDialog] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [content, setContent] = useState('')
  const [taskId, setTaskId] = useState('')
  const [disable, setDisable] = useState(false)
  const [previewImages, setPreviewImages] = useState<string[]>([])

  const getTaskListAction = async () => {
    const { code, data = [], message: msg }:ApiResponse  = await axiosInstance.get(getTaskList)
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
  
  const handleChange = (event: any) => {
    const filesList: FileList = event.target.files;
    setFiles((prevImages) => [...prevImages, ...filesList]);
    const imagePreviews: string[] = Array.from(filesList).map((file) => URL.createObjectURL(file));
    console.log(imagePreviews)
    setPreviewImages((prevPreviews) => [...prevPreviews, ...imagePreviews]);
  }

  const onSubmit = async () => {
    if(disable) return
    if(!content) return message.error(t('请输入内容'))
    if(!files.length) return message.error(t('请上传凭证'))
    setDisable(true)
    let formData = new FormData()
    formData.append('content', content);  
    formData.append('taskId', taskId)
    files.forEach(item => {
      formData.append('files', item)
    })
    const { code, message: msg }: ApiResponse = await axiosInstance.post(submitTask,formData)
    setDisable(false)
    setContent('')
    if (code === "0") {
      message.success(t('提交成功'))
      setDialog(false)
    }else {
      message.error(t(`${code}`))
    }
  }

  const [previewDialog, setPreviewDialog] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')
  const toPreview = (img:any) => {
    console.log(img)
    setPreviewDialog(true)
    setPreviewUrl(img)
  }

  return <div className="voucher-content">
   { list.length ? <div className="sub-title">{t('提交凭证')}</div> : null }  
    <div className="voucher-wrap">
      {
        list.map((item: any) => {
          return (
            <div className="card-item" key={item.id}>
              <div className="card-top">
                <div className="card-title">{item.title}</div>
                <div className="show-dialog-btn" onClick={() => showSubmit(item.id)}>{t('提交凭证')}</div>
              </div>
              <div className="award">
                <div className="award-warp">
                  <span>{t('奖励')}：</span>
                  <img className="chat-icon" src={chat} alt="" />
                  <span>{item.reward}</span>
                </div>
              </div>
              <div className="card-list">
                {
                  item.imgUrl.map((img:string) => <img key={img} onClick={() => toPreview(img)} className="card-item" src={img} alt="" />)
                }
              </div>
              <div className="desc">{item.desc}</div>
            </div>
          )
        })
      }
    </div>
    {
      showDialog && <Dialog onClose={onClose} title={t('提交任务')}>
        <div className="form-content">

          <TextArea className="form-txt"
            placeholder={t('请输入您要输入的内容')}
            value={content}
            onChange={inputTxt}>
          </TextArea>
          <div className="card-box">
            <div className="card-title">{t('请上传凭证')}</div>
            <div className="card-list">
              {previewImages.map((preview, index) => (
                <img className="preview-img"  key={index} src={preview} alt={`Preview ${index + 1}`} />
              ))}
              <label className="select-label" htmlFor="imageInput">
                <img className="add-icon" src={addIcon} alt="" />
              </label>
              <input  id='imageInput' type="file" multiple onChange={handleChange} />
            </div>
          </div>
          
          <div className='submit-btn' onClick={onSubmit}>{t('提交')}</div>
        </div>
      </Dialog>
    }

    {
      previewDialog ? <div className="preview-dialog">
        <img className="preview-close" onClick={() => setPreviewDialog(false)} src={Img_close} alt="" />
        <img className="preview-img" src={previewUrl} alt="" />
      </div> : null
    }
  </div>
}

export default Voucher