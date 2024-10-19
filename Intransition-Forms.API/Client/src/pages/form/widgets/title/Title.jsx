import Block from '../../features/block/Block';
import MarkdownInput from '../../shared/markdown-input/MarkdownInput';
import Select from '../../shared/select/Select';
import TextInput from '../../shared/text-input/TextInput';
import styles from './main.module.css';

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
            <div className={styles.select}>
                <button>

                </button>
                <Select
                    items={types}
                    value={1}
                    onChange={(event) => {  }}
                />
            </div>
        </Block>
    );
}

export default Title;