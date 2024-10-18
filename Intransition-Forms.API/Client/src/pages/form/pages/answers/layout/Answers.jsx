import { useEffect, useState } from 'react';
import { instance } from '../../../../../state/Interceptors';
import Title from '../widgets/title/Title';
import styles from './main.module.css';
import Question from '../../../../filling/widgets/question/Question';

const Answers = ({form, setForm, setLoadingState = () => {}}) => {
    const [fillingOuts, setFillingOuts] = useState([]);
    const [isHasMore, setHasMoreState] = useState(true);
    const [current, setCurrent] = useState(0);
    const [fillingOut, setFillingOut] = useState(undefined);
    const [answers, setAnswers] = useState({});

    useEffect(() => {
        if (fillingOuts.length > 0 && current === 0) {
            setCurrent(1);
        }

        const offestedCurrent = Math.min(Math.max(current - 1, 0), fillingOuts.length - 1);
        const isAvailable = fillingOuts.length > 0;

        if (isAvailable === true) {
            let answersValue = {};

            for (let i = 0; i < fillingOuts[offestedCurrent].answers.length; i++) {
                const target = fillingOuts[offestedCurrent].answers[i];
                answersValue[target.answerId] = target;
            }

            setFillingOut(fillingOuts[offestedCurrent]);
            setAnswers(answersValue);

            return;
        }

        setFillingOut(undefined);
        setAnswers({});
    }, [fillingOuts, current]);

    const GetFillingOuts = async () => {
        await instance
            .get(`/api/fillings?id=${form.id}&from=${fillingOuts.length}`)
            .then(response => {
                if (response.data) {
                    setHasMoreState(response.data.length >= 5)
                    setFillingOuts(prev => [...prev, ...response.data]);
                }
            })
            .catch(error => {
                alert("Something went wrong");
                console.log(error);
            });
    }

    useEffect(() => {
        if (!!form === true && isHasMore === true) {
            GetFillingOuts();
        }
    }, [form, fillingOuts]);

    if (!form || !setForm) return null;

    return (
        <div className={styles.wrapper}>
            <Title 
                form={form} 
                fillingOuts={fillingOuts} 
                current={current}
                setCurrent={setCurrent}
                fillingOut={fillingOut}
            />
            {fillingOut && form.questions.map((question, index) => {
                return (
                    <Question 
                        key={index + current}
                        question={question}
                        answers={answers}
                        isEditable={false}
                    />
                );
            })}
        </div>
    );
}

export default Answers;