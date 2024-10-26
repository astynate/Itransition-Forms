import { useState } from 'react';
import Guid from '../../../../utils/Guid';
import AnswersAPI from '../../api/AnswersAPI';
import Question from '../../widgets/question/Question';
import Title from '../../widgets/title/Title';
import styles from './main.module.css';
import AccessManager from '../../widgets/access/AccessManager';
import Tags from '../../widgets/tags/Tags';

const Questions = ({form, setForm}) => {
    const [draggedQuestionIndex, setDraggedQuestionIndex] = useState(0);
    const [isDraggingQuestion, setDraggingQuestionState] = useState(false);

    if (!form || !setForm) return;

    const AddQuestion = () => {
        if (setForm) {
            setForm(prev => {
                const newId = Guid.NewGuid();

                const DefaultQuestion = {
                    id: newId,
                    index: prev.questions.length,
                    question: "Question",
                    formModelId: form.id,
                    answers: [{
                        ...AnswersAPI.CheckboxDefaultValue,
                        id: Guid.NewGuid(),
                        questionModelId: newId
                    }]
                };

                return {...prev, questions: [...prev.questions, DefaultQuestion]};
            });
        }
    }

    const onDragStart = (_, question) => {
        setDraggingQuestionState(true);
        setDraggedQuestionIndex(question);
    }

    const onDrop = (event, question) => {
        event.preventDefault();

        setForm(prev => {
            if (prev.questions && prev.questions.map) {
                prev.questions =  prev.questions.map(q => {
                    if (q.index === draggedQuestionIndex)
                        q.index = question;

                    else if (q.index === question)
                        q.index = draggedQuestionIndex;
                    
                    return q;
                })
            }

            return {...prev};
        });
    }

    return (
        <div className={styles.questions}>
            <Title 
                form={form}
                setForm={setForm}
            />
            <Tags 
                form={form}
                setForm={setForm}
            />
            <AccessManager 
                form={form}
                setForm={setForm}
            />
            {form.questions && form.questions.sort && form.questions
                .sort((a, b) => a.index - b.index)
                .map(question => {
                    return (
                        <Question 
                            key={question.id}
                            draggable={true}
                            onDragStart={onDragStart}
                            onDrop={onDrop}
                            question={question}
                            setForm={setForm}
                            isDraggingQuestion={isDraggingQuestion}
                            setDraggingQuestionState={setDraggingQuestionState}
                        />
                    );
            })}
            <button 
                className={styles.create}
                onClick={() => AddQuestion()}
            >
                +
            </button>
        </div>
    );
}

export default Questions;