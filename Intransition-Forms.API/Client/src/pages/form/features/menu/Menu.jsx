import styles from './main.module.css';

const Menu = ({items = [], currentItem}) => {
    return (
        <div className={styles.menu}>
            {items.map((item, index) => {
                return (
                    <button 
                        key={index} 
                        className={styles.item} 
                        onClick={() => item.callback ? item.callback() : null}
                        state={currentItem === index ? 'selected' : null}
                    >
                        <span>{item.title}</span>
                    </button>
                );
            })}
        </div>
    );
}

export default Menu;