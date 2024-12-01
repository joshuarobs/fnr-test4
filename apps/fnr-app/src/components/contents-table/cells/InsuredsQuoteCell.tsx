import { Item } from '../item';
import { ReceiptIcon } from '../ReceiptIcon';
import { EditableInputField } from '../EditableInputField';

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
  const formatQuote = (quote: number | null) => {
    // Check if quote is exactly 0 (not null)
    if (quote === 0) {
      return '0.00';
    }
    // Check if quote is null or undefined
    if (quote == null) {
      return <div className="text-muted-foreground italic">No quote</div>;
    }

    const formattedEachPrice = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(quote);

    // If quantity > 1, show total price and each price
    if (item.quantity > 1) {
      const totalPrice = quote * item.quantity;
      const formattedTotalPrice = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(totalPrice);

      return (
        <div className="text-right max-h-[52px]">
          <div>{formattedTotalPrice}</div>
          <div className="text-muted-foreground text-sm">
            ${formattedEachPrice} ea
          </div>
        </div>
      );
    }

    return formattedEachPrice;
  };

  const validateInput = (value: string) => {
    return value === '' || /^\d*\.?\d{0,2}$/.test(value);
  };

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
    <div className="flex items-center justify-end w-full">
      <EditableInputField
        initialValue={item.insuredsQuote?.toString() ?? ''}
        onSave={handleSave}
        formatDisplay={(value) =>
          formatQuote(value === '' ? null : parseFloat(value))
        }
        validate={validateInput}
        inputClassName="w-24"
        iconPosition="left"
        textAlign="right"
        isEditable={isEditable}
      />
      <ReceiptIcon receiptLink={item.receiptPhotoUrl} />
    </div>
  );
};
