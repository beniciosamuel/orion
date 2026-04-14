import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { expect, userEvent } from "storybook/test";

import { ThemeSwitcher } from ".";
import { ThemeProvider } from "../../contexts/ThemeContext";

const meta: Meta<typeof ThemeSwitcher> = {
  title: "Components/ThemeSwitcher",
  component: ThemeSwitcher,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof ThemeSwitcher>;

export const Default: Story = {
  render: () => (
    <div
      style={{
        width: 14,
        height: 9,
        color: "#121113",
        display: "grid",
        placeItems: "center",
      }}
      data-testid="theme-switcher-wrapper"
    >
      <ThemeSwitcher />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const switcherButton = canvasElement.querySelector("button");

    await expect(switcherButton).toBeInTheDocument();
    await expect(switcherButton).toHaveAttribute(
      "aria-label",
      "Switch to dark theme",
    );
    await expect(switcherButton).toHaveAttribute("aria-pressed", "true");

    if (switcherButton) {
      await userEvent.click(switcherButton);
    }

    await expect(switcherButton).toHaveAttribute(
      "aria-label",
      "Switch to light theme",
    );
    await expect(switcherButton).toHaveAttribute("aria-pressed", "false");
  },
};
