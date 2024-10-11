import InputWrapper from '../../../shared/input-wrapper/InputWrapper';
import TextInput from '../../../shared/text-input/TextInput';
import styles from './main.module.css';

const Checkbox = ({isNew = false}) => {
    return (
        <InputWrapper>
            <div className={styles.checkbox} state={isNew ? 'new' : null}>
                <input type="checkbox" />
                <TextInput 
                    text={"Value"} 
                    fontSize={16} 
                    fontWeight={400} 
                />
            </div>
        </InputWrapper>
    );
}

export default Checkbox;