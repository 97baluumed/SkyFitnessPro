import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ExerciseProgress from "./ExerciseProgress";

describe("ExerciseProgress", () => {
	test("Должен корректно отображаться с прогрессом", () => {
		const exercise = { _id: "1", name: "Push Ups", quantity: 20, video: "pushups.mp4" };
		const progress = 10;

		render(<ExerciseProgress exercise={exercise} progress={progress} />);

		// Проверяем, что прогресс-бар имеет правильную ширину
		const progressBar = screen.getByTestId("progress-bar");
		expect(progressBar).toHaveStyle("width: 50%");
	});

	test("Должен корректно отображаться без прогресса", () => {
		const exercise = { _id: "1", name: "Push Ups", quantity: 20, video: "pushups.mp4" };
		const progress = 0;

		render(<ExerciseProgress exercise={exercise} progress={progress} />);

		// Проверяем, что прогресс-бар имеет ширину 0%
		const progressBar = screen.getByTestId("progress-bar");
		expect(progressBar).toHaveStyle("width: 0%");
	});

	test("Должен корректно отображаться, когда прогресс больше требуемого", () => {
		const exercise = { _id: "1", name: "Push Ups", quantity: 20, video: "pushups.mp4" };
		const progress = 30;

		render(<ExerciseProgress exercise={exercise} progress={progress} />);

		// Проверяем, что прогресс-бар имеет ширину 100%
		const progressBar = screen.getByTestId("progress-bar");
		expect(progressBar).toHaveStyle("width: 100%");
	});
});
