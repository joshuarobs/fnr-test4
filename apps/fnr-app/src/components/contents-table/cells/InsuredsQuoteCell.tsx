import { Item } from '../item';
import { ReceiptIcon } from '../ReceiptIcon';
import { EditableInputField } from '../EditableInputField';
import { formatQuote, styles, validateQuoteInput } from './tableCellsStyles';

interface InsuredsQuoteCellProps {
  item: Item;
  updateItem: (updatedItem: Item) => void;
  isEditable?: boolean;
}

export const InsuredsQuoteCell = ({
  item,
  updateItem,
  isEditable = true,
}: InsuredsQuoteCellProps) => {
  const handleSave = (value: string) => {
    if (value === '') {
      updateItem({ ...item, insuredsQuote: null });
    } else {
      const newQuote = parseFloat(value);
      if (!isNaN(newQuote) && newQuote !== item.insuredsQuote) {
        updateItem({ ...item, insuredsQuote: newQuote });
      }
    }
  };

  return (
    <div className={styles.container}>
      <EditableInputField
        initialValue={item.insuredsQuote?.toString() ?? ''}
        onSave={handleSave}
        formatDisplay={(value) =>
          formatQuote(value === '' ? null : parseFloat(value), item.quantity)
        }
        validate={validateQuoteInput}
        inputClassName={styles.inputField}
        iconPosition="left"
        textAlign="right"
        isEditable={isEditable}
      />
      <ReceiptIcon receiptLink={item.receiptPhotoUrl} />
    </div>
  );
};
