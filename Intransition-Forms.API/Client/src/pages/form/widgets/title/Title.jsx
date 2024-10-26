import Block from '../../features/block/Block';
import MarkdownInput from '../../shared/markdown-input/MarkdownInput';
import TextInput from '../../shared/text-input/TextInput';

const Title = ({form, setForm}) => {
    if (!form || !setForm) return null;

    return (
        <Block>
            <TextInput
                text={form.title}
                setText={(newText) => {
                    setForm(prev => {
                        return { ...prev, title: newText };
                    })
                }}
                fontSize={26}
                fontWeight={700}
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
        </Block>
    );
}

export default Title;