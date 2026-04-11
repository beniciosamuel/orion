import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { expect } from "storybook/test";
import { ChevronUpIcon } from ".";

const meta: Meta<typeof ChevronUpIcon> = {
  title: "Components/Icons/ChevronUp",
  component: ChevronUpIcon,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof ChevronUpIcon>;

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
      data-testid="chevron-up-wrapper"
    >
      <ChevronUpIcon />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector("svg");

    await expect(svg).toBeInTheDocument();
    await expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
  },
};
