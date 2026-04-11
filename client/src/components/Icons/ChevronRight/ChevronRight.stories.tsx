import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { expect } from "storybook/test";
import { ChevronRightIcon } from ".";

const meta: Meta<typeof ChevronRightIcon> = {
  title: "Components/Icons/ChevronRight",
  component: ChevronRightIcon,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof ChevronRightIcon>;

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
      data-testid="chevron-right-wrapper"
    >
      <ChevronRightIcon />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector("svg");

    await expect(svg).toBeInTheDocument();
    await expect(svg).toHaveAttribute("viewBox", "0 0 9 14");
  },
};
