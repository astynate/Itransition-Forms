import styles from './main.module.css';
import Form from 'react-bootstrap/Form';

const Select = ({items = [], value = "", onChange = () => {}}) => {
    return (
        <Form.Select size="lg" className={styles.select} value={value} onChange={onChange}>
            {items.map((item, index) => {
                return (
                    <option key={index} value={item}>{item}</option>
                );
            })}
        </Form.Select>
    )
}

export default Select;