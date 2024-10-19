import Block from '../../features/block/Block';
import MarkdownInput from '../../shared/markdown-input/MarkdownInput';
import Select from '../../shared/select/Select';
import TextInput from '../../shared/text-input/TextInput';
import styles from './main.module.css';
import close from './images/remove.png';

const Title = ({form, setForm}) => {
    if (!form || !setForm) return null;

    const types = ['Education', 'Quiz', 'Other'];

    return (
        <Block>
            <TextInput 
                text={form.title}
                setText={(newText) => {
                    setForm(prev => {
                        return { ...prev, title: newText };
                    })
                }}
                isMultiple={false}
            />
            <MarkdownInput 
                text={form.description}
                setText={(newText) => {
                    setForm(prev => {
                        return { ...prev, description: newText };
                    })
                }}
            />
            <div className={styles.tags}>
                {/* <div className={styles.tag}>
                    <span>Tag</span>
                    <img src={close} />
                </div> */}
                <div className={styles.newTag}>
                    <input 
                        placeholder='New tag'
                        maxLength={20} 
                        onBlur={(event) => event.target.value = ""}
                    />
                </div>
                <div className={styles.selectWrapper}>
                    <Select
                        items={types}
                        value={form.topic}
                        onChange={(event) => {  
                            setForm(prev => {
                                return { ...prev, topic: event.target.value };
                            })
                        }}
                    />
                </div>
            </div>
            {/* <div className={styles.select}>
                <button>
                    <span>Image</span>
                </button>
                <Select
                    items={types}
                    value={form.topic}
                    onChange={(event) => {  
                        setForm(prev => {
                            return { ...prev, topic: event.target.value };
                        })
                    }}
                />
            </div> */}
        </Block>
    );
}

export default Title;