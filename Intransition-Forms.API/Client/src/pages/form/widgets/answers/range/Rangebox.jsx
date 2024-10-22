import InputWrapper from '../../../shared/input-wrapper/InputWrapper';
import TextInput from '../../../shared/text-input/TextInput';

const Rangebox = (params) => {
    return (
        <InputWrapper 
            deleteFunction={params.deleteFunction} 
            setAnswers={params.setAnswers}
            isDraggAvailable={params.isDraggAvailable}
            draggingAnswerIndex={params.draggingAnswerIndex}
            setDraggingAnswerIndex={params.setDraggingAnswerIndex}
            index={params.object ? params.object.index : 0}
        >
            <TextInput 
                placeholder={'Minimum'}
                text={params.object ? params.object.minValue : null} 
                fontSize={16} 
                isDigitsOnly={true}
                fontWeight={500} 
                setText={(text) => {
                    params.ChangeAnswer(prev => {
                        if (text < prev.maxValue) {
                            prev.minValue = text;
                        }
                        return prev;
                    });
                }}
                onClick={params.isNew ? params.createNew : undefined}
            />
            <TextInput 
                placeholder={'Maximum'}
                text={params.object ? params.object.maxValue : null} 
                fontSize={16} 
                fontWeight={500} 
                isDigitsOnly={true}
                setText={(text) => {
                    params.ChangeAnswer(prev => {
                        if (text > prev.minValue) {
                            prev.maxValue = text;
                        }
                        return prev;
                    });
                }}
                onClick={params.isNew ? params.createNew : undefined}
            />
        </InputWrapper>
    );
}

export default Rangebox;