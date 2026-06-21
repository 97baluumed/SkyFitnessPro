import { render, screen, fireEvent } from "@testing-library/react";
import Header from "./Header";
import { useUser } from "../../hooks/useUser";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";
import { act } from "react-dom/test-utils";

jest.mock("../../hooks/useUser", () => ({
	useUser: jest.fn(),
}));

jest.mock("../../utils/api", () => ({
	getUserName: jest.fn(() => Promise.resolve({ name: "John Doe" })),
}));

describe("Header", () => {
	const mockOpenModal = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('Должен отображать Header и кнопку "Войти", если user is null', async () => {
		(useUser as jest.Mock).mockReturnValue({ user: null, logoutUser: jest.fn() });

		await act(async () => {
			render(
				<Router>
					<Header openModal={mockOpenModal} />
				</Router>,
			);
		});

		expect(screen.getByText("Войти")).toBeInTheDocument();
	});

	it("Должен отображать Header и профиль пользователя, если тот авторизован", async () => {
		(useUser as jest.Mock).mockReturnValue({
			user: { email: "user@example.com" },
			logoutUser: jest.fn(),
		});
	
		await act(async () => {
			render(
				<Router>
					<Header openModal={mockOpenModal} />
				</Router>,
			);
		});
	
		expect(screen.getByTestId("user-email")).toHaveTextContent("user@example.com");
	});
	

	it('Должен отображать модальное окно авторизации при нажатии на "Войти"', async () => {
		(useUser as jest.Mock).mockReturnValue({ user: null, logoutUser: jest.fn() });

		await act(async () => {
			render(
				<Router>
					<Header openModal={mockOpenModal} />
				</Router>,
			);
		});

		fireEvent.click(screen.getByText("Войти"));
		expect(mockOpenModal).toHaveBeenCalled();
	});
});
