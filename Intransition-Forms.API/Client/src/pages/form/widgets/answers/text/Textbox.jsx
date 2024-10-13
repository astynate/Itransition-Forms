import InputWrapper from '../../../shared/input-wrapper/InputWrapper';
import styles from './main.module.css';

const Textbox = (params) => {
    return (
        <InputWrapper 
            deleteFunction={params.deleteFunction} 
            setAnswers={params.setAnswers}
            isDraggAvailable={params.isDraggAvailable}
            draggingAnswerIndex={params.draggingAnswerIndex}
            setDraggingAnswerIndex={params.setDraggingAnswerIndex}
            index={params.object ? params.object.index : 0}
        >
            <div 
                className={styles.placeholder} 
                type={params.object && params.object.isMultiple ? 'multiline' : null}
                onClick={params.createNew ? params.createNew : () => {}}
            >
                {params.isNew ? <span>Create</span> : null}
            </div>
        </InputWrapper>
    );
}

export default Textbox;