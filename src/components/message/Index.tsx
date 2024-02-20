import { useEffect, useRef } from 'react'
import styles from './index.module.less'
import { useAppSelector, useAppDispatch } from '@/store/hook'
import { closeMessage } from '@/store/globalSlice';
interface Iprops { }
const Message: React.FC<Iprops> = (props) => {
  const { messageShow, message } = useAppSelector(state => state.global);
  const dispatch = useAppDispatch();
  let timer = useRef<NodeJS.Timeout | null>();
  useEffect(() => {
    if (messageShow) {
      timer.current = setTimeout(() => {
        dispatch(closeMessage());
        timer.current && clearTimeout(timer.current)
      }, 3000)
    }
  }, [messageShow])
  return <div className={messageShow ? styles.message : `${styles.message} ${styles.hideMessage}`}>
    {message}
  </div>
}



export default Message