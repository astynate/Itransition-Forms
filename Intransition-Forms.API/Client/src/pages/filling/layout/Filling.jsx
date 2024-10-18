import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormsAPI from "../../form/api/FormsAPI";
import styles from './main.module.css';
import Loading from "../../../elements/loading/Loading";
import Block from "../../form/features/block/Block";
import FormWrapper from "../../form/shared/form-wrapper/FormWrapper";
import SimpleButton from "../../../elements/button/SimpleButton";
import Guid from "../../../utils/Guid";
import FillingAPI from "../api/FillingAPI";
import Question from "../widgets/question/Question";

const FillingPage = () => {
    const [form, setForm] = useState(undefined);
    const [isLoading, setLoadingState] = useState(true);
    const [answers, setAnswers] = useState({});
    const [isClear, setClearState] = useState(false);
    
    let descriptionRef = useRef();
    let params = useParams();
    let navigate = useNavigate();
    
    useEffect(() => {
        FormsAPI.GetFormById(
            params.id, 
            setForm, 
            setLoadingState
        );
    }, [params.id]);

    const SetDefaultAnswers = () => {
        if (!form || !form.questions) return;

        setAnswers((_) => {
            let result = {};

            for (let i = 0; i < form.questions.length; i++) {
                for (let k = 0; k < form.questions[i].answers.length; k++) {
                    result[form.questions[i].answers[k].id] = {
                        id: Guid.NewGuid(),
                        value: undefined,
                        answerId: form.questions[i].answers[k].id
                    }
                }
            }

            return result;
        });
    }

    useEffect(() => {
        if (form && descriptionRef.current) {
            descriptionRef.current.innerHTML = form.description;
            SetDefaultAnswers();
        }
    }, [form]);

    
    useEffect(() => {
        if (!form && !isLoading) {
            navigate('/');
        }
    }, [form, isLoading]);

    return (
        <div className={styles.wrapper}>
            {isLoading && <Loading />}
            {form && <div className={styles.form}>
                <Block>
                    <div className={styles.header}>
                        <h1 className={styles.title}>{form.title}</h1>
                        <span ref={descriptionRef}></span>
                    </div>
                </Block>
                {form.questions.sort((a, b) => a.index - b.index).map(question => {
                    return (
                        <Question 
                            key={question.id + isClear}
                            question={question}
                            answers={answers}
                            setAnswers={setAnswers}
                        />
                    );
                })}
                <br />
                <FormWrapper>
                    <div className={styles.footer}>
                        <SimpleButton 
                            title="Send" 
                            callback={() => {
                                FillingAPI.SendFillRequest(params.id, answers);
                            }}
                        />
                        <SimpleButton 
                            title="Clear" 
                            type={"sub"} 
                            callback={() => {
                                setClearState(prev => !prev);
                                SetDefaultAnswers();
                            }}
                        />
                    </div>
                </FormWrapper>
            </div>}
        </div>
    );
}

export default FillingPage;