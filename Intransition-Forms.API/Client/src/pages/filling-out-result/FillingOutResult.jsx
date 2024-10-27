import { useNavigate, useParams } from 'react-router-dom';
import SimpleButton from '../../elements/button/SimpleButton';
import Block from '../form/features/block/Block';
import styles from './main.module.css';

const FillingOutResult = ({name = "Unknown"}) => {
    let navigate = useNavigate();
    let params = useParams();

    return (
        <div className={styles.wrapper}>
            <Block>
                <div className={styles.title}>
                    <h1>{name}</h1>
                    <span>Form was sucessfully filled out!</span>
                </div>
                <div className={styles.buttons}>
                    <SimpleButton 
                        title="Send again"
                        callback={() => navigate(`/filling/${params.id}`)}
                    />
                    <SimpleButton 
                        title="Home"
                        type={"sub"}
                        callback={() => navigate(`/`)}
                    />
                </div>
            </Block>
        </div>
    );
}

export default FillingOutResult;