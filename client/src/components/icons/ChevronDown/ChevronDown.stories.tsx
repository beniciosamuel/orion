import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { expect } from "storybook/test";
import { ChevronDownIcon } from "./ChevronDown";

const meta: Meta<typeof ChevronDownIcon> = {
  title: "Components/Icons/ChevronDown",
  component: ChevronDownIcon,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof ChevronDownIcon>;

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
      data-testid="chevron-down-wrapper"
    >
      <ChevronDownIcon />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector("svg");

    await expect(svg).toBeInTheDocument();
    await expect(svg).toHaveAttribute("viewBox", "0 0 14 9");
  },
};
