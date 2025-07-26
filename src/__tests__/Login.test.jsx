import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";
import Login from "../components/Auth/Login";
import { Context } from "../Contexts/GlobalContext" 
import { MemoryRouter } from "react-router-dom";

import axios from "axios";
vi.mock("axios");

const mockContext = {
  isAuthorized: false,
  setIsAuthorized: vi.fn(),
};

const renderWithContext = () =>
  render(
    <MemoryRouter>
      <Context.Provider value={mockContext}>
      <Login />
    </Context.Provider>
    </MemoryRouter>
  );

describe("Test cases for Registration form", () => {
    test("Test case for Rendering form field", () => {
        renderWithContext();
        const userEmailField = screen.getByPlaceholderText(/abc@gmail.com/i)
        const userpassField = screen.getByPlaceholderText(/Your Password/i)

        expect(userEmailField).toBeInTheDocument()
        expect(userpassField).toBeInTheDocument()
    })

    test("Show error message on empty form submission", async () => {
        renderWithContext();
        const submitButton = screen.getByTestId("login-submit", { name: /submit/i })
        await userEvent.click(submitButton)

        expect(screen.getByText(/Please enter your Email! */i)).toBeInTheDocument()
        expect(screen.getByText(/Please enter your Password! */i)).toBeInTheDocument()
    })

    test("Valid form submission clears field", async () => {
        axios.post.mockResolvedValueOnce({
            data: { message: "Login successful" },
        });

        renderWithContext();

        await userEvent.type(screen.getByPlaceholderText(/abc@gmail.com/i), "paras@gmail.com");
        await userEvent.type(screen.getByPlaceholderText(/Your Password/i), "Paras123");
        await userEvent.selectOptions(screen.getByRole("combobox"), "Employer");

        const submitButton = screen.getByTestId("login-submit", { name: /submit/i })
        await userEvent.click(submitButton);

        expect(await screen.findByPlaceholderText(/abc@gmail.com/i)).toHaveValue("");
    });

    test("Test Toggle password button", async () => {
        renderWithContext();
        const showHidebtn = screen.getByTestId("togglePass");;
        const passwordField = screen.getByPlaceholderText(/Your Password/i);

        expect(passwordField).toHaveAttribute('type', 'password')
        await userEvent.click(showHidebtn)
        expect(passwordField).toHaveAttribute('type', 'text')

    })
})