import TextInput from '../../../form/shared/text-input/TextInput';
import styles from './main.module.css';

const TextBoxAnswer = ({answer}) => {
    return (
        <TextInput 
            isMultiple={answer.isMultiple}
            fontSize={16}
            fontWeight={500}
        />
    );
}

export default TextBoxAnswer;