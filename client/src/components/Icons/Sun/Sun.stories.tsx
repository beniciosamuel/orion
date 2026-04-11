import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { expect } from "storybook/test";
import { SunIcon } from ".";

const meta: Meta<typeof SunIcon> = {
  title: "Components/Icons/Sun",
  component: SunIcon,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof SunIcon>;

export const Default: Story = {
  render: () => (
    <div
      style={{
        width: 9,
        height: 14,
        color: "#131211",
        display: "grid",
        placeItems: "center",
      }}
      data-testid="sun-wrapper"
    >
      <SunIcon />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector("svg");

    await expect(svg).toBeInTheDocument();
    await expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
  },
};
