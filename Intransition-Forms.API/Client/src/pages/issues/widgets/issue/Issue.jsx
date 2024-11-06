import { useNavigate } from 'react-router-dom';
import SimpleButton from '../../../../elements/button/SimpleButton';
import styles from './main.module.css';

const Issue = ({title, description, link, priority, issueKey}) => {
    return (
        <div className={styles.issue}>
            <h2>{title}</h2>
            <div className={styles.fields}>
                <h4>Description</h4>
                <span>{description}</span>
                <h4>Problem page</h4>
                <span>{link}</span>
                <h4>Priority</h4>
                <span>{priority}</span>
            </div>
            <br />
            <SimpleButton 
                title={'Visit'} 
                callback={() => {
                    window.location.href = `https://itransition-help-center.atlassian.net/browse/${issueKey}`;
                }}
            />
        </div>
    );
}

export default Issue;