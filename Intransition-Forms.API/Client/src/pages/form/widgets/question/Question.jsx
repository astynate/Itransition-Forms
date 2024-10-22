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
import Guid from '../../../../utils/Guid';

const Question = ({
        question, 
        setForm = () => {}, 
        onDragStart = () => {}, 
        onDrop = () => {},
        isDraggingQuestion,
        setDraggingQuestionState
    }) => {

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

    const GetItemIndex = (objects) => {
        if (objects.length > 0) {
            const handlers = [
                objects[0].title !== undefined, 
                objects[0].maxValue !== undefined,
                objects[0].isMultiple === false,
                objects[0].isMultiple === true,
            ];

            const index = handlers
                .findIndex(e => e === true);

            return index === -1 ? 0 : index;
        }

        return 0;
    }

    const [answers, setAnswers] = useState([]);
    const [isDragOver, setDragOverState] = useState(false);
    const [isDragAvailable, setDragAvailableState] = useState(false);
    const [draggingAnswerIndex, setDraggingAnswerIndex] = useState(0);
    const [currentHandler, setCurrentHandler] = useState(items[GetItemIndex(question.answers)]);

    const GetAnswerHandler = (object) => {
        if (!object) return Textbox;

        const handlers = [
            [object.title !== undefined, Checkbox], 
            [object.maxValue !== undefined, Rangebox]
        ];

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

        setAnswers(question.answers
            .sort((a, b) => a.index - b.index)
            .map((answer, index) => {
                const Handler = GetAnswerHandler(answer);

                const ChangeAnswer = (func = () => {}) => {
                    SetAnswers(prev => {
                        if (answer && prev && prev.map) {
                            prev = prev.map(element => {
                                if (element.id === answer.id) {
                                    element = func(element);
                                }
                                return element;
                            })
                        }
            
                        return prev;
                    });
                }
                
                return (
                    <Handler 
                        object={answer}
                        key={answer.id}
                        setAnswers={SetAnswers}
                        ChangeAnswer={ChangeAnswer}
                        draggingAnswerIndex={draggingAnswerIndex}
                        setDraggingAnswerIndex={setDraggingAnswerIndex}
                        deleteFunction={() => {
                            SetAnswers(prev => {
                                if (prev.length && prev.length > 1) {
                                    return prev
                                        .filter(x => x.index !== index)
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
        <Block 
            onDragStart={(event) => {
                if (isDragAvailable) {
                    onDragStart(event, question.index);
                }
            }} 
            isDragOver={isDragOver}
            isDragAvailable={isDragAvailable}
        >
            <div 
                className={styles.question}
                onDrop={(event) => {
                    onDrop(event, question.index);
                    setDragOverState(false);
                    setDraggingQuestionState(false);
                }}
                onDragOver={(event) => {
                    setDragOverState(isDraggingQuestion);
                    
                    event.stopPropagation();
                    event.preventDefault();
                }}
                onDragLeave={() => {
                    setDragOverState(false);
                }}
                onDragEnd={() => {
                    setDragOverState(false);
                    setDraggingQuestionState(false);
                }}
            >
                <div 
                    className={styles.top}
                    onMouseEnter={() => setDragAvailableState(true)}
                    onMouseLeave={() => setDragAvailableState(false)}
                >
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
                        setText={(text) => {
                            SetQuestions(prev => {
                                prev = prev.map(element => {
                                    if (element.id === question.id) {
                                        element.question = text;
                                    }

                                    return element;
                                });
                                return prev;
                            });
                        }}  
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
                            isDraggAvailable: false,
                            createNew: () => {
                                setForm(prev => {
                                    const updatedQuestions = prev.questions.map(element => {
                                        if (element.id === question.id) {
                                            let handler = {...itemHandlers[currentHandler]};

                                            handler.id = Guid.NewGuid();
                                            handler.index = answers.length;
                                            handler.questionModelId = question.id;

                                            return {
                                                ...element, 
                                                answers: [...element.answers, handler]
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
                    <div className={styles.selectWrapper}>
                        <Select
                            items={items}
                            value={currentHandler}
                            onChange={(event) => {  
                                setForm(prev => {
                                    const updatedQuestions = prev.questions.map(element => {
                                        if (element.id === question.id) {
                                            return { ...element, answers: [{
                                                ...itemHandlers[event.target.value],
                                                id: Guid.NewGuid(),
                                                questionModelId: question.id
                                            }] };
                                        }
                                        return element;
                                    });
                                
                                    return { ...prev, questions: updatedQuestions };
                                });

                                setCurrentHandler(event.target.value);
                            }}
                        />
                    </div>
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