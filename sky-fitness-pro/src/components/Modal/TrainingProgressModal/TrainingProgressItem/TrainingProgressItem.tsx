import { useState } from "react";
import { Exercise } from "../../../../types/training";

interface TrainingProgressItemProps extends Exercise {
	onQuantityChange: (exerciseName: string, realQuantity: number) => void;
}

function TrainingProgressItem({ name, quantity, onQuantityChange }: TrainingProgressItemProps) {
	const [realQuantity, setRealQuantity] = useState<number>();

	const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = Number(e.target.value);
		setRealQuantity(value);
		onQuantityChange(name, value);
	};

	return (
		<div className="flex flex-col gap-2 w-full">
			<label className="text-black text-[16px] text-start font-medium">{name}</label>
			<input
				type="number"
				placeholder={quantity.toString()}
				value={realQuantity || ""}
				className="text-[16px] placeholder:opacity-[60%] w-full h-[47px] text-base font-normal text-black-400 border border-gray-300 rounded-[8px] p-[16px]"
				onChange={handleQuantityChange}
			/>
		</div>
	);
}

export default TrainingProgressItem;
