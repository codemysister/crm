import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useState } from "react";

export default function CellEditor({ value, onValueChange, onEditorCancel }) {
    const [inputValue, setInputValue] = useState(value);

    const handleSave = () => {
        onValueChange(inputValue);
        onEditorCancel();
    };

    const handleCancel = () => {
        onEditorCancel();
    };

    return (
        <div className="p-d-flex p-ai-center">
            <InputText
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
            />
            <Button
                icon="pi pi-check"
                className="p-button-rounded p-button-success p-ml-2"
                onClick={handleSave}
            />
            <Button
                icon="pi pi-times"
                className="p-button-rounded p-button-danger p-ml-1"
                onClick={handleCancel}
            />
        </div>
    );
}
