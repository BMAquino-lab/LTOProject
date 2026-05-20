import { type StylesConfig } from 'react-select';

export const customSelectStyles = <OptionType>(): StylesConfig<OptionType, boolean> => ({
    //outer box border and bg
    control: (provided, state) => ({
        ...provided,
        backgroundColor: '#d9dce7',
        borderColor: state.isFocused ? '#0e1e42' : '#cbd5e1',
        borderRadius: '8px',
        minHeight: "50px",
        fontFamily: "Garet"
    }),

    option: (provided) => ({
        ...provided,
        fontFamily: "Garet"
    }),

    //selected tags
    multiValue: (provided) => ({
        ...provided,
        backgroundColor: '#0e1e42',
        borderRadius: '20px',
        padding: '2px 6px',
        fontFamily: "Garet"
    }),

    //text in the selected tag
    multiValueLabel: (provided) => ({
        ...provided,
        color: '#ffffff',
        // fonteight: 'bold',
    }),

    //x button in selected tag
    multiValueRemove: (provided) => ({
        ...provided,
        color: '#ffffff',
        '&:hover': {
            backgroundColor: '#bd031a',
            color: '#ffffff',
            borderRadius: '50%',
        },
    }),
});