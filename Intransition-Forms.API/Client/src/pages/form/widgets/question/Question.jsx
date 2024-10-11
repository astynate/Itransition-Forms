import React, { useEffect, useState } from 'react';
import Block from '../../features/block/Block';
import Select from '../../shared/select/Select';
import TextInput from '../../shared/text-input/TextInput';
import Checkbox from '../answers/checkbox/Checkbox';
import Rangebox from '../answers/range/Rangebox';
import Textbox from '../answers/text/Textbox';
import styles from './main.module.css';
import trash from './trash.png';

const Question = ({question, setForm = () => {}}) => {
    const items = [
        'Checkbox', 
        'Range', 
        'String', 
        'Text'
    ];

    const [answers, setAnswers] = useState([]);
    const [answerType, setAnswerType] = useState(items[0]);

    const GetAnswerHandler = (object) => {
        const handlers = [[!!object.title, Checkbox], [!!object.maxLength, Rangebox]];
        const element = handlers.find(e => e[0] === true);

        return element ? element[1] : Textbox;
    }

    useEffect(() => {
        if (!question) return;

        setAnswers(question.answers.map((answer, index) => {
            const Handler = GetAnswerHandler(answer);

            return (
                <Handler 
                    key={index} 
                    object={answer}
                />
            );
        }));
    }, [question]);

    if (!question) return null;

    return (
        <Block>
            <div className={styles.question}>
                <div className={styles.top}>
                    <div className={styles.drag}>
                        {Array.from({ length: 6 }).map((_, index) => {
                            return (
                                <div 
                                    key={index}
                                    className={styles.point}
                                ></div>
                            );
                        })}
                    </div>
                </div>
                <div className={styles.header}>
                    <TextInput
                        isTitle={false}
                        text={question.question}
                        maxLength={50}
                        fontSize={18}
                        fontWeight={700}
                    />
                </div>
                <div className={styles.content}>
                    {answers}
                    {answers.length < 4 && answers.length > 0 && 
                        React.cloneElement((answers[answers.length - 1]), { isNew: true })}
                </div>
                <div className={styles.bottom}>
                    <Select
                        items={items}
                        onChange={setAnswerType}
                    />
                    <button 
                        className={styles.button}
                        onClick={() => {
                            setForm(prev => {
                                const questions = prev.questions.
                                    filter(q => q.id !== question.id);

                                return { ...prev, questions: questions };
                            })
                        }}
                    >
                        <img src={trash} />
                    </button>
                </div>
            </div>
        </Block>
    );
}

export default Question;