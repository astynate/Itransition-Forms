import TextInput from '../../../form/shared/text-input/TextInput';
import styles from './main.module.css';

const TextBoxAnswer = ({answer, answerValue = {}, setAnswer = () => {}}) => {
    return (
        <TextInput 
            isMultiple={answer.isMultiple}
            fontSize={16}
            fontWeight={500}
            text={answerValue.value ? answerValue.value : answer.defaultValue}
            placeholder={answer.isMultiple ? 'Enter your text here' : 'Enter your string here'}
            setText={(text) => setAnswer(text)}
        />
    );
}

export default TextBoxAnswer;