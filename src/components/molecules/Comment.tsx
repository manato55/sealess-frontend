import TextArea from '../atoms/TextArea';

interface Props {
  comment: string;
  editable?: boolean;
}

export const BasicInfo = (props: Props): React.ReactElement => {
  return (
    <>
      <TextArea editable={props.editable}>{props.comment}</TextArea>
    </>
  );
};

export default BasicInfo;
