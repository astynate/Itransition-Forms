import InputWrapper from '../../../shared/input-wrapper/InputWrapper';
import styles from './main.module.css';

const Textbox = ({object, isNew, createNew, deleteFunction = () => {}}) => {
    return (
        <InputWrapper deleteFunction={deleteFunction}>
            <div 
                className={styles.placeholder} 
                type={object && object.isMultiple ? 'multiline' : null}
                onClick={createNew ? createNew : () => {}}
            >
                {isNew ? <span>Create</span> : null}
            </div>
        </InputWrapper>
    );
}

export default Textbox;