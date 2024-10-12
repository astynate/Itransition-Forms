import InputWrapper from '../../../shared/input-wrapper/InputWrapper';
import TextInput from '../../../shared/text-input/TextInput';
import styles from './main.module.css';

const Rangebox = ({object, isNew = false, createNew = () => {}, deleteFunction = () => {}}) => {
    return (
        <InputWrapper deleteFunction={deleteFunction}>
            <TextInput 
                placeholder={'Minimum'}
                text={object ? object.minValue : null} 
                fontSize={16} 
                fontWeight={500} 
                onClick={isNew ? createNew : undefined}
            />
            <TextInput 
                placeholder={'Maximum'}
                text={object ? object.maxValue : null} 
                fontSize={16} 
                fontWeight={500} 
                onClick={isNew ? createNew : undefined}
            />
        </InputWrapper>
    );
}

export default Rangebox;