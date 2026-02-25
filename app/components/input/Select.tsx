"use client";

import ReactSelect from "react-select";

interface SelectProps {
    label: string;
    value?: Record<string, any>;
    onChange: (value: Record<string, any>) => void;
    options: Record<string, any>[];
    disabled?: boolean;
}

const Select: React.FC<SelectProps> = ({
    label,
    value,
    onChange,
    options,
    disabled
}) => {
    return (
        <div className="z-[100]">
            <label className=" block text-sm font-semibold leading-6 text-white mb-2">
                {label}
            </label>
            <div className="mt-2 text-white">
                <ReactSelect
                    isDisabled={disabled}
                    value={value}
                    onChange={onChange}
                    isMulti
                    options={options}
                    menuPortalTarget={document.body}
                    styles={{
                        menuPortal: (base) => ({
                            ...base,
                            zIndex: 9999
                        }),
                        control: (base, state) => ({
                            ...base,
                            backgroundColor: 'rgba(15, 23, 42, 0.5)',
                            borderColor: state.isFocused ? '#2563eb' : 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '0.75rem',
                            padding: '2px',
                            boxShadow: state.isFocused ? '0 0 0 2px rgba(37, 99, 235, 0.2)' : 'none',
                            '&:hover': {
                                borderColor: 'rgba(37, 99, 235, 0.5)',
                            }
                        }),
                        menu: (base) => ({
                            ...base,
                            backgroundColor: '#0f172a',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '0.75rem',
                            overflow: 'hidden',
                            backdropFilter: 'blur(12px)',
                        }),
                        option: (base, state) => ({
                            ...base,
                            backgroundColor: state.isFocused ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
                            color: state.isSelected ? '#2563eb' : '#fff',
                            cursor: 'pointer',
                            '&:active': {
                                backgroundColor: 'rgba(37, 99, 235, 0.2)',
                            }
                        }),
                        multiValue: (base) => ({
                            ...base,
                            backgroundColor: 'rgba(37, 99, 235, 0.1)',
                            borderRadius: '0.5rem',
                            border: '1px solid rgba(37, 99, 235, 0.2)',
                        }),
                        multiValueLabel: (base) => ({
                            ...base,
                            color: '#3b82f6',
                            fontWeight: '600',
                        }),
                        multiValueRemove: (base) => ({
                            ...base,
                            color: '#3b82f6',
                            '&:hover': {
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                color: '#ef4444',
                            }
                        }),
                        input: (base) => ({
                            ...base,
                            color: '#fff',
                        }),
                        placeholder: (base) => ({
                            ...base,
                            color: '#6b7280',
                        }),
                        singleValue: (base) => ({
                            ...base,
                            color: '#fff',
                        })
                    }}
                    classNames={{
                        control: () => "text-sm"
                    }}
                />
            </div>
        </div>
    );
}

export default Select;