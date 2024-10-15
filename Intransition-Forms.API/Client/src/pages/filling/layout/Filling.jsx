import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import FormsAPI from "../../form/api/FormsAPI";
import styles from './main.module.css';
import Loading from "../../../elements/loading/Loading";
import Block from "../../form/features/block/Block";
import FormWrapper from "../../form/shared/form-wrapper/FormWrapper";
import SimpleButton from "../../../elements/button/SimpleButton";
import CheckboxAnswer from "../widgets/checkbox/CheckboxAnswer";
import TextInput from "../../form/shared/text-input/TextInput";
import RangeAnswer from "../widgets/range/RangeAnswer";
import TextBoxAnswer from "../widgets/textbox/TextBoxAnswer";

const FillingPage = () => {
    const [form, setForm] = useState(undefined);
    const [isLoading, setLoadingState] = useState(false);
    const [questions, setQuestions] = useState([]);
    
    let descriptionRef = useRef();
    let params = useParams();
    
    useEffect(() => {
        FormsAPI.GetFormById(
            params.id, 
            setForm, 
            setLoadingState
        );
    }, [params.id]);

    useEffect(() => {
        if (form && descriptionRef.current) {
            descriptionRef.current.innerHTML = form.description;
        }
    }, [form]);

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
                        <Block key={question.id}>
                            <div className={styles.question}>
                                <h2>{question.question}</h2>
                                {question.answers.map(answer => {
                                    const handlers = [
                                        [answer.title !== undefined, CheckboxAnswer],
                                        [answer.maxValue !== undefined, RangeAnswer]
                                    ];
                
                                    const target = handlers.find(e => e[0] === true);
                                    const Handler = target ? target[1] : TextBoxAnswer;

                                    return (<Handler answer={answer} />);
                                })}
                            </div>
                        </Block>
                    );
                })}
                <br />
                <FormWrapper>
                    <div className={styles.footer}>
                        <SimpleButton title="Send" />
                        <SimpleButton title="Clear" type={"sub"} />
                    </div>
                </FormWrapper>
            </div>}
        </div>
    );
}

export default FillingPage;