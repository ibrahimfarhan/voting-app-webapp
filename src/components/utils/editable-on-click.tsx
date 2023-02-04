import { Fragment, useEffect, useRef, useState } from "react";
import { returnIfLink, showAlert } from "../../utils/utils";
import styles from './editable-on-click.module.scss';
import { ValidationRules } from "../../models/validation";
import { useDispatch } from "react-redux";
import ShowFirstChild from "./show-first-child";

export interface EditableOnClickProps {
  onSubmit?: (text?: string) => void
  disableEdit?: boolean,
  initialText?: string,
  validationRules?: ValidationRules,
  customErrorMsg?: string
  classes?: { input?: string, err?: string }
  placeholder?: string
}

const EditableOnClick = ({
  onSubmit,
  disableEdit,
  initialText = '',
  validationRules = {},
  customErrorMsg,
  classes,
  placeholder = '',
}: EditableOnClickProps) => {

  const dispatch = useDispatch();
  const { maxLength = 500, pattern } = validationRules;
  const [applyEditableStyle, setApplyEditableStyle] = useState<boolean>(false);
  const [text, setText] = useState<string | undefined>('');
  const [showPlaceholder, setShowPlaceholder] = useState<boolean>(!Boolean(initialText));
  const inputRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    setShowPlaceholder(!Boolean(initialText));
    if (inputRef?.current) {
      inputRef.current.textContent = initialText || placeholder;
      setText(inputRef.current.textContent);
    }
  }, [inputRef, initialText, placeholder]);

  const handleFocus = () => {
    setShowPlaceholder(false);
    if (inputRef.current && showPlaceholder) inputRef.current.textContent = '';
  }

  const handleBlur = () => {

    const submitted = (inputRef.current?.textContent || '');

    if (!submitted) {
      setShowPlaceholder(true);
      if (inputRef.current) inputRef.current.textContent = placeholder;
    }

    if (pattern && !pattern.test(submitted)) {
      showAlert(dispatch, { type: 'error', content: customErrorMsg || 'Invalid value' });
      return;
    }

    if (submitted.length > maxLength) {
      showAlert(dispatch, { type: 'error', content: customErrorMsg || `Content cannot be larger than ${maxLength}` });
      return;
    }

    if (inputRef?.current && submitted) inputRef.current.textContent = submitted.trim();
    if (onSubmit) onSubmit(submitted);
    setApplyEditableStyle(false);
  };

  const onMouseDown = !disableEdit ? () => setApplyEditableStyle(true) : undefined;

  return (
    <a
      contentEditable={!disableEdit}
      className={`${styles.text} ${classes?.input ?? ''} ${applyEditableStyle ? styles.editable : ''} ${showPlaceholder ? styles.empty : ''}`}
      ref={inputRef}
      href={returnIfLink(text)}
      id="field"
      spellCheck="false"
      onBlur={handleBlur}
      onFocus={handleFocus}
      target="blank"
      onMouseDown={onMouseDown}
      defaultValue={showPlaceholder ? placeholder : initialText}
    >
    </a>
  )
};

export default EditableOnClick;