import styles from './main.module.css';
import Form from 'react-bootstrap/Form';

const Select = ({ items = [], value = "", onChange = () => {} }) => {
    return (
        <Form.Select className={styles.select} value={value} onChange={onChange}>
            {items.map((item, index) => (
                <option key={index} value={item}>{item}</option>
            ))}
        </Form.Select>
    );
}

export default Select;