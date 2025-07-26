import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";
import { Context } from "../Contexts/GlobalContext"
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import Register from "../components/Auth/Register";
vi.mock("axios");

const mockContext = {
  isAuthorized: false,
  setIsAuthorized: vi.fn(),
};

const renderWithContext = () =>
  render(
    <MemoryRouter>
      <Context.Provider value={mockContext}>
        <Register />
      </Context.Provider>
    </MemoryRouter>
  );

describe("Test cases for Registration form", () => {
  test("Test case for Rendering form field", () => {
    renderWithContext();
    const userNameField = screen.getByPlaceholderText(/Username/i)
    const userEmailField = screen.getByPlaceholderText(/abc@gmail.com/i)
    const userPhoneField = screen.getByPlaceholderText(/12345678/i)
    const userpassField = screen.getByPlaceholderText(/Your Password/i)

    expect(userNameField).toBeInTheDocument()
    expect(userEmailField).toBeInTheDocument()
    expect(userPhoneField).toBeInTheDocument()
    expect(userpassField).toBeInTheDocument()
  })

  test("Show error message on empty form submission", async () => {
    renderWithContext();
    const submitButton = screen.getByTestId("register-submit", { name: /Register/i })
    await userEvent.click(submitButton)

    expect(screen.getByText(/Role is required */i)).toBeInTheDocument()
    expect(screen.getByText(/Please enter your Name! */i)).toBeInTheDocument()
    expect(screen.getByText(/Please enter your Email! */i)).toBeInTheDocument()
    expect(screen.getByText(/Please enter your 10 digit mobile number! */i)).toBeInTheDocument()
    expect(screen.getAllByText(/Please enter your Password! */i).length).toBeGreaterThan(0)
  })

  test("Valid form submission clears field", async () => {
    axios.post.mockResolvedValueOnce({
      data: { message: "Register successful" },
    });

    renderWithContext();

    await userEvent.type(screen.getByPlaceholderText(/Username/i), "paras");
    await userEvent.type(screen.getByPlaceholderText(/abc@gmail.com/i), "paras@gmail.com");
    await userEvent.type(screen.getByPlaceholderText(/12345678/i), "1234567890");
    await userEvent.type(screen.getByPlaceholderText(/Your Password/i), "Paras123");
    await userEvent.type(screen.getByPlaceholderText(/Confirm Password/i), "Paras123");
    await userEvent.selectOptions(screen.getByRole("combobox"), "Employer");

    const submitButton = screen.getByTestId("register-submit")
    await userEvent.click(submitButton);


    await waitFor(() => {
      const updatedEmailInput = screen.getByPlaceholderText(/abc@gmail.com/i);
      expect(updatedEmailInput).toHaveValue("");
    });
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