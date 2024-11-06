import { useEffect, useState } from 'react';
import Wrapper from '../../home/elemets/wrapper/Wrapper';
import Header from '../../home/widgets/header/Header';
import Issue from '../widgets/issue/Issue';
import styles from './main.module.css';
import { instance } from '../../../state/Interceptors';

const Issues = () => {
    const [issues, setIssues] = useState([]);

    useEffect(() => {
        (async () => {
            await instance
                .get('/api/jira')
                .then(response => {
                    if (response.data && response.data.length) {
                        setIssues(response.data);
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        })();
    }, []);

    return (
        <div className={styles.wrapper}>
            <Header />
            <div className={styles.subHeader}>
                <Wrapper>
                    <div className={styles.headerContent}>
                        <h3>Reported Issues</h3>
                        <span>Powerd by Atlassian Jira</span>
                    </div>
                </Wrapper>
            </div>
            <Wrapper>
                <div className={styles.content}>
                    {issues.map(issue => {
                        return (
                            <Issue 
                                key={issue.id}
                                title={issue.title}
                                description={issue.description}
                                link={issue.link}
                                priority={issue.priority}
                                issueKey={issue.key}
                            />
                        )
                    })}
                </div>
            </Wrapper>
            <br />
            <br />
        </div>
    );
}

export default Issues;