import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { expect } from "storybook/test";
import { MoonIcon } from "./Moon";

const meta: Meta<typeof MoonIcon> = {
  title: "Components/Icons/Moon",
  component: MoonIcon,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof MoonIcon>;

export const Default: Story = {
  render: () => (
    <div
      style={{
        width: 9,
        height: 14,
        color: "#121113",
        display: "grid",
        placeItems: "center",
      }}
      data-testid="moon-wrapper"
    >
      <MoonIcon />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector("svg");

    await expect(svg).toBeInTheDocument();
    await expect(svg).toHaveAttribute("viewBox", "0 0 17 15");
  },
};
