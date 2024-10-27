import { PieChart } from '@mui/x-charts/PieChart';
import { useEffect, useState } from 'react';
import { instance } from '../../../../../state/Interceptors';
import Block from "../../../features/block/Block";
import Title from "../../answers/widgets/title/Title";
import styles from './main.module.css';

const Statistic = ({form, setForm, setLoadingState = () => {}}) => {
    const [statistic, setStatistic] = useState([]);
    
    const GetStatistics = async () => {
        await instance
            .get(`/api/statistics?formId=${form.id}`)
            .then(response => {
                if (response.data) {
                    setStatistic(response.data);
                }
            })
            .catch(error => {
                console.error(error);
            });
    }

    useEffect(() => {
        if (form) {
            GetStatistics();
        }
    }, [form]);

    if (!form || !setForm) return null;

    return (
        <div className={styles.wrapper}>
            <Title
                form={form} 
            />
            {form.questions.sort((a, b) => a.index - b.index).map(question => {
                const questionStatistic = statistic.find(e => e.questionId == question.id);

                if (!!questionStatistic === true) {
                    return (
                        <Block key={question.id}>
                            <div className={styles.question}>
                                <h2>{question.question}</h2>
                                <PieChart
                                    series={[{
                                        data: questionStatistic.answers.map((element, index) => {
                                            return { id: index, value: element.count, label: element.value.toString() }
                                        }),
                                    }]}
                                    width={450}
                                    height={200}
                                />
                            </div>
                        </Block>
                    );
                }

                return null;
            })}
        </div>
    );
}

export default Statistic;