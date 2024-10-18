import TextInput from '../../../form/shared/text-input/TextInput';

const TextBoxAnswer = ({answer, answerValue = {}, setAnswer = () => {}, isEditable = true}) => {
    return (
        <TextInput 
            isMultiple={answer.isMultiple}
            fontSize={16}
            fontWeight={500}
            isEditable={isEditable}
            text={answerValue.value ? answerValue.value : answer.defaultValue}
            placeholder={answer.isMultiple ? 'Enter your text here' : 'Enter your string here'}
            setText={(text) => {
                if (isEditable === true) {
                    setAnswer(text);
                }
            }}
        />
    );
}

export default TextBoxAnswer;