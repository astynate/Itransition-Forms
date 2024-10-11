import FormWrapper from '../../shared/form-wrapper/FormWrapper';
import styles from './main.module.css';

const Block = ({children}) => {
    return (
        <FormWrapper>
            <div className={styles.block}>
                {children}
            </div>
        </FormWrapper>
    );
}

export default Block;