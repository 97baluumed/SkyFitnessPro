export type TrainingType = {
	id: string;
	_id: string;
	images: {
		cardImage: string;
		courseImage: string;
	};
	nameRU: string;
	description: string;
	directions: string[];
	fitting: string[];
};

export interface Exercise {
	_id: string;
	name: string;
	quantity: number;
	video: string;
}
