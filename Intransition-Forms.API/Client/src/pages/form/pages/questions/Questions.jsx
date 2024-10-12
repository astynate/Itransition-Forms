import AnswersAPI from '../../api/AnswersAPI';
import Question from '../../widgets/question/Question';
import Title from '../../widgets/title/Title';
import styles from './main.module.css';

const Questions = ({form, setForm}) => {
    if (!form || !setForm) return;

    const AddQuestion = () => {
        if (setForm) {
            setForm(prev => {
                const DefaultQuestion = {
                    id: prev.questions.length,
                    index: prev.questions.length,
                    question: "Question",
                    answers: [{...AnswersAPI.CheckboxDefaultValue}]
                };

                return {...prev, questions: [...prev.questions, DefaultQuestion]};
            });
        }
    }

    return (
        <div className={styles.questions}>
            <Title 
                form={form}
                setForm={setForm}
            />
            {form.questions && form.questions.sort && form.questions
                .sort((a, b) => a.index - b.index)
                .map((question, index) => {
                    return (
                        <Question 
                            key={index}
                            question={question}
                            setForm={setForm}
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