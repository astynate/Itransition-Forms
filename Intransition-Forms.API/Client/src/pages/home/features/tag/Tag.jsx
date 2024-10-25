import styles from './main.module.css';

const Tag = ({callback = () => {}, isActive = false, name = "tag"}) => {
    return (
        <div 
            className={styles.tag} 
            onClick={callback}
            state={isActive ? 'active' : null}
        >
            {name}
        </div>
    )
}

export default Tag;