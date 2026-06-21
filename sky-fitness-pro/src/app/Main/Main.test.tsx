import { render } from "@testing-library/react";
import Main from "./Main";

// Мокаем модуль getCourse, чтобы избежать реальных запросов к API
jest.mock("../../utils/api", () => ({
	getCourse: jest.fn(() => Promise.resolve({})),
}));

describe("Main", () => {
	it("snapshot", async () => {
		// Рендерим компонент
		const { asFragment } = render(<Main />);

		expect(asFragment()).toMatchSnapshot();
	});
});
