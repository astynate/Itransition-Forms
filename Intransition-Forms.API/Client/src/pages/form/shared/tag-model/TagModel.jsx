import styles from './main.module.css';
import close from './images/remove.png';

const TagModel = ({text, remove = () => {}}) => {
    return (
        <div className={styles.tag}>
            <span>{text}</span>
            <img src={close} onClick={remove} />
        </div>
    );
}

export default TagModel;