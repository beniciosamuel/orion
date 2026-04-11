import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { expect } from "storybook/test";
import { Logo } from ".";

const meta: Meta<typeof Logo> = {
  title: "Components/Logo",
  component: Logo,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof Logo>;

export const Default: Story = {
  render: () => (
    <div
      style={{
        width: 160,
        height: 160,
        color: "#121113",
        display: "grid",
        placeItems: "center",
      }}
      data-testid="logo-wrapper"
    >
      <Logo />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector("svg");

    await expect(svg).toBeInTheDocument();
    await expect(svg).toHaveAttribute("viewBox", "0 0 143 140");
  },
};
