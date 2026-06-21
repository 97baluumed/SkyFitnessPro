// src/components/Modal/TrainingProgressModal/TrainingProgressItem/TrainingProgressItem.tsx

import { useState, useEffect } from "react"; // ✅ Добавлен useEffect
import { Exercise } from "../../../../types/training";

interface TrainingProgressItemProps extends Exercise {
	onQuantityChange: (exerciseName: string, realQuantity: number) => void;
	currentProgress: number;
}

function TrainingProgressItem({ name, quantity, onQuantityChange, currentProgress }: TrainingProgressItemProps) {
	const [localValue, setLocalValue] = useState<number | "">(currentProgress !== undefined ? currentProgress : 0);

	// ✅ Обновляем локальное значение, когда currentProgress меняется
	useEffect(() => {
		setLocalValue(currentProgress !== undefined ? currentProgress : 0);
	}, [currentProgress]);

	const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = Number(e.target.value);
		setLocalValue(value);
		onQuantityChange(name, value);
	};

	return (
		<div className="flex flex-col gap-2 w-full">
			<label className="text-black text-[16px] text-start font-medium">{name}</label>
			<input
				type="number"
				placeholder={quantity.toString()}
				value={localValue === 0 ? "" : localValue} // ✅ "" для 0 (чтобы placeholder работал)
				className="text-[16px] placeholder:opacity-[60%] w-full h-[47px] text-base font-normal text-black-400 border border-gray-300 rounded-[8px] p-[16px]"
				onChange={handleQuantityChange}
			/>
		</div>
	);
}

export default TrainingProgressItem;