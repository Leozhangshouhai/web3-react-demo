import styles from './index.module.less';

// assets images import
import Img_close from '@/assets/close.png'
interface Iprops {
  title: string,
  children: any,
  onClose: Function
}

const Dialog: React.FC<Iprops> = (props) => {

  return <div className={styles.dialog}>
    <div className={styles.content}>
      <div className={styles.header}>
        <div className={styles.title}>{props.title}</div>
        <img draggable='false' className={styles.close} src={Img_close} onClick={() => { props.onClose ? props.onClose() : null }} alt="" />
      </div>
      <div className={styles.body}>
        {props.children}
      </div>
    </div>
  </div>
}

export default Dialog
