import { Control, Controller, FieldValues } from 'react-hook-form';

type RadioOption = {
  label: string;
  value: string;
};

interface RadioGroupProps<T extends FieldValues> {
  name: keyof T;
  options: RadioOption[];
  control: Control<T>;
  rules?: object;
}

export default function RadioGroup<T extends FieldValues>({ name, options, control, rules }: RadioGroupProps<T>) {
  return (
    <div className="flex space-x-4">
      {options.map((option) => (
        <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
          <Controller
            name={name as any}
            control={control}
            rules={rules}
            render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
              <>
                <input
                  type="radio"
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => onChange(e.target.value)}
                  ref={ref}
                  className="form-radio text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">{option.label}</span>
              </>
            )}
          />
        </label>
      ))}
    </div>
  );
}