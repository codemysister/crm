import React, { memo, useCallback } from "react";
import { InputText } from "primereact/inputtext";

const InputTextComponent = ({ data, setData }) => {
    // useCallback to ensure setData function reference is stable
    const handleChange = useCallback(
        (e) => setData("money", e.target.value),
        [setData]
    );

    return (
        <InputText
            value={data.money}
            onChange={handleChange}
            className="dark:bg-gray-300"
            id="money"
            required
            aria-describedby="money-help"
        />
    );
};

// Use memo to optimize the component rendering
export default memo(InputTextComponent);
