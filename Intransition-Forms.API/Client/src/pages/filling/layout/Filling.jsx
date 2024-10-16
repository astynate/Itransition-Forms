import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormsAPI from "../../form/api/FormsAPI";
import styles from './main.module.css';
import Loading from "../../../elements/loading/Loading";
import Block from "../../form/features/block/Block";
import FormWrapper from "../../form/shared/form-wrapper/FormWrapper";
import SimpleButton from "../../../elements/button/SimpleButton";
import CheckboxAnswer from "../widgets/checkbox/CheckboxAnswer";
import RangeAnswer from "../widgets/range/RangeAnswer";
import TextBoxAnswer from "../widgets/textbox/TextBoxAnswer";
import Guid from "../../../utils/Guid";
import FillingAPI from "../api/FillingAPI";

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
        <div className={styles.wrapper} key={isClear}>
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
                        <Block key={question.id}>
                            <div className={styles.question}>
                                <h2>{question.question}</h2>
                                <div className={styles.answers}>
                                    {question.answers.sort((a, b) => a.index- b.index).map(answer => {
                                        const handlers = [
                                            [answer.title !== undefined, CheckboxAnswer],
                                            [answer.maxValue !== undefined, RangeAnswer]
                                        ];
                    
                                        const target = handlers.find(e => e[0] === true);
                                        const Handler = target ? target[1] : TextBoxAnswer;

                                        return (<Handler 
                                            key={answer.id} 
                                            answer={answer} 
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
                })}
                <br />
                <FormWrapper>
                    <div className={styles.footer}>
                        <SimpleButton 
                            title="Send" 
                            callback={() => {
                                FillingAPI.SendFillRequest();
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