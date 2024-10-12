import React, { useEffect, useState } from 'react';
import Block from '../../features/block/Block';
import Select from '../../shared/select/Select';
import TextInput from '../../shared/text-input/TextInput';
import Checkbox from '../answers/checkbox/Checkbox';
import Rangebox from '../answers/range/Rangebox';
import Textbox from '../answers/text/Textbox';
import styles from './main.module.css';
import trash from './trash.png';
import AnswersAPI from '../../api/AnswersAPI';

const Question = ({question, setForm = () => {}}) => {
    const items = [
        'Checkbox', 
        'Range', 
        'String', 
        'Text'
    ];

    const itemHandlers = {
        'Checkbox': AnswersAPI.CheckboxDefaultValue,
        'Range': AnswersAPI.RangeboxDefaultValue,
        'String': AnswersAPI.StringDefaultValue,
        'Text': AnswersAPI.TextDefaultValue
    };

    const [answers, setAnswers] = useState([]);
    const [currentHandler, setCurrentHandler] = useState(items[0]);

    const GetAnswerHandler = (object) => {
        if (!object) return Textbox;

        const handlers = [[!!object.title, Checkbox], [!!object.maxValue, Rangebox]];
        const element = handlers.find(e => e[0] === true);

        return element ? element[1] : Textbox;
    }

    const SetQuestions = (func = () => {}) => {
        setForm(prev => {
            let updatedQuestions = func(prev.questions);
            let result = [];

            if (updatedQuestions) {
                result = [...updatedQuestions];
            }

            return {...prev, questions: result};
        });
    }

    const SetAnswers = (func = () => {}) => {
        SetQuestions(prev => {
            let object = prev.find(e => e.id === question.id);

            if (object && object.answers) {
                const result = func(object.answers);
                object.answers = result ?  [...result] : [];
            }

            return [...prev];
        });
    }

    useEffect(() => {
        if (!question) return;

        setAnswers(question.answers.map((answer, index) => {
            const Handler = GetAnswerHandler(answer);

            return (
                <Handler 
                    object={answer}
                    key={JSON.stringify(answer)}
                    setAnswers={SetAnswers}
                    deleteFunction={() => {
                        SetAnswers(prev => {
                            if (prev.length && prev.length > 1) {
                                return prev
                                    .filter(x => {
                                        return x.index !== index;
                                    })
                                    .sort((a, b) => a.index - b.index)
                                    .map((answer, i) => ({
                                        ...answer,
                                        index: i
                                    }));
                            }

                            return prev;
                        });
                    }}
                />
            );
        }));
    }, [question, question.answers, question.answers.length]);

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
                        React.cloneElement((answers[answers.length - 1]), { 
                            object: undefined, 
                            isNew: true,
                            createNew: () => {
                                setForm(prev => {
                                    const updatedQuestions = prev.questions.map(element => {
                                        if (element.id === question.id) {
                                            let handler = {...itemHandlers[currentHandler]};

                                            handler.id = answers.length;
                                            handler.index = answers.length;

                                            return {
                                                ...element, 
                                                answers: [...element.answers, {...handler}]
                                            };
                                        }

                                        return element;
                                    });

                                    return { ...prev, questions: updatedQuestions };
                                });
                            }
                        })}
                </div>
                <div className={styles.bottom}>
                    <Select
                        items={items}
                        value={currentHandler}
                        onChange={(event) => {  
                            setForm(prev => {
                                const updatedQuestions = prev.questions.map(element => {
                                    if (element.id === question.id) {
                                        return { ...element, answers: [itemHandlers[event.target.value]] };
                                    }
                                    return element;
                                });
                            
                                return { ...prev, questions: updatedQuestions };
                            });

                            setCurrentHandler(event.target.value);
                        }}
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