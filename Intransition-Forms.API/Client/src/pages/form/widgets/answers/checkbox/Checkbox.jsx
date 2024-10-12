import InputWrapper from '../../../shared/input-wrapper/InputWrapper';
import TextInput from '../../../shared/text-input/TextInput';
import styles from './main.module.css';

const Checkbox = ({
        isNew = false, 
        object = {},
        createNew = () => {}, 
        deleteFunction = () => {}, 
        setAnswers = () => {}
    }) => {

    return (
        <InputWrapper deleteFunction={deleteFunction}>
            <div className={styles.checkbox} state={isNew ? 'new' : null}>
                <input type="checkbox" />
                <TextInput 
                    text={object ? object.title : null} 
                    placeholder={"Create"}
                    fontSize={16} 
                    fontWeight={400} 
                    setText={(text) => {
                        setAnswers(prev => {
                            if (object && prev && prev.map) {
                                prev = prev.map(answer => {
                                    if (answer.id === object.id) {
                                        answer.title = text;
                                    }
                                    return answer;
                                })
                            }

                            return prev;
                        });
                    }}
                    onClick={isNew ? createNew : () => {}}
                />
            </div>
        </InputWrapper>
    );
}

export default Checkbox;