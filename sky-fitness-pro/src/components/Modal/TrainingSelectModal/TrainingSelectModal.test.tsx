import { render } from "@testing-library/react";
import TrainingSelectModal from "./TrainingSelectModal";
import "@testing-library/jest-dom/";

// Мокируем функции для API
jest.mock("../../../utils/api", () => ({
	getCourseById: jest.fn().mockResolvedValue({ workouts: ["workout1", "workout2"] }),
	getWorkoutsById: jest.fn().mockResolvedValue({ _id: "workout1", name: "Workout 1" }),
}));

describe("TrainingSelectModal", () => {
	it("matches the snapshot", () => {
		const { asFragment } = render(<TrainingSelectModal closeModal={() => {}} courseId="course1" />);

		expect(asFragment()).toMatchSnapshot();
	});
});
