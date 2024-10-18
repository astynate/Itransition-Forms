import Avatar from '../../../../../home/elemets/avatar/Avatar';
import Block from '../../../../features/block/Block';
import styles from './main.module.css';
import arrow from './arrow.svg';
import TextInput from '../../../../shared/text-input/TextInput';
import DateHandler from '../../../../../../utils/DateHandler';

const Title = ({form, fillingOuts = [], current, setCurrent, fillingOut}) => {
    const ChangeCurrent = (value) => {
        const result = value + current;

        if (fillingOuts.length >= result && result > 0) {
            setCurrent(result);
        }
    }

    return (
        <Block>
            <div className={styles.title}>
                <h1>{form.title}</h1>
                <span className={styles.numberOfFills}>{form.numberOfFills} Answers</span>
                {fillingOut && <div className={styles.users}>
                    <div className={styles.user}>
                        <Avatar name={fillingOut.user.email} color={fillingOut.user.color} />
                        <span>{fillingOut.user.email}</span>
                    </div>
                    <span className={styles.date}>{DateHandler.Format(fillingOut.date)}</span>
                    <div className={styles.control}>
                        <button className={styles.button} onClick={() => ChangeCurrent(-1)}>
                            <img src={arrow} className={styles.left} />
                        </button>
                        <div className={styles.input}>
                            <TextInput 
                                fontSize={16}
                                fontWeight={500}
                                text={current}
                                maxLength={2}
                                setText={(text) => {
                                    let digit = parseInt(text);
                                    
                                    if (digit > fillingOuts.length)
                                        digit = fillingOuts.length;
                                    
                                    setCurrent(prev => {
                                        if (fillingOuts.length >= digit && digit > 0) {
                                            return digit;
                                        }

                                        return prev;
                                    });

                                    return current;
                                }}
                                isDigitsOnly={true}
                            />
                        </div>
                        <span>of {fillingOuts.length}</span>
                        <button className={styles.button} onClick={() => ChangeCurrent(1)}>
                            <img src={arrow} className={styles.right} />
                        </button>
                    </div>
                </div>}
            </div>
        </Block>
    );
}

export default Title;