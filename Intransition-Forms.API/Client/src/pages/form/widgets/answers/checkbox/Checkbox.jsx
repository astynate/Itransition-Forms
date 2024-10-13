import InputWrapper from '../../../shared/input-wrapper/InputWrapper';
import TextInput from '../../../shared/text-input/TextInput';
import styles from './main.module.css';

const Checkbox = (params) => {
    return (
        <InputWrapper 
            deleteFunction={params.deleteFunction} 
            isDraggAvailable={params.isDraggAvailable}
            setAnswers={params.setAnswers}
            draggingAnswerIndex={params.draggingAnswerIndex}
            setDraggingAnswerIndex={params.setDraggingAnswerIndex}
            index={params.object ? params.object.index : 0}
        >
            <div className={styles.checkbox} state={params.isNew ? 'new' : null}>
                <input 
                    type="checkbox" 
                    onChange={(event) => {
                        params.ChangeAnswer(prev => {
                            prev.defaultValue = event.target.value;
                            return prev;
                        });
                    }}
                />
                <TextInput 
                    text={params.object ? params.object.title : null} 
                    placeholder={"Create"}
                    fontSize={16} 
                    fontWeight={400} 
                    setText={(text) => {
                        params.ChangeAnswer(prev => {
                            prev.title = text;
                            return {...prev};
                        });
                    }}
                    onClick={params.isNew ? params.createNew : () => {}}
                />
            </div>
        </InputWrapper>
    );
}

export default Checkbox;