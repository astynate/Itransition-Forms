import Block from '../../../form/features/block/Block';
import CheckboxAnswer from '../../features/checkbox/CheckboxAnswer';
import RangeAnswer from '../../features/range/RangeAnswer';
import TextBoxAnswer from '../../features/textbox/TextBoxAnswer';
import styles from './main.module.css';

const Question = ({question, answers, setAnswers = () => {}, isEditable = true}) => {
    return (
        <Block>
            <div className={styles.question}>
                <h2>{question.question}</h2>
                <div className={styles.answers}>
                    {question.answers.sort((a, b) => a.index - b.index).map(answer => {
                        const handlers = [
                            [answer.title !== undefined, CheckboxAnswer],
                            [answer.maxValue !== undefined, RangeAnswer]
                        ];

                        const target = handlers.find(e => e[0] === true);
                        const Handler = target ? target[1] : TextBoxAnswer;
                        
                        const answerValueId = answers[answer.id] ? answers[answer.id].id : null;

                        return (<Handler 
                            key={answer.id + answerValueId ?? ""} 
                            answer={answer} 
                            isEditable={isEditable}
                            answerValue={answers[answer.id]}
                            setAnswer={(value) => {
                                setAnswers((prev) => {
                                    prev[answer.id].value = value;
                                    return {...prev};
                                });
                            }}
                        />);
                    })}
                </div>
            </div>
    </Block>
    );
}

export default Question;