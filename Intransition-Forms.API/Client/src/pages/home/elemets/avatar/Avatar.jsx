import styles from './main.module.css';

const Avatar = ({name, color = 0, size='37px', font='24px'}) => {
    return (
        <div 
            className={styles.avatar} 
            color={`color-${color}`}
            style={{'--size': size, '--font': font}}
        >
            {(name ?? "?")[0].toUpperCase()}
        </div>
    );
}

export default Avatar;