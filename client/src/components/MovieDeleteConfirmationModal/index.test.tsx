import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { MovieDeleteConfirmationModal } from "./index";

describe("MovieDeleteConfirmationModal", () => {
  it("asks for confirmation and triggers callbacks", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    const onConfirm = jest.fn();

    render(
      <MovieDeleteConfirmationModal
        isOpen
        movieTitle="Bumblebee"
        onClose={onClose}
        onConfirm={onConfirm}
      />,
    );

    expect(
      screen.getByRole("alertdialog", {
        name: /excluir filme/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/tem certeza que deseja excluir "bumblebee"\?/i),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /excluir/i }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
